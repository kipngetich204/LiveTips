import React from "react";
interface AlternativeTip { market: string; prediction: string; confidence: number; reason: string; }

export const AlternativeTipCard: React.FC<{ altTip: AlternativeTip }> = ({ altTip }) => (
  <div className="bg-gray-950 p-4 rounded-xl border border-dashed border-gray-800">
    <div className="flex justify-between items-center mb-1">
      <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Alternative Safety Tip</h4>
      <span className="text-[10px] font-bold text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">{altTip.confidence}% Acc.</span>
    </div>
    <p className="text-xs text-gray-400 font-medium uppercase mt-2">{altTip.market}</p>
    <p className="text-base font-black text-white">{altTip.prediction}</p>
    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{altTip.reason}</p>
  </div>
);