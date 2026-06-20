import { useEffect, useState } from "react";
import { getTips } from "../pages/Tips/Tips";
import { type MatchPrediction } from "../types/testingTips";



/* export interface Tiptype {
  id: string;
  time: string;
  date: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  reason?: string;
  type: "basic" | "premium";
  status: "won" | "lost" | "pending";
  markets: "Over 2.5 Goals" | "GG" | "1X2" | "Handicap" | "BTTS";
} */







export const YesterdayTips = () => {
    const [tipsList, setTipsList] = useState<MatchPrediction[]>([]);
  // Fetch tips on component mount
  useEffect(() => {
    const fetchTips = async () => {
      const tips = await getTips();
      setTipsList(tips);
    };
    fetchTips();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-yellow-400 font-bold mb-4 text-center">Yesterday's Results</h2>
      {tipsList.length === 0 ? (
        <p className="text-gray-300 text-center">No results from yesterday.</p>
      ) : (
        <ul className="space-y-3">
          {tipsList.map((tip) => (
            <li key={tip.id} className="bg-gray-700 rounded p-2 hover:bg-gray-600 transition">
              <p className="text-gray-300 text-sm">{tip.homeTeam} vs {tip.awayTeam}</p>
              <p className={`font-semibold ${tip.status === "won" ? "text-green-400" : tip.status === "lost" ? "text-red-500" : "text-yellow-400"}`}>
                {tip.prediction} ({tip.status})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
