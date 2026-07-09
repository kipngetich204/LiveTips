import React from "react";

export const KeyFactors: React.FC<{ factors: string[] }> = ({ factors }) => (
  <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Match Factors</h4>
    <ul className="space-y-2 text-xs text-gray-300">
      {factors.map((factor, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-yellow-400 mt-0.5">⚡</span>
          <span className="leading-relaxed">{factor}</span>
        </li>
      ))}
    </ul>
  </div>
);