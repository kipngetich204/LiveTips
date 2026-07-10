import React from "react";
interface AlternativeTip { market: string; prediction: string; confidence: number; reason: string; }

export const AlternativeTipCard: React.FC<{ altTip: AlternativeTip }> = ({ altTip }) => (
  <div className="bg-surface-muted p-4 rounded-card border border-dashed border-border">
    <div className="flex justify-between items-center mb-1">
      <h4 className="text-xs font-semibold text-info uppercase tracking-wider">Alternative Safety Tip</h4>
      <span className="text-[10px] font-bold font-data text-text-secondary bg-surface px-1.5 py-0.5 rounded">{altTip.confidence}% Acc.</span>
    </div>
    <p className="text-xs text-text-secondary font-medium uppercase mt-2">{altTip.market}</p>
    <p className="text-base font-black text-text-primary">{altTip.prediction}</p>
    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{altTip.reason}</p>
  </div>
);