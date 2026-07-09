import React from "react";
interface InjuryAlert { active: boolean; home_team: string; away_team: string; }

export const InjuryCard: React.FC<{ alert: InjuryAlert }> = ({ alert }) => (
  <div className="bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-xl flex gap-3 items-start">
    <span className="text-xl leading-none">⚠️</span>
    <div className="text-xs">
      <h4 className="font-bold text-amber-400 uppercase tracking-wide mb-1">Critical Roster Alerts</h4>
      <p className="text-amber-200/80 leading-relaxed">
        <span className="font-bold text-white">Home:</span> {alert.home_team || "Clean report"} <br/>
        <span className="font-bold text-white">Away:</span> {alert.away_team || "Clean report"}
      </p>
    </div>
  </div>
);