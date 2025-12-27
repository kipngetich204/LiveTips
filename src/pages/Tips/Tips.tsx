import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebase";
import type { Tiptype } from "../../types/tips";
import { type FullFixture } from "../../types/livescore";
import { LoadingPage } from "../Loading";
import { ErrorPage } from "../Error";
import { TipDetails } from "./TipDetails";

const API_BASE_URL = "https://backend-livetips.onrender.com";

// ✅ Fetch tips from Firestore
export async function getTips(): Promise<Tiptype[]> {
  const querySnapshot = await getDocs(collection(db, "tips"));
  const tipsList: Tiptype[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as Tiptype[];
  return tipsList;
}

// ✅ Fetch fixtures from API
async function getFixtures(): Promise<FullFixture[]> {
  const res = await fetch(`${API_BASE_URL}/livescore`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  
  // The API returns { fixtures: FullFixture[], ... }
  return data.fixtures || [];
}

// ✅ Match prediction logic
function checkPredictionResult(
  tip: Tiptype,
  fixture: FullFixture
): "won" | "lost" | "pending" {
  const { goals } = fixture;
  const homeGoals = goals?.home ?? 0;
  const awayGoals = goals?.away ?? 0;
  const totalGoals = homeGoals + awayGoals;

  const prediction = tip.prediction.toLowerCase();
  const market = tip.markets.toLowerCase();

  // Check based on market type
  if (market.includes("over 2.5") || prediction.includes("over 2.5")) {
    return totalGoals > 2.5 ? "won" : "lost";
  }

  if (market.includes("under 2.5") || prediction.includes("under 2.5")) {
    return totalGoals < 2.5 ? "won" : "lost";
  }

  if (
    market.includes("gg") ||
    market.includes("btts") ||
    prediction.includes("gg") ||
    prediction.includes("btts")
  ) {
    return homeGoals > 0 && awayGoals > 0 ? "won" : "lost";
  }

  if (
    market.includes("1x2") ||
    prediction.includes("home win") ||
    prediction.includes("away win") ||
    prediction.includes("draw")
  ) {
    if (prediction.includes("home win") || prediction.includes("1")) {
      return homeGoals > awayGoals ? "won" : "lost";
    }
    if (prediction.includes("away win") || prediction.includes("2")) {
      return awayGoals > homeGoals ? "won" : "lost";
    }
    if (prediction.includes("draw") || prediction.includes("x")) {
      return homeGoals === awayGoals ? "won" : "lost";
    }
  }

  // Default: check if prediction mentions specific score
  if (prediction.includes("over") && prediction.match(/\d+\.?\d*/)) {
    const threshold = parseFloat(prediction.match(/\d+\.?\d*/)?.[0] || "0");
    return totalGoals > threshold ? "won" : "lost";
  }

  return "pending";
}

// ✅ Update tip status in Firestore
async function updateTipStatus(
  tipId: string,
  status: Tiptype["status"],
  score: string,
  matchStatus: "Live" | "Finished" | "Not Started"
) {
  const tipRef = doc(db, "tips", tipId);
  await updateDoc(tipRef, {
    status,
    score,
    matchStatus,
    lastUpdated: new Date().toISOString(),
  });
}

// ✅ Map API fixture status to our status format
function mapFixtureStatus(
  status?: string
): "Not Started" | "Live" | "Finished" {
  switch (status) {
    case "FT":
    case "AET":
    case "PEN":
      return "Finished";
    case "LIVE":
    case "1H":
    case "2H":
    case "HT":
    case "ET":
    case "P":
      return "Live";
    case "NS":
    case "TBD":
    default:
      return "Not Started";
  }
}

export const Tips = () => {
  const { user } = useAuth();
  const [tips, setTips] = useState<Tiptype[]>([]);
  const [fixtures, setFixtures] = useState<FullFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedTip, setSelectedTip] = useState<Tiptype | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      try {
        setError(null);
        if (!updating) setLoading(true);

        // Fetch both tips and fixtures in parallel
        const [tipsData, fixturesData] = await Promise.all([
          getTips(),
          getFixtures(),
        ]);

        setFixtures(fixturesData);

        // Create a map of fixtures by ID for quick lookup
        const fixtureMap = new Map(
          fixturesData.map((f) => [f.fixture?.id?.toString(), f])
        );

        // Update tips with live data
        const updatedTips = await Promise.all(
          tipsData.map(async (tip) => {
            const fixture = fixtureMap.get(tip.livescoreId);

            if (!fixture) return tip;

            const rawMatchStatus = fixture.fixture?.status?.short || "NS";
            const homeGoals = fixture.goals?.home ?? 0;
            const awayGoals = fixture.goals?.away ?? 0;
            const score = `${homeGoals} - ${awayGoals}`;
            const matchStatus = mapFixtureStatus(rawMatchStatus);

            // Determine new status
            let newStatus: Tiptype["status"] = tip.status;

            if (matchStatus === "Finished") {
              // Match finished - check if prediction was correct
              newStatus = checkPredictionResult(tip, fixture);

              // Update in Firestore if status changed
              if (newStatus !== tip.status || tip.score !== score) {
                setUpdating(true);
                await updateTipStatus(tip.id, newStatus, score, "Finished");
              }
            } else if (matchStatus === "Live") {
              newStatus = "pending";
              if (
                tip.matchStatus !== "Live" ||
                tip.score !== score
              ) {
                await updateTipStatus(tip.id, "pending", score, "Live");
              }
            } else {
              newStatus = "pending";
              if (tip.matchStatus !== "Not Started") {
                await updateTipStatus(tip.id, "pending", "- : -", "Not Started");
              }
            }

            return {
              ...tip,
              status: newStatus,
              score,
              matchStatus: matchStatus,
            };
          })
        );

        setTips(updatedTips);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Error fetching data"
        );
      } finally {
        setLoading(false);
        setUpdating(false);
      }
    };

    fetchAndUpdateData();

    // Auto-refresh every 2 minutes (120000ms) for live updates
    const interval = setInterval(fetchAndUpdateData, 120000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Filter tips based on user type
  const displayedTips =
    user?.type === "premium"
      ? tips.filter((tip) => tip.type === "premium" || tip.type === "basic")
      : tips.filter((tip) => tip.type === "basic");

  if (loading && !tips.length) {
    return <LoadingPage />;
  }

  if (error && !tips.length) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="w-full bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center flex-1">
            Today's Betting Tips
          </h2>
          {updating && (
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
              Updating...
            </div>
          )}
        </div>

        {/* Error banner */}
        {error && tips.length > 0 && (
          <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm">
            ⚠️ Could not fetch latest updates. Showing cached data.
          </div>
        )}

        {!displayedTips.length ? (
          <div className="text-center bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-300">
              No tips available right now. Check back later!
            </p>
          </div>
        ) : (
          <>
            {/* 📱 Mobile view: card layout */}
            <div className="space-y-4 sm:hidden">
              {displayedTips.map((tip) => (
                <div
                  key={tip.id}
                  onClick={() => {
                    setModalLoading(true);
                    setTimeout(() => {
                      setSelectedTip(tip);
                      setModalLoading(false);
                    }, 300);
                  }}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md cursor-pointer hover:border-yellow-400 hover:shadow-lg hover:bg-gray-750 transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-yellow-300">
                      {tip.homeTeam} vs {tip.awayTeam}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tip.type === "premium"
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                          : "bg-green-500 text-black"
                      }`}
                    >
                      {tip.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Date and Time */}
                  <div className="flex gap-3 mb-2 text-xs text-gray-400">
                    {tip.date && <span>📅 {tip.date}</span>}
                    {tip.time && <span>🕒 {tip.time}</span>}
                  </div>

                  {/* Score and Match Status */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-2xl font-bold text-white">
                      {tip.score || "- : -"}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        tip.matchStatus === "Live"
                          ? "bg-red-600 text-white animate-pulse"
                          : tip.matchStatus === "Finished"
                          ? "bg-gray-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {tip.matchStatus || "Pending"}
                    </span>
                  </div>

                  <p className="text-green-400 font-medium text-sm mb-1">
                    <strong>Prediction:</strong> {tip.prediction}
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    <strong>Market:</strong> {tip.markets}
                  </p>
                  <p className="text-gray-300 text-sm leading-snug mb-2">
                    <strong>Reason:</strong> {tip.reason}
                  </p>

                  {/* Status Badge */}
                  <div className="flex justify-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        tip.status === "won"
                          ? "bg-green-500 text-white"
                          : tip.status === "lost"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {tip.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 💻 Desktop view: table layout */}
            <div className="hidden sm:block overflow-x-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-yellow-400 text-gray-900">
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Match</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Prediction</th>
                    <th className="py-3 px-4">Market</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4 text-center">Result</th>
                    <th className="py-3 px-4 text-center">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTips.map((tip, index) => (
                    <tr
                      key={tip.id}
                      onClick={() => {
                        setModalLoading(true);
                        setTimeout(() => {
                          setSelectedTip(tip);
                          setModalLoading(false);
                        }, 300);
                      }}
                      className={`hover:bg-gray-700 transition cursor-pointer ${
                        index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {tip.date && <div>{tip.date}</div>}
                          {tip.time && (
                            <div className="text-gray-400">{tip.time}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-yellow-300">
                          {tip.homeTeam}
                        </div>
                        <div className="text-gray-400 text-sm">vs</div>
                        <div className="font-semibold">{tip.awayTeam}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="text-xl font-bold text-white">
                          {tip.score || "- : -"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            tip.matchStatus === "Live"
                              ? "bg-red-600 text-white animate-pulse"
                              : tip.matchStatus === "Finished"
                              ? "bg-gray-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {tip.matchStatus || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-green-400 font-medium">
                        {tip.prediction}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {tip.markets}
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm max-w-xs">
                        {tip.reason}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            tip.status === "won"
                              ? "bg-green-500 text-white"
                              : tip.status === "lost"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-black"
                          }`}
                        >
                          {tip.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            tip.type === "premium"
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                              : "bg-green-500 text-black"
                          }`}
                        >
                          {tip.type.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Tip Details Modal */}
        <TipDetails
          tip={selectedTip}
          isLoading={modalLoading}
          onClose={() => setSelectedTip(null)}
        />

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-400">
            {user?.type === "premium"
              ? "You have access to both basic and premium tips."
              : "Upgrade to premium to unlock exclusive VIP tips!"}
          </p>
          <p className="text-xs text-gray-500">
            Auto-updates every 2 minutes • Last updated:{" "}
            {lastUpdate.toLocaleTimeString()}
          </p>
          {fixtures.length > 0 && (
            <p className="text-xs text-gray-600">
              {fixtures.length} live match{fixtures.length !== 1 ? "es" : ""}{" "}
              being tracked
            </p>
          )}
        </div>
      </div>
    </div>
  );
};