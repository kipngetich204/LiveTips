// RightBar.tsx (YesterdayTips)
import { useEffect, useState } from "react";
import { getTips, formatDate } from "../pages/Tips/Tips";
import { type MatchPrediction } from "../types/tips";

type TipWithDocId = MatchPrediction & { docId: string };

function getYesterdayDateUTC(): string {
  const now = new Date();
  const utcToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  utcToday.setUTCDate(utcToday.getUTCDate() - 1);
  return formatDate(utcToday);
}

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}

function headlinePick(tip: MatchPrediction) {
  const first = tip.predictions?.basic?.predictions?.[0];
  return first ? { market: first.market, prediction: first.prediction } : null;
}

export const YesterdayTips = () => {
  const yesterday = getYesterdayDateUTC();
  const today = formatDate();
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

  // Status mapping to keep UI clean and descriptive
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "won":
        return { text: "WON", className: "bg-success/10 text-success border-success/20" };
      case "lost":
        return { text: "LOST", className: "bg-danger/10 text-danger border-danger/20" };
      default:
        return { text: "PENDING", className: "bg-pending/10 text-pending border-pending/20" };
    }
  };

  return (
    <div className="bg-surface-raised border border-border rounded-card p-4 sticky top-16 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header section */}
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-text-primary text-base font-bold tracking-tight mb-2 text-center">
          {heading}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="w-full max-w-[160px] min-h-9 bg-surface text-text-primary text-xs rounded-control px-3 border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
          />
          {selectedDate !== yesterday && (
            <button
              type="button"
              onClick={() => setSelectedDate(yesterday)}
              className="min-h-9 px-3 text-xs font-medium text-text-secondary hover:text-text-primary border border-border rounded-control bg-surface hover:bg-surface-muted transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Content (Scrollable Container) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            <p className="text-text-secondary text-xs">Loading metrics...</p>
          </div>
        ) : error ? (
          <p className="text-danger text-center text-xs bg-danger/10 p-3 rounded-control border border-danger/20">{error}</p>
        ) : tipsList.length === 0 ? (
          <p className="text-text-secondary text-center text-sm py-8">No outcomes recorded for this date.</p>
        ) : (
          tipsList.map((tip) => {
            const pick = headlinePick(tip);
            const statusConfig = getStatusConfig(tip.status);

            return (
              <div 
                key={tip.id} 
                className="bg-surface-muted border border-border/40 rounded-control p-3 hover:border-border transition-all shadow-sm flex flex-col gap-2"
              >
                {/* Meta Row: League Info & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-text-secondary tracking-wider uppercase truncate max-w-[70%]">
                    {tip.league || "Unknown League"}
                  </span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${statusConfig.className}`}>
                    {statusConfig.text}
                  </span>
                </div>

                {/* Main Row: Teams and Live Score */}
                <div className="flex items-center justify-between gap-4 py-0.5">
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {tip.homeTeam}
                    </div>
                    <div className="text-sm font-medium text-text-primary truncate">
                      {tip.awayTeam}
                    </div>
                  </div>
                  
                  {/* Scoreboard block */}
                  {tip.score ? (
                    <div className="bg-surface border border-border px-2 py-1 rounded text-xs font-mono font-bold text-text-primary min-w-[42px] text-center tracking-wider whitespace-nowrap">
                      {tip.score.replace("-", " - ")}
                    </div>
                  ) : (
                    <div className="text-[11px] text-text-secondary italic font-mono">
                      {tip.time || "VS"}
                    </div>
                  )}
                </div>

                {/* Prediction Output Area */}
                {pick && (
                  <div className="mt-1 pt-2 border-t border-border/30 flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Tip:</span>
                    <span className="font-semibold text-text-primary text-right pl-2">
                      {pick.market} → <span className={
                        tip.status === "won" ? "text-success font-bold" : 
                        tip.status === "lost" ? "text-danger font-bold" : "text-pending font-bold"
                      }>{pick.prediction}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};