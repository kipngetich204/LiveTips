import React from "react";
import { type MatchPrediction } from "../../../types/tips";

export const Statistics: React.FC<{ tip: MatchPrediction }> = ({ tip }) => {
  const hasProbabilities = !!tip.win_probabilities;
  const hasH2H = !!tip.h2h_summary;
  const hasForm = !!tip.form;

  if (!hasProbabilities && !hasH2H && !hasForm && !tip.expected_goals) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary border-b border-border pb-2">AI Analytics Data</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Win Probabilities Distributions */}
        {hasProbabilities && (
          <div className="bg-surface-muted p-4 rounded-card border border-border space-y-3">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">AI Calculated Win Probability</h4>
            <div className="space-y-2">
              {/* Home Win */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary font-medium">{tip.homeTeam} Win</span>
                  <span className="font-bold font-data text-text-primary">{tip.win_probabilities?.home}%</span>
                </div>
                <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                  <div className="bg-info h-full rounded-full transition-all" style={{ width: `${tip.win_probabilities?.home}%` }}></div>
                </div>
              </div>
              {/* Draw */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary font-medium">Draw Chance</span>
                  <span className="font-bold font-data text-text-primary">{tip.win_probabilities?.draw}%</span>
                </div>
                <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                  <div className="bg-pending h-full rounded-full transition-all" style={{ width: `${tip.win_probabilities?.draw}%` }}></div>
                </div>
              </div>
              {/* Away Win */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary font-medium">{tip.awayTeam} Win</span>
                  <span className="font-bold font-data text-text-primary">{tip.win_probabilities?.away}%</span>
                </div>
                <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                  <div className="bg-warning h-full rounded-full transition-all" style={{ width: `${tip.win_probabilities?.away}%` }}></div>
                </div>
              </div>
            </div>

            {tip.expected_goals && (
              <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs border-t border-border">
                <div>
                  <span className="text-text-secondary block">Home xG</span>
                  <span className="font-bold font-data text-text-primary text-sm">{tip.expected_goals.home}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Away xG</span>
                  <span className="font-bold font-data text-text-primary text-sm">{tip.expected_goals.away}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* H2H Analytics and Current Form Data */}
        <div className="space-y-3">
          {hasH2H && (
            <div className="bg-surface-muted p-4 rounded-card border border-border">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Head To Head (H2H) Historical Data</h4>
              <div className="grid grid-cols-3 gap-2 text-center bg-surface p-2.5 rounded-control border border-border">
                <div>
                  <span className="text-[10px] text-text-secondary block uppercase">Played</span>
                  <span className="text-sm font-bold font-data text-text-primary">{tip.h2h_summary?.played}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary block uppercase">Avg Goals</span>
                  <span className="text-sm font-bold font-data text-warning">{tip.h2h_summary?.avg_goals}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-secondary block uppercase">Draws</span>
                  <span className="text-sm font-bold font-data text-text-secondary">{tip.h2h_summary?.draws}</span>
                </div>
              </div>
              {tip.h2h_summary?.last_meeting && (
                <p className="text-[11px] text-text-secondary mt-2 text-right italic">
                  Last Meeting: <span className="text-text-primary font-semibold">{tip.h2h_summary.last_meeting}</span>
                </p>
              )}
            </div>
          )}

          {hasForm && (
            <div className="bg-surface-muted p-3 rounded-card border border-border flex items-center justify-between text-xs">
              <div>
                <span className="text-text-secondary block mb-1">Home Form</span>
                <span className="font-data bg-surface px-2 py-1 rounded text-text-primary tracking-widest">{tip.form?.home}</span>
              </div>
              <div className="text-right">
                <span className="text-text-secondary block mb-1">Away Form</span>
                <span className="font-data bg-surface px-2 py-1 rounded text-text-primary tracking-widest">{tip.form?.away}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};