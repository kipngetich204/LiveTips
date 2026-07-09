import { useEffect, useMemo, useState } from "react";
import { getTips } from "../pages/Tips/Tips";
import { useAuth } from "../context/AuthContext";
import type {
  MatchPrediction,
  Prediction,
} from "../types/testingTips";

type TierKey = "basic" | "premium" | "super_premium";

const TIER_ACCESS: Record<string, TierKey[]> = {
  basic: ["basic"],
  premium: ["basic", "premium"],
  super_premium: ["basic", "premium", "super_premium"],
  admin: ["basic", "premium", "super_premium"],
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

  const allowedTiers: TierKey[] = useMemo(() => {
    if (user?.isAdmin) {
      return TIER_ACCESS.admin;
    }

    return TIER_ACCESS[user?.type ?? "basic"];
  }, [user]);

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
    const list: Array<
      MatchPrediction & {
        tier: TierKey;
        prediction: Prediction;
      }
    > = [];

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
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-yellow-400 text-xl font-bold mb-4">
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
            className={`px-3 py-2 rounded whitespace-nowrap ${
              activeMarket === market
                ? "bg-yellow-400 text-black"
                : "bg-gray-700 text-white"
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
            className={`cursor-pointer px-3 py-2 rounded ${
              activeMarket === market
                ? "bg-yellow-400 text-black"
                : "hover:bg-gray-700 text-white"
            }`}
          >
            {market}
          </li>
        ))}
      </ul>

      {activeMarket && (
        <button
          className="mb-4 w-full bg-gray-700 hover:bg-gray-600 rounded py-2"
          onClick={() => setActiveMarket(null)}
        >
          Clear Filter
        </button>
      )}

      <h3 className="text-yellow-400 font-semibold mb-3">
        {activeMarket ?? "All Markets"}
      </h3>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredTips.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No predictions found.
          </p>
        ) : (
          filteredTips.map((tip) => (
            <div
              key={`${tip.id}-${tip.tier}-${tip.prediction.market}`}
              className="bg-gray-700 rounded p-3"
            >
              <p className="text-yellow-300 font-semibold">
                {tip.homeTeam} vs {tip.awayTeam}
              </p>

              <p className="text-gray-300 text-sm mt-1">
                <strong>{tip.prediction.market}</strong>
              </p>

              <p className="text-white">
                {tip.prediction.prediction}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {tip.tier.replace("_", " ")} • {tip.prediction.confidence}%
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};