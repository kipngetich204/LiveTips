import React, { useEffect } from "react";
import { type MatchPrediction } from "../../../types/tips";
import { useAuth } from "../../../context/AuthContext";
import { Lock } from "lucide-react";

import { MatchHeader } from "./MatchHeader";
import { MatchInfo } from "./MatchInfo";
import { PredictionSection } from "./PredictionSection";
import { Statistics } from "./Statistics";
import { AlternativeTipCard } from "./AlternativeTipCard";
import { KeyFactors } from "./KeyFactors";
import { InjuryCard } from "./InjuryCard";

interface TipDetailsProps {
  tip: MatchPrediction | null;
  isLoading: boolean;
  onClose: () => void;
}

export const TipDetails: React.FC<TipDetailsProps> = ({ tip, isLoading, onClose }) => {
  const { user } = useAuth(); // Consume user profile context
  
  // Define access flags (adjust property names based on your actual User schema)
  const isPremiumUser = user?.type === "premium" || user?.isAdmin;
  const isSuperPremiumUser = user?.type === "super_premium" || user?.isAdmin;

  useEffect(() => {
    if (tip) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [tip]);

  if (!tip) return null;

  return (
    <div
      className="fixed inset-0 bg-brand-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 transition-all duration-300"
      onClick={onClose}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-warning border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div
          className="bg-surface-raised text-text-primary rounded-card border border-border shadow-card-hover max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <MatchHeader tip={tip} onClose={onClose} />

          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            
            <MatchInfo tip={tip} />

            {/* AI Executive Summary - Protected if necessary, or open to all */}
            {tip.reason && (
              <div className="bg-surface-muted border border-border p-4 rounded-card">
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Overall AI Executive Summary</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{tip.reason}</p>
              </div>
            )}

            {/* Prediction Packages with Guardrails applied */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-text-primary border-b border-border pb-2">Prediction Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Basic Access: Open to everyone */}
                <PredictionSection title="Basic Access" tier={tip.predictions?.basic} variant="basic" />
                
                {/* Premium Tier: Conditional Blur/Lockout */}
                {isPremiumUser ? (
                  <PredictionSection title="Premium Tier" tier={tip.predictions?.premium} variant="premium" />
                ) : (
                  <PremiumBlurOverlay tierName="Premium Tier" cost="Upgrade to Premium" />
                )}

                {/* VIP Super Premium: Conditional Blur/Lockout */}
                {isSuperPremiumUser ? (
                  <PredictionSection title="VIP Super Premium" tier={tip.predictions?.super_premium} variant="super_premium" />
                ) : (
                  <PremiumBlurOverlay tierName="VIP Super Premium" cost="Unlock VIP Suite" />
                )}

              </div>
            </div>

            {/* Analytics are visible, but you could easily wrap them too */}
            <Statistics tip={tip} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tip.key_factors && tip.key_factors.length > 0 && (
                <KeyFactors factors={tip.key_factors} />
              )}
              <div className="space-y-4">
                {/* Alternative tip can be tied to premium access */}
                {tip.alternative_tip && isPremiumUser && (
                  <AlternativeTipCard altTip={tip.alternative_tip} />
                )}
                {tip.injury_alert?.active && (
                  <InjuryCard alert={tip.injury_alert} />
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface-muted p-4 border-t border-border flex items-center justify-between">
            <div className="text-xs font-data text-text-secondary">
              ID: {tip.id} • Ref: {tip.referee || "N/A"}
            </div>
            <button
              onClick={onClose}
              className="min-h-11 bg-surface hover:bg-surface-raised border border-border text-text-primary font-medium py-2 px-6 rounded-control transition-colors text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Quick UI Sub-component to act as a sleek upgrade wall wrapper --- */
const PremiumBlurOverlay: React.FC<{ tierName: string; cost: string }> = ({ tierName, cost }) => (
  <div className="border border-border bg-surface-muted rounded-card p-4 flex flex-col justify-between items-center text-center min-h-[220px] relative overflow-hidden">
    <div className="w-full blur-[4px] select-none opacity-20 pointer-events-none space-y-2">
      <div className="text-xs text-text-secondary">MARKET PLACEHOLDER</div>
      <div className="h-6 bg-surface rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-surface rounded w-1/2 mx-auto"></div>
    </div>
    
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-surface-muted/90 backdrop-blur-[2px]">
      <Lock size={20} className="text-text-secondary mb-1" aria-hidden="true" />
      <h4 className="text-sm font-bold text-text-primary mb-1">{tierName}</h4>
      <p className="text-[11px] text-text-secondary mb-3 max-w-[150px]">This predictive matrix is locked for your plan.</p>
      <button className="min-h-9 bg-warning text-brand-black text-xs font-bold py-1.5 px-3 rounded-control hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2">
        {cost}
      </button>
    </div>
  </div>
);