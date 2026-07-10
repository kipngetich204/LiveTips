import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig/firebase";
import { type FullFixture } from "../../types/livescore";
import { LoadingPage } from "../Loading";
import { ErrorPage } from "../Error";
import { TipDetails } from "./TipDetails/TipDetails";
import {
  type MatchPrediction,
  type DailyTipsDoc,
  type Prediction,
  type PredictionTier,
  type MatchPredictions,
} from "../../types/testingTips";

const API_BASE_URL = "https://backend-livetips.onrender.com";

type TierKey = keyof MatchPredictions; // "basic" | "premium" | "super_premium"

export function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Firestore / API fetching
// ---------------------------------------------------------------------------

export async function getTips(
  targetDate: string = formatDate()
): Promise<(MatchPrediction & { docId: string })[]> {
  const querySnapshot = await getDocs(collection(db, "dailyTips"));
  const tipsList = querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as (DailyTipsDoc & { docId: string })[];

  const dailyDoc = tipsList.find((d) => d.date === targetDate || d.matchStatus === "Live"); 

  // Each match needs to know which Firestore document it lives in,
  // since matches are nested inside a single day's document.
  return (dailyDoc?.matches ?? []).map((match) => ({
    ...match,
    docId: dailyDoc!.id,
  }));
}



