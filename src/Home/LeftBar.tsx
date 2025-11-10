import { useState } from "react";
import { tipsList } from "../pages/Tips";
import type { Tiptype } from "../Home/RightBar";


export const MarketsSidebar = () => {
  const markets = ["Over 2.5 Goals", "GG", "1X2", "Handicap", "BTTS"];
  const [activeMarket, setActiveMarket] = useState<string | null>(null);

  // Filter tips based on selected market
  const filteredTips: Tiptype[] = activeMarket
    ? tipsList.filter((tip) => tip.markets === activeMarket)
    : tipsList;

  const handleClick = (markets: string) => {
    setActiveMarket((prev) => (prev === markets ? null : markets));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-yellow-400 font-bold mb-4">Markets</h2>

      {/* Markets List */}
      <ul className="space-y-2 text-gray-300 mb-6">
        {markets.map((market) => (
          <li
            key={market}
            onClick={() => handleClick(market)}
            className={`cursor-pointer px-2 py-1 rounded transition ${
              activeMarket === market
                ? "bg-yellow-400 text-black font-semibold"
                : "hover:text-yellow-400"
            }`}
          >
            {market}
          </li>
        ))}
      </ul>

      {/* Today’s Tips filtered by market */}
      <div>
        <h3 className="text-yellow-400 font-semibold mb-3 text-center">
          {activeMarket ? `Tips: ${activeMarket}` : "All Tips"}
        </h3>
        {filteredTips.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No tips available</p>
        ) : (
          <ul className="space-y-2">
            {filteredTips.map((tip) => (
              <li
                key={tip.id}
                className="bg-gray-700 p-2 rounded hover:bg-gray-600 transition text-sm"
              >
                <p className="text-yellow-300 font-semibold">
                  {tip.homeTeam} vs {tip.awayTeam}
                </p>
                <p className="text-gray-300">{tip.prediction}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
