import React from "react";
import { type PredictionTier } from "../../../types/tips";
import { Lightbulb } from "lucide-react";

interface PredictionSectionProps {
  title: string;
  tier?: PredictionTier;
  variant: "basic" | "premium" | "super_premium";
}

export const PredictionSection: React.FC<PredictionSectionProps> = ({ title, tier, variant }) => {
  if (!tier || !tier.predictions || tier.predictions.length === 0) return null;

  const themes = {
    basic: "border-border bg-surface-muted",
    premium: "border-info/30 bg-info-bg",
    super_premium: "border-warning/30 bg-warning-bg",
  };

  const badgeThemes = {
    basic: "bg-surface text-text-secondary",
    premium: "bg-info text-brand-white font-bold",
    super_premium: "bg-warning text-brand-black font-bold",
  };

  return (
    <div className={`border rounded-card p-4 flex flex-col justify-between space-y-3 ${themes[variant]}`}>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-bold text-text-primary">{title}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${badgeThemes[variant]}`}>
            {variant.replace("_", " ")}
          </span>
        </div>

        {tier.predictions.map((p, idx) => (
          <div key={idx} className="bg-surface rounded-control p-3 border border-border mb-2 last:mb-0">
            <div className="text-[11px] text-text-secondary font-medium uppercase tracking-wide">{p.market}</div>
            <div className="text-base font-bold text-text-primary my-0.5">{p.prediction}</div>
            <div className="flex justify-between items-center mt-2 pt-1 border-t border-border text-[11px]">
              <span className="text-text-secondary">Confidence: <b className="font-data text-text-primary">{p.confidence}%</b></span>
              {p.result && (
                <span className={`font-semibold px-1 rounded ${p.result === "won" ? "text-success" : "text-danger"}`}>
                  {p.result.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {tier.reason && (
        <p className="text-xs text-text-secondary italic leading-relaxed pt-2 border-t border-border flex gap-1.5">
          <Lightbulb size={14} className="text-warning shrink-0 mt-0.5" aria-hidden="true" />
          <span>{tier.reason}</span>
        </p>
      )}
    </div>
  );
};