import React from "react";
import { X, Flame } from "lucide-react";
import { type MatchPrediction } from "../../../types/tips";

interface MatchHeaderProps {
  tip: MatchPrediction;
  onClose: () => void;
}

export const MatchHeader: React.FC<MatchHeaderProps> = ({ tip, onClose }) => {
  return (
    <div className="bg-surface-muted p-5 sm:p-6 border-b border-border flex justify-between items-start relative">
      <div className="space-y-2 max-w-[85%]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-surface text-text-secondary text-xs px-2.5 py-0.5 rounded-full font-semibold border border-border">
            {tip.league}
          </span>
          {tip.league_round && (
            <span className="text-xs text-text-secondary bg-surface px-2 py-0.5 rounded">
              Round {tip.league_round}
            </span>
          )}
          {tip.tip_of_the_day && (
            <span className="inline-flex items-center gap-1 bg-warning text-brand-black text-xs px-2.5 py-0.5 rounded-full font-black tracking-wide">
              <Flame size={12} aria-hidden="true" /> TIP OF THE DAY
            </span>
          )}
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight leading-tight">
          {tip.homeTeam} <span className="text-text-secondary text-xl font-light">vs</span> {tip.awayTeam}
        </h2>
      </div>

      <button
        onClick={onClose}
        aria-label="Close modal"
        className="min-h-11 min-w-11 flex items-center justify-center text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-raised rounded-full transition-colors self-start focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
};