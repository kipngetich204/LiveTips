import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Star, Flame } from "lucide-react";
import { getTips } from "../pages/Tips/Tips";
import { useAuth } from "../context/AuthContext";
import { type MatchPrediction } from "../types/tips";
import { type TierKey } from "../utils/Tieraccess ";

interface MarqueeItem {
  id: string;
  icon: typeof Star;
  colorClass: string;
  text: string;
}

const FALLBACK_ITEMS: MarqueeItem[] = [
  { id: "fallback", icon: Flame, colorClass: "text-info", text: "Check back soon for today's live tips" },
];

function iconFor(tip: MatchPrediction, result: string | null): { icon: typeof Star; colorClass: string } {
  if (tip.tip_of_the_day) return { icon: Star, colorClass: "text-warning" };
  if (result === "won") return { icon: CheckCircle2, colorClass: "text-success" };
  if (result === "lost") return { icon: XCircle, colorClass: "text-danger" };
  return { icon: Flame, colorClass: "text-info" };
}

// Builds one marquee entry per market in the user's own tier — that tier is
// always present in `tip.predictions`, guest/basic included, so no fallback
// needed beyond an empty result when a match simply has no picks yet.
function buildMarqueeItems(tips: MatchPrediction[], tier: TierKey): MarqueeItem[] {
  const items: MarqueeItem[] = [];
  for (const tip of tips) {
    const predictions = tip.predictions?.[tier]?.predictions ?? [];
    predictions.forEach((pred, i) => {
      const { icon, colorClass } = iconFor(tip, pred.result);
      items.push({
        id: `${tip.id}-${i}`,
        icon,
        colorClass,
        text: `${tip.homeTeam} vs ${tip.awayTeam}: ${pred.market} — ${pred.prediction}`,
      });
    });
  }
  return items;
}

export const Marquee = () => {
  const { primaryTier } = useAuth();
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const tips = await getTips();
        if (cancelled) return;
        setItems(buildMarqueeItems(tips, primaryTier));
      } catch (err) {
        console.error("Error loading marquee tips:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 120000); // stay in sync with live score updates elsewhere
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [primaryTier]);

  const marqueeItems = items.length > 0 ? items : FALLBACK_ITEMS;
  const repeated = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-3 sm:my-8 sm:px-4">
      <div className="bg-brand-black rounded-card shadow-card-hover p-[2px]">
        <div className="bg-surface-raised rounded-card p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-surface-muted ring-2 ring-border">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-text-primary">
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              <div>
                <div className="text-xs sm:text-sm text-text-secondary">
                  {loading ? "Loading signals..." : "Live Signals"}
                </div>
                <div className="text-sm sm:text-lg font-semibold text-text-primary">Win more with live tips</div>
              </div>
            </div>

            <span className="text-[10px] sm:text-xs uppercase font-semibold text-text-primary bg-surface-muted rounded-full px-2 py-1 whitespace-nowrap">
              {primaryTier.replace("_", " ")}
            </span>
          </div>

          {/* MARQUEE */}
          <div className="overflow-hidden rounded-control border border-border bg-surface-muted p-2 sm:p-3">
            <div className="flex animate-marquee hover:pause">
              {repeated.map((item, i) => {
                const Icon = item.icon;
                return (
                  <span
                    key={`${item.id}-${i}`}
                    className="
                      mx-2 sm:mx-3 px-2 sm:px-3 py-1
                      bg-surface rounded-full border border-border
                      inline-flex items-center gap-1.5
                      text-text-primary text-sm sm:text-lg
                      font-medium whitespace-nowrap
                    "
                  >
                    <Icon size={16} className={item.colorClass} aria-hidden="true" />
                    {item.text}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-text-secondary">Hover to pause</div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        /* Slower scrolling on small screens */
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 26s;
          }
        }

        .hover\\:pause:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};