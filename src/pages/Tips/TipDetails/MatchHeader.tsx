import React from "react";
import { type MatchPrediction } from "../../../types/testingTips";

interface MatchHeaderProps {
  tip: MatchPrediction;
  onClose: () => void;
}

export const MatchHeader: React.FC<MatchHeaderProps> = ({ tip, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-gray-950 to-gray-900 p-5 sm:p-6 border-b border-gray-800 flex justify-between items-start relative">
      <div className="space-y-2 max-w-[85%]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-yellow-400/10 text-yellow-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-yellow-400/20">
            {tip.league}
          </span>
          {tip.league_round && (
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
              Round {tip.league_round}
            </span>
          )}
          {tip.tip_of_the_day && (
            <span className="bg-rose-500 text-white text-xs px-2.5 py-0.5 rounded-full font-black tracking-wide animate-pulse shadow-lg shadow-rose-500/20">
              🔥 TIP OF THE DAY
            </span>
          )}
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          {tip.homeTeam} <span className="text-gray-500 text-xl font-light">vs</span> {tip.awayTeam}
        </h2>
      </div>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 p-2 rounded-full transition-colors self-start"
        aria-label="Close modal"
      >
        <span className="text-xl block h-5 w-5 flex items-center justify-center leading-none">✕</span>
      </button>
    </div>
  );
};