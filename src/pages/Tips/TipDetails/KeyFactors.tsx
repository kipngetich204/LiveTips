import React from "react";
import { Zap } from "lucide-react";

export const KeyFactors: React.FC<{ factors: string[] }> = ({ factors }) => (
  <div className="bg-surface-muted p-4 rounded-card border border-border">
    <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Key Match Factors</h4>
    <ul className="space-y-2 text-xs text-text-secondary">
      {factors.map((factor, i) => (
        <li key={i} className="flex items-start gap-2">
          <Zap size={14} className="text-warning mt-0.5 shrink-0" aria-hidden="true" />
          <span className="leading-relaxed">{factor}</span>
        </li>
      ))}
    </ul>
  </div>
);