async function getFixtures(): Promise<FullFixture[]> {
  const res = await fetch(`${API_BASE_URL}/livescore`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.fixtures || [];
}

// ---------------------------------------------------------------------------
// Prediction evaluation
//
// Each prediction now carries its own market + pick (e.g. "Over 2.5" / "Yes"),
// rather than the match having one single flat prediction. We evaluate each
// one individually against the final/live score. Markets we can't determine
// from a final score alone (First Team To Score, HT/FT without HT data,
// ambiguous Clean Sheet side) are left "pending" rather than guessed.
// ---------------------------------------------------------------------------

function parseThreshold(text: string): number | null {
  const match = text.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

function evaluateSingleMarket(
  market: string,
  prediction: string,
  homeGoals: number,
  awayGoals: number
): "won" | "lost" | "pending" {
  const m = market.toLowerCase();
  const p = prediction.toLowerCase().trim();
  const total = homeGoals + awayGoals;

  // Combined markets, e.g. "Home Win + Over 1.5"
  if (m.includes("+")) {
    const parts = m.split("+").map((part) => part.trim());
    const results = parts.map((part) => evaluateSingleMarket(part, "yes", homeGoals, awayGoals));
    if (results.includes("pending")) return "pending";
    return results.every((r) => r === "won") ? "won" : "lost";
  }

  if (m.includes("over")) {
    const threshold = parseThreshold(m) ?? parseThreshold(p);
    if (threshold == null) return "pending";
    const hit = total > threshold;
    const isYes = p === "yes" || p.includes("over");
    return isYes ? (hit ? "won" : "lost") : hit ? "lost" : "won";
  }

  if (m.includes("under")) {
    const threshold = parseThreshold(m) ?? parseThreshold(p);
    if (threshold == null) return "pending";
    const hit = total < threshold;
    const isYes = p === "yes" || p.includes("under");
    return isYes ? (hit ? "won" : "lost") : hit ? "lost" : "won";
  }

  if (m.includes("btts") || m.includes("both teams to score") || m.includes("gg")) {
    const hit = homeGoals > 0 && awayGoals > 0;
    const isYes = p === "yes";
    return isYes ? (hit ? "won" : "lost") : hit ? "lost" : "won";
  }

  if (m.includes("clean sheet")) {
    // Market text should specify the side, e.g. "Clean Sheet (Home)".
    // If it doesn't, we can't safely guess which team it refers to.
    const sideKnown = m.includes("home") || m.includes("away");
    if (!sideKnown) return "pending";
    const isAway = m.includes("away");
    const cleanSheet = isAway ? homeGoals === 0 : awayGoals === 0;
    const isYes = p === "yes";
    return isYes ? (cleanSheet ? "won" : "lost") : cleanSheet ? "lost" : "won";
  }

  if (m.includes("double chance")) {
    const pick = p.replace(/\s/g, "");
    if (pick === "1x") return homeGoals >= awayGoals ? "won" : "lost";
    if (pick === "x2") return awayGoals >= homeGoals ? "won" : "lost";
    if (pick === "12") return homeGoals !== awayGoals ? "won" : "lost";
    return "pending";
  }

  if (m.includes("draw no bet")) {
    if (homeGoals === awayGoals) return "pending"; // void/refund in real markets
    if (p.includes("home")) return homeGoals > awayGoals ? "won" : "lost";
    if (p.includes("away")) return awayGoals > homeGoals ? "won" : "lost";
    return "pending";
  }

  if (m.includes("home win")) return homeGoals > awayGoals ? "won" : "lost";
  if (m.includes("away win")) return awayGoals > homeGoals ? "won" : "lost";

  if (m.includes("match result") || m.includes("1x2")) {
    if (p === "1" || p.includes("home")) return homeGoals > awayGoals ? "won" : "lost";
    if (p === "2" || p.includes("away")) return awayGoals > homeGoals ? "won" : "lost";
    if (p === "x" || p.includes("draw")) return homeGoals === awayGoals ? "won" : "lost";
    return "pending";
  }

  if (m.includes("asian handicap")) {
    const handicapMatch = m.match(/\(([-+]?\d+(\.\d+)?)\)/);
    const handicap = handicapMatch ? parseFloat(handicapMatch[1]) : 0;
    if (p === "1" || p.includes("home")) return homeGoals + handicap > awayGoals ? "won" : "lost";
    if (p === "2" || p.includes("away")) return awayGoals + handicap > homeGoals ? "won" : "lost";
    return "pending";
  }

  if (m.includes("correct score")) {
    return p === `${homeGoals}-${awayGoals}` ? "won" : "lost";
  }

  if (m.includes("winning margin")) {
    if (p.includes("draw")) return homeGoals === awayGoals ? "won" : "lost";
    const marginMatch = p.match(/(\d+)/);
    const predictedMargin = marginMatch ? parseInt(marginMatch[1], 10) : null;
    if (predictedMargin == null) return "pending";
    const margin = Math.abs(homeGoals - awayGoals);
    if (p.includes("home")) return homeGoals > awayGoals && margin === predictedMargin ? "won" : "lost";
    if (p.includes("away")) return awayGoals > homeGoals && margin === predictedMargin ? "won" : "lost";
    return "pending";
  }

  // Needs event-level data (goal timeline / HT score) we don't have here.
  if (m.includes("first team to score") || m.includes("ht/ft")) {
    return "pending";
  }

  return "pending";
}

function evaluateTier(tier: PredictionTier, homeGoals: number, awayGoals: number): PredictionTier {
  return {
    ...tier,
    predictions: tier.predictions.map((pred: Prediction) => {
      const outcome = evaluateSingleMarket(pred.market, pred.prediction, homeGoals, awayGoals);
      return { ...pred, result: outcome === "pending" ? null : outcome };
    }),
  };
}

// ---------------------------------------------------------------------------
// Firestore updates
// ---------------------------------------------------------------------------

async function updateTipInFirestore(
  docId: string,
  tipId: string,
  matches: MatchPrediction[]
) {
  const tipRef = doc(db, "dailyTips", docId);
  console.log(`Updating Firestore doc ${docId} for tip ${tipId} with ${matches.length} matches`);
  await updateDoc(tipRef, { matches });
}

function mapFixtureStatus(status?: string): "Not Started" | "Live" | "Finished" {
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

// Headline pick used for the card-level won/lost/pending badge.
// We use the first "basic" market since it's visible to every user
// and represents the day's primary recommendation.
function headlineStatus(predictions: MatchPredictions): "pending" | "won" | "lost" {
  const first = predictions.basic?.predictions?.[0];
  if (!first || first.result == null) return "pending";
  return first.result === "won" ? "won" : "lost";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type TipWithDocId = MatchPrediction & { docId: string };

export const Tips = () => {
  const { user } = useAuth();
  const [tips, setTips] = useState<TipWithDocId[]>([]);
  const [fixtures, setFixtures] = useState<FullFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedTip, setSelectedTip] = useState<MatchPrediction | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Ordered low -> high. Extend here if a new user tier is added later
  // (e.g. "super_premium") — everything below reads from this one place.
  const TIER_ORDER: TierKey[] = ["basic", "premium", "super_premium"];
  const userTierIndex = TIER_ORDER.includes(user?.type as TierKey)
    ? TIER_ORDER.indexOf(user!.type as TierKey)
    : 0;
  const isPremiumUser = userTierIndex > 0;

  // The user's own tier, plus every tier below it (visible but collapsed by default).
  const accessibleTiers: TierKey[] = TIER_ORDER.slice(0, userTierIndex + 1);
  const primaryTier: TierKey = TIER_ORDER[userTierIndex];

  // Tracks which tiers are expanded per-card, keyed by `${tipId}:${tier}`.
  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({});
  const isTierOpen = (tipId: string, tier: TierKey) => {
    const key = `${tipId}:${tier}`;
    if (key in openTiers) return openTiers[key];
    return tier === primaryTier; // default: only the user's own tier is expanded
  };
  const toggleTier = (tipId: string, tier: TierKey) => {
    const key = `${tipId}:${tier}`;
    setOpenTiers((prev) => ({ ...prev, [key]: !isTierOpen(tipId, tier) }));
  };

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      try {
        setError(null);
        if (!updating) setLoading(true);

        const [tipsData, fixturesData] = await Promise.all([getTips(), getFixtures()]);
        setFixtures(fixturesData);

        const fixtureMap = new Map(
          fixturesData.map((f) => [f.fixture?.id?.toString(), f])
        );

        // Group tips by their Firestore document so we can write back
        // the whole `matches` array per document rather than per-match.
        const byDoc = new Map<string, TipWithDocId[]>();

        const updatedTips = tipsData.map((tip) => {
          const fixture = fixtureMap.get(tip.livescoreId);
          if (!fixture) return tip;

          const rawStatus = fixture.fixture?.status?.short || "NS";
          const homeGoals = fixture.goals?.home ?? 0;
          const awayGoals = fixture.goals?.away ?? 0;
          const score = `${homeGoals} - ${awayGoals}`;
          const matchStatus = mapFixtureStatus(rawStatus);

          let predictions = tip.predictions;
          let status = tip.status;

          if (matchStatus === "Finished") {
            predictions = {
              basic: evaluateTier(tip.predictions.basic, homeGoals, awayGoals),
              premium: evaluateTier(tip.predictions.premium, homeGoals, awayGoals),
              super_premium: evaluateTier(tip.predictions.super_premium, homeGoals, awayGoals),
            };
            status = headlineStatus(predictions);
          } else {
            status = "pending";
          }

          const updated: TipWithDocId = {
            ...tip,
            score,
            matchStatus,
            status,
            predictions,
          };

          const changed =
            tip.score !== score || tip.matchStatus !== matchStatus || tip.status !== status;

          if (changed) {
            const existing = byDoc.get(tip.docId) ?? [];
            byDoc.set(tip.docId, [...existing, updated]);
          }

          return updated;
        });

        // Persist any changed matches, grouped by document.
        if (byDoc.size > 0) {
          setUpdating(true);
          await Promise.all(
            Array.from(byDoc.entries()).map(async ([docId, changedMatches]) => {
              // Merge changed matches back into the full match list for that doc
              const fullList = updatedTips
                .filter((t) => t.docId === docId)
                .map(({ docId: _drop, ...rest }) => rest);
              await updateTipInFirestore(docId, changedMatches[0].id, fullList);
            })
          );
        }

        setTips(updatedTips);
        setLastUpdate(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
        setUpdating(false);
      }
    };

    fetchAndUpdateData();
    const interval = setInterval(fetchAndUpdateData, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !tips.length) return <LoadingPage />;
  if (error && !tips.length) return <ErrorPage message={error} />;

  const statusBadgeClasses = (status: "pending" | "won" | "lost") =>
    status === "won"
      ? "bg-green-500 text-white"
      : status === "lost"
      ? "bg-red-500 text-white"
      : "bg-yellow-500 text-black";

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

        {error && tips.length > 0 && (
          <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm">
            ⚠️ Could not fetch latest updates. Showing cached data.
          </div>
        )}

        {!tips.length ? (
          <div className="text-center bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-300">No tips available right now. Check back later!</p>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
          >
            {tips.map((tip) => {
              const badgeStatus = headlineStatus(tip.predictions);
              return (
                <div
                  key={tip.id}
                  onClick={() => {
                    setModalLoading(true);
                    setTimeout(() => {
                      setSelectedTip(tip);
                      setModalLoading(false);
                    }, 300);
                  }}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md cursor-pointer hover:border-yellow-400 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-yellow-300">
                      {tip.homeTeam} vs {tip.awayTeam}
                    </h3>
                    {tip.tip_of_the_day && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                        TIP OF THE DAY
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 mb-2 text-xs text-gray-400">
                    <span>🏆 {tip.league} · {tip.league_round}</span>
                  </div>
                  <div className="flex gap-3 mb-2 text-xs text-gray-400">
                    {tip.date && <span>📅 {tip.date}</span>}
                    {tip.time && <span>🕒 {tip.time}</span>}
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <div className="text-2xl font-bold text-white">{tip.score || "- : -"}</div>
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

                  <p className="text-gray-300 text-sm leading-snug mb-3">{tip.reason}</p>

                  {accessibleTiers.map((tierKey) => {
                    const tier = tip.predictions[tierKey];
                    if (!tier?.predictions?.length) return null;
                    const open = isTierOpen(tip.id, tierKey);
                    return (
                      <div key={tierKey} className="mb-2 last:mb-0 border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTier(tip.id, tierKey);
                          }}
                          className="w-full flex items-center justify-between px-2 py-1.5 bg-gray-900/40 hover:bg-gray-900/70 transition-colors"
                        >
                          <span
                            className={`text-xs font-bold uppercase tracking-wide ${
                              tierKey === "basic"
                                ? "text-green-400"
                                : tierKey === "premium"
                                ? "text-yellow-400"
                                : "text-orange-400"
                            }`}
                          >
                            {tierKey.replace("_", " ")}
                            {tierKey === primaryTier && (
                              <span className="ml-2 text-[10px] text-gray-400 font-normal">(your plan)</span>
                            )}
                          </span>
                          <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
                        </button>
                        {open && (
                          <div className="space-y-1 p-2">
                            {tier.predictions.map((pred, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center bg-gray-900/60 rounded px-2 py-1 text-sm"
                              >
                                <span className="text-gray-300">
                                  {pred.market}: <span className="text-green-400 font-medium">{pred.prediction}</span>
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadgeClasses(
                                    pred.result === "won" ? "won" : pred.result === "lost" ? "lost" : "pending"
                                  )}`}
                                >
                                  {(pred.result ?? "pending").toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-end mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeClasses(badgeStatus)}`}>
                      {badgeStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <TipDetails tip={selectedTip} isLoading={modalLoading} onClose={() => setSelectedTip(null)} />

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-400">
            {isPremiumUser
              ? "You have access to basic, premium, and VIP tips."
              : "Upgrade to premium to unlock exclusive VIP tips!"}
          </p>
          <p className="text-xs text-gray-500">
            Auto-updates every 2 minutes • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
          {fixtures.length > 0 && (
            <p className="text-xs text-gray-600">
              {fixtures.length} live match{fixtures.length !== 1 ? "es" : ""} being tracked
            </p>
          )}
        </div>
      </div>
    </div>
  );
};