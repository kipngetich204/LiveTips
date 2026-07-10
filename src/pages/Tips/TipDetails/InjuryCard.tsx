import React from "react";
import { AlertTriangle } from "lucide-react";
interface InjuryAlert { active: boolean; home_team: string; away_team: string; }

export const InjuryCard: React.FC<{ alert: InjuryAlert }> = ({ alert }) => (
  <div className="bg-warning-bg border border-warning/20 p-3.5 rounded-card flex gap-3 items-start">
    <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" aria-hidden="true" />
    <div className="text-xs">
      <h4 className="font-bold text-warning uppercase tracking-wide mb-1">Critical Roster Alerts</h4>
      <p className="text-text-secondary leading-relaxed">
        <span className="font-bold text-text-primary">Home:</span> {alert.home_team || "Clean report"} <br/>
        <span className="font-bold text-text-primary">Away:</span> {alert.away_team || "Clean report"}
      </p>
    </div>
  </div>
);