import React from "react";
import { type MatchPrediction } from "../../../types/tips";

export const MatchInfo: React.FC<{ tip: MatchPrediction }> = ({ tip }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-success bg-success-bg border-success/20";
      case "Medium": return "text-warning bg-warning-bg border-warning/20";
      case "High": return "text-danger bg-danger-bg border-danger/20";
      default: return "text-pending bg-pending-bg border-transparent";
    }
  };

  const getStatusColor = (status?: string) => {
    if (status === "won") return "bg-success text-brand-white border-transparent";
    if (status === "lost") return "bg-danger text-brand-white border-transparent";
    return "bg-pending text-brand-white border-transparent";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Date/Time */}
      <div className="bg-surface-muted p-3.5 rounded-card border border-border">
        <p className="text-xs text-text-secondary font-medium mb-1">Kickoff Time</p>
        <p className="text-sm font-semibold text-text-primary">{tip.date}</p>
        <p className="text-xs font-data text-text-secondary mt-0.5">{tip.time}</p>
      </div>

      {/* Live Status & Live Score */}
      <div className="bg-surface-muted p-3.5 rounded-card border border-border flex flex-col justify-between">
        <div>
          <p className="text-xs text-text-secondary font-medium mb-1">Match Status</p>
          <span className={`text-xs px-2 py-0.5 rounded-md font-bold inline-block border ${
            tip.matchStatus === "Live" 
              ? "bg-danger-bg text-danger border-danger/20 animate-pulse" 
              : tip.matchStatus === "Finished" 
              ? "bg-pending-bg text-pending border-transparent" 
              : "bg-info-bg text-info border-info/20"
          }`}>
            {tip.matchStatus || "Pending"}
          </span>
        </div>
        <p className="text-lg font-black font-data text-text-primary mt-1 tracking-wider">
          {tip.score || "- : -"}
        </p>
      </div>

      {/* Risk Metrics */}
      <div className="bg-surface-muted p-3.5 rounded-card border border-border">
        <p className="text-xs text-text-secondary font-medium mb-1">Risk Profile</p>
        <span className={`text-xs px-2 py-0.5 rounded-md font-bold inline-block border ${getRiskColor(tip.risk_level)}`}>
          {tip.risk_level} Risk
        </span>
        <div className="mt-2 text-xs text-text-secondary">
          Value: <span className="font-bold font-data text-warning">{tip.value_rating}/10</span>
        </div>
      </div>

      {/* Outcome Status */}
      <div className="bg-surface-muted p-3.5 rounded-card border border-border">
        <p className="text-xs text-text-secondary font-medium mb-1">AI Accuracy Evaluation</p>
        <span className={`text-xs px-2 py-0.5 rounded-md font-black inline-block uppercase tracking-wide border ${getStatusColor(tip.status)}`}>
          {tip.status}
        </span>
        <div className="mt-2 text-xs text-text-secondary">
          Confidence: <span className="font-bold font-data text-text-primary">{tip.confidence_score}%</span>
        </div>
      </div>
    </div>
  );
};