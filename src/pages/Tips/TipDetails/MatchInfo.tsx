import React from "react";
import { type MatchPrediction } from "../../../types/testingTips";

export const MatchInfo: React.FC<{ tip: MatchPrediction }> = ({ tip }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Medium": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "High": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Date/Time */}
      <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/60">
        <p className="text-xs text-gray-500 font-medium mb-1">Kickoff Time</p>
        <p className="text-sm font-semibold text-white">{tip.date}</p>
        <p className="text-xs text-gray-400 mt-0.5">{tip.time}</p>
      </div>

      {/* Live Status & Live Score */}
      <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/60 flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Match Status</p>
          <span className={`text-xs px-2 py-0.5 rounded-md font-bold inline-block border ${
            tip.matchStatus === "Live" 
              ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" 
              : tip.matchStatus === "Finished" 
              ? "bg-gray-800 text-gray-400 border-transparent" 
              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
          }`}>
            {tip.matchStatus || "Pending"}
          </span>
        </div>
        <p className="text-lg font-black text-white mt-1 tracking-wider">
          {tip.score || "- : -"}
        </p>
      </div>

      {/* Risk Metrics */}
      <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/60">
        <p className="text-xs text-gray-500 font-medium mb-1">Risk Profile</p>
        <span className={`text-xs px-2 py-0.5 rounded-md font-bold inline-block border ${getRiskColor(tip.risk_level)}`}>
          {tip.risk_level} Risk
        </span>
        <div className="mt-2 text-xs text-gray-300">
          Value: <span className="font-bold text-yellow-400">{tip.value_rating}/10</span>
        </div>
      </div>

      {/* Outcome Status */}
      <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800/60">
        <p className="text-xs text-gray-500 font-medium mb-1">AI Accuracy Evaluation</p>
        <span className={`text-xs px-2 py-0.5 rounded-md font-black inline-block uppercase tracking-wide border ${
          tip.status === "won" 
            ? "bg-emerald-500 text-gray-950 border-transparent" 
            : tip.status === "lost" 
            ? "bg-rose-500 text-white border-transparent" 
            : "bg-amber-400 text-gray-950 border-transparent"
        }`}>
          {tip.status}
        </span>
        <div className="mt-2 text-xs text-gray-400">
          Confidence: <span className="font-bold text-white">{tip.confidence_score}%</span>
        </div>
      </div>
    </div>
  );
};