import React from "react";
import {  type PredictionTier } from "../../../types/testingTips";

interface PredictionSectionProps {
  title: string;
  tier?: PredictionTier;
  variant: "basic" | "premium" | "super_premium";
}

export const PredictionSection: React.FC<PredictionSectionProps> = ({ title, tier, variant }) => {
  if (!tier || !tier.predictions || tier.predictions.length === 0) return null;

  const themes = {
    basic: "border-gray-800 bg-gray-950/40",
    premium: "border-amber-500/30 bg-amber-500/[0.02]",
    super_premium: "border-purple-500/40 bg-purple-500/[0.03]",
  };

  const badgeThemes = {
    basic: "bg-gray-800 text-gray-300",
    premium: "bg-amber-400 text-gray-950 font-bold",
    super_premium: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold",
  };

  return (
    <div className={`border rounded-xl p-4 flex flex-col justify-between space-y-3 ${themes[variant]}`}>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-bold text-gray-200">{title}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${badgeThemes[variant]}`}>
            {variant.replace("_", " ")}
          </span>
        </div>

        {tier.predictions.map((p, idx) => (
          <div key={idx} className="bg-gray-900/90 rounded-lg p-3 border border-gray-800 mb-2 last:mb-0">
            <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{p.market}</div>
            <div className="text-base font-bold text-white my-0.5">{p.prediction}</div>
            <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-800/50 text-[11px]">
              <span className="text-gray-500">Confidence: <b className="text-gray-300">{p.confidence}%</b></span>
              {p.result && (
                <span className={`font-semibold px-1 rounded ${p.result === "won" ? "text-emerald-400" : "text-rose-400"}`}>
                  {p.result.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {tier.reason && (
        <p className="text-xs text-gray-400 italic leading-relaxed pt-2 border-t border-gray-800/40">
          💡 {tier.reason}
        </p>
      )}
    </div>
  );
};