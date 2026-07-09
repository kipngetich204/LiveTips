import React from "react";
import { type MatchPrediction } from "../../../types/testingTips";

export const Statistics: React.FC<{ tip: MatchPrediction }> = ({ tip }) => {
  const hasProbabilities = !!tip.win_probabilities;
  const hasH2H = !!tip.h2h_summary;
  const hasForm = !!tip.form;

  if (!hasProbabilities && !hasH2H && !hasForm && !tip.expected_goals) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2">AI Analytics Data</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Win Probabilities Distributions */}
        {hasProbabilities && (
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Calculated Win Probability</h4>
            <div className="space-y-2">
              {/* Home Win */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-medium">{tip.homeTeam} Win</span>
                  <span className="font-bold text-white">{tip.win_probabilities?.home}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${tip.win_probabilities?.home}%` }}></div>
                </div>
              </div>
              {/* Draw */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-medium">Draw Chance</span>
                  <span className="font-bold text-white">{tip.win_probabilities?.draw}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gray-500 h-full rounded-full transition-all" style={{ width: `${tip.win_probabilities?.draw}%` }}></div>
                </div>
              </div>
              {/* Away Win */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-medium">{tip.awayTeam} Win</span>
                  <span className="font-bold text-white">{tip.win_probabilities?.away}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${tip.win_probabilities?.away}%` }}></div>
                </div>
              </div>
            </div>

            {tip.expected_goals && (
              <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs border-t border-gray-800/60">
                <div>
                  <span className="text-gray-500 block">Home xG</span>
                  <span className="font-bold text-white text-sm">{tip.expected_goals.home}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Away xG</span>
                  <span className="font-bold text-white text-sm">{tip.expected_goals.away}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* H2H Analytics and Current Form Data */}
        <div className="space-y-3">
          {hasH2H && (
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Head To Head (H2H) Historical Data</h4>
              <div className="grid grid-cols-3 gap-2 text-center bg-gray-900/60 p-2.5 rounded-lg border border-gray-800/40">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">Played</span>
                  <span className="text-sm font-bold text-white">{tip.h2h_summary?.played}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">Avg Goals</span>
                  <span className="text-sm font-bold text-yellow-400">{tip.h2h_summary?.avg_goals}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">Draws</span>
                  <span className="text-sm font-bold text-gray-400">{tip.h2h_summary?.draws}</span>
                </div>
              </div>
              {tip.h2h_summary?.last_meeting && (
                <p className="text-[11px] text-gray-500 mt-2 text-right italic">
                  Last Meeting: <span className="text-gray-300 font-semibold">{tip.h2h_summary.last_meeting}</span>
                </p>
              )}
            </div>
          )}

          {hasForm && (
            <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500 block mb-1">Home Form</span>
                <span className="font-mono bg-gray-900 px-2 py-1 rounded text-white tracking-widest">{tip.form?.home}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block mb-1">Away Form</span>
                <span className="font-mono bg-gray-900 px-2 py-1 rounded text-white tracking-widest">{tip.form?.away}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};