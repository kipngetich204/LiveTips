import { useEffect, useState } from "react";
import { getTips, formatDate } from "../pages/Tips/Tips";
import { type MatchPrediction } from "../types/testingTips";

type TipWithDocId = MatchPrediction & { docId: string };

function getYesterdayDateUTC(): string {
  const now = new Date();
  // Extract the UTC components to build a midnight UTC date
  const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  // Safely subtract 1 day in UTC time
  utcToday.setUTCDate(utcToday.getUTCDate() - 1);
  return formatDate(utcToday);
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Create the date object strictly in UTC
  const date = new Date(Date.UTC(year, month - 1, day));
  
  // Force toLocaleDateString to render the UTC values, not local conversions
  return date.toLocaleDateString(undefined, { 
    month: "short", 
    day: "numeric", 
    year: "numeric",
    timeZone: "UTC" 
  });
}

function headlinePick(tip: MatchPrediction): { market: string; prediction: string } | null {
  const first = tip.predictions?.basic?.predictions?.[0];
  return first ? { market: first.market, prediction: first.prediction } : null;
}

export const YesterdayTips = () => {
  // Use the updated UTC yesterday calculation
  const yesterday = getYesterdayDateUTC();
  const today = formatDate(); // Uses your original UTC ISO string slice
  const [selectedDate, setSelectedDate] = useState(yesterday);
  const [tipsList, setTipsList] = useState<TipWithDocId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      setError(null);
      try {
        const tips = await getTips(selectedDate);
        setTipsList(tips);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [selectedDate]);

  const heading = selectedDate === yesterday ? "Yesterday's Results" : formatDisplayDate(selectedDate);

  return (
    <div className="bg-gray-800 rounded-lg p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-yellow-400 font-bold mb-3 text-center">{heading}</h2>

      <div className="mb-4 flex items-center justify-center gap-2">
        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
          className="bg-gray-700 text-gray-200 text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-yellow-400 [color-scheme:dark]"
        />
        {selectedDate !== yesterday && (
          <button
            type="button"
            onClick={() => setSelectedDate(yesterday)}
            className="text-xs text-yellow-400 hover:text-yellow-300 underline"
          >
            Reset
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400 text-center text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-center text-sm">{error}</p>
      ) : tipsList.length === 0 ? (
        <p className="text-gray-300 text-center">No results for this date.</p>
      ) : (
        <ul className="space-y-3">
          {tipsList.map((tip) => {
            const pick = headlinePick(tip);
            return (
              <li key={tip.id} className="bg-gray-700 rounded p-2 hover:bg-gray-600 transition">
                <p className="text-gray-300 text-sm">
                  {tip.homeTeam} vs {tip.awayTeam}
                </p>
                {pick && (
                  <p
                    className={`font-semibold text-sm ${
                      tip.status === "won"
                        ? "text-green-400"
                        : tip.status === "lost"
                        ? "text-red-500"
                        : "text-yellow-400"
                    }`}
                  >
                    {pick.market}: {pick.prediction} ({tip.status})
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

