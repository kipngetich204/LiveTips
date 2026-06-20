import { useEffect, useState } from "react";
import {getTips } from "../pages/Tips/Tips";
import { type MatchPrediction } from "../types/testingTips";

export const MarketsSidebar = () => {
  const markets = ["Over 2.5 Goals", "GG", "1X2", "Handicap", "BTTS"];
  const [activeMarket, setActiveMarket] = useState<string | null>(null);
  const [tipsList, setTipsList] = useState<MatchPrediction[]>([]);
  // Fetch tips on component mount
  useEffect(() => {
    const fetchTips = async () => {
      const tips = await getTips();
      setTipsList(tips);
    };
    fetchTips();
  }, []);

  // Filter tips based on selected market
  const filteredTips: MatchPrediction[] = activeMarket
    ? tipsList.filter((tip) => tip.markets === activeMarket)
    : tipsList;

  const handleClick = (market: string) => {
    setActiveMarket((prev) => (prev === market ? null : market));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 md:p-4 w-full">
      {/* Header */}
      <h2 className="text-yellow-400 font-bold text-lg md:text-xl mb-3 md:mb-4">
        Markets
      </h2>

      {/* Markets List - Horizontal scroll on mobile, vertical on desktop */}
      <div className="mb-4 md:mb-6">
        {/* Mobile: Horizontal scrollable chips */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
          {markets.map((market) => (
            <button
              key={market}
              onClick={() => handleClick(market)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeMarket === market
                  ? "bg-yellow-400 text-black font-semibold"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {market}
            </button>
          ))}
        </div>

        {/* Desktop: Vertical list */}
        <ul className="hidden md:block space-y-2 text-gray-300">
          {markets.map((market) => (
            <li
              key={market}
              onClick={() => handleClick(market)}
              className={`cursor-pointer px-3 py-2 rounded transition ${
                activeMarket === market
                  ? "bg-yellow-400 text-black font-semibold"
                  : "hover:text-yellow-400 hover:bg-gray-700"
              }`}
            >
              {market}
            </li>
          ))}
        </ul>
      </div>

      {/* Clear Filter Button */}
      {activeMarket && (
        <button
          onClick={() => setActiveMarket(null)}
          className="w-full mb-4 px-3 py-2 text-sm text-gray-400 hover:text-yellow-400 bg-gray-700 hover:bg-gray-600 rounded transition"
        >
          Clear Filter
        </button>
      )}

      {/* Filtered Tips Section */}
      <div>
        <h3 className="text-yellow-400 font-semibold text-sm md:text-base mb-3 text-center">
          {activeMarket ? `Tips: ${activeMarket}` : "All Tips"}
        </h3>
        
        {filteredTips.length === 0 ? (
          <p className="text-gray-400 text-xs md:text-sm text-center py-4">
            No tips available
          </p>
        ) : (
          <ul className="space-y-2 max-h-[400px] md:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
            {filteredTips.map((tip) => (
              <li
                key={tip.id}
                className="bg-gray-700 p-2 md:p-3 rounded hover:bg-gray-600 transition"
              >
                <p className="text-yellow-300 font-semibold text-xs md:text-sm">
                  {tip.homeTeam} vs {tip.awayTeam}
                </p>
                <p className="text-gray-300 text-xs md:text-sm mt-1">
                  {tip.prediction}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};