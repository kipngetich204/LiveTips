import { useEffect, useMemo, useState } from "react";
import { getTips } from "../pages/Tips/Tips";
import { useAuth } from "../context/AuthContext";
import type {
  MatchPrediction,
  Prediction,
} from "../types/tips";
import { type TierKey, TIER_ORDER, getAccessibleTiers } from "../utils/Tieraccess ";

type FilteredTip = MatchPrediction & {
  tier: TierKey;
  prediction: Prediction;
};

export const MarketsSidebar = () => {
  const { user } = useAuth();

  const [tipsList, setTipsList] = useState<MatchPrediction[]>([]);
  const [activeMarket, setActiveMarket] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      const tips = await getTips();
      setTipsList(tips);
    };

    fetchTips();
  }, []);

  const allowedTiers: TierKey[] = useMemo(
    () => (user?.isAdmin ? TIER_ORDER : getAccessibleTiers(user?.type)),
    [user],
  );

  const markets = useMemo(() => {
    const unique = new Set<string>();

    tipsList.forEach((match) => {
      allowedTiers.forEach((tier) => {
        match.predictions[tier].predictions.forEach((prediction) => {
          unique.add(prediction.market);
        });
      });
    });

    return [...unique].sort();
  }, [tipsList, allowedTiers]);

  const filteredTips = useMemo(() => {
    const list: FilteredTip[] = [];

    tipsList.forEach((match) => {
      allowedTiers.forEach((tier) => {
        match.predictions[tier].predictions.forEach((prediction) => {
          if (!activeMarket || prediction.market === activeMarket) {
            list.push({
              ...match,
              tier,
              prediction,
            });
          }
        });
      });
    });

    return list;
  }, [tipsList, allowedTiers, activeMarket]);

  return (
    <div className="bg-surface-raised border border-border rounded-card p-4">
      <h2 className="text-text-primary text-xl font-bold mb-4">
        Markets
      </h2>

      {/* Mobile */}
      <div className="flex gap-2 overflow-x-auto md:hidden pb-2">
        {markets.map((market) => (
          <button
            key={market}
            onClick={() =>
              setActiveMarket((prev) =>
                prev === market ? null : market
              )
            }
            className={`min-h-11 px-3 py-2 rounded-control whitespace-nowrap transition-colors ${
              activeMarket === market
                ? "bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black"
                : "bg-surface-muted text-text-primary hover:bg-surface"
            }`}
          >
            {market}
          </button>
        ))}
      </div>

      {/* Desktop */}
      <ul className="hidden md:block space-y-2 mb-4">
        {markets.map((market) => (
          <li
            key={market}
            onClick={() =>
              setActiveMarket((prev) =>
                prev === market ? null : market
              )
            }
            className={`cursor-pointer min-h-11 flex items-center px-3 py-2 rounded-control transition-colors ${
              activeMarket === market
                ? "bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black"
                : "hover:bg-surface-muted text-text-primary"
            }`}
          >
            {market}
          </li>
        ))}
      </ul>

      {activeMarket && (
        <button
          className="mb-4 min-h-11 w-full bg-surface-muted hover:bg-surface border border-border text-text-primary rounded-control transition-colors"
          onClick={() => setActiveMarket(null)}
        >
          Clear Filter
        </button>
      )}

      <h3 className="text-text-primary font-semibold mb-3">
        {activeMarket ?? "All Markets"}
      </h3>

      <div className="space-y-2 max-h-125 overflow-y-auto">
        {filteredTips.length === 0 ? (
          <p className="text-text-secondary text-sm">
            No predictions found.
          </p>
        ) : (
          filteredTips.map((tip) => (
            <div
              key={`${tip.id}-${tip.tier}-${tip.prediction.market}`}
              className="bg-surface-muted rounded-control p-3"
            >
              <p className="text-text-primary font-semibold">
                {tip.homeTeam} vs {tip.awayTeam}
              </p>

              <p className="text-text-secondary text-sm mt-1">
                <strong>{tip.prediction.market}</strong>
              </p>

              <p className="text-text-primary">
                {tip.prediction.prediction}
              </p>

              <p className="text-xs font-data text-text-secondary mt-1">
                {tip.tier.replace("_", " ")} • {tip.prediction.confidence}%
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};