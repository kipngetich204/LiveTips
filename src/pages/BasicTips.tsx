
import { basicTips } from "../types/tips";



function getStatusColor(status: string) {
  switch (status) {
    case "won":
      return "#4CAF50";
    case "lost":
      return "#F44336";
    default:
      return "#FFD700";
  }
}

function getTypeColor(type: string) {
  return type === "vip" ? "#9C27B0" : "#2196F3";
}

export function Tips() {
  return (
    <section className="py-16 bg-gray-900 text-white min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
          Basic Football Prediction Tips
        </h2>
        <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
          Improve your prediction accuracy with these essential insights used by
          experienced analysts and sports bettors.
        </p>

        {/* Responsive grid: 1 col mobile, 2 md, 3 lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {basicTips.map((tip) => (
            <div
              key={tip.id}
              className="flex flex-col justify-between bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-yellow-400/20 hover:-translate-y-1 transition-transform duration-300 border-l-4 min-h-[320px]"
              style={{ borderLeftColor: getStatusColor(tip.type) }}
            >
              {/* Top info */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-yellow-400">{tip.league}</span>
                  <div className="flex gap-2">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: getTypeColor(tip.type) }}
                    >
                      {tip.type.toUpperCase()}
                    </span>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: getStatusColor(tip.homeTeam) }}
                    >
                      {tip.awayTeam.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-yellow-400">
                  {tip.homeTeam} vs {tip.awayTeam}
                </h3>

                <p className="text-gray-300 text-sm mb-2">
                  <strong className="text-yellow-400">Prediction:</strong>{" "}
                  {tip.prediction} @{" "}
                  <span className="text-green-400">{tip.prediction}</span>
                </p>

                <p className="text-gray-400 text-xs mb-2">
                  {new Date(tip.date).toLocaleString()}
                </p>
              </div>

              {/* Reasoning / Analysis */}
              {tip.reason && (
                <div className="mt-3 bg-yellow-500/10 border-l-4 border-yellow-400 p-3 rounded-md text-sm text-gray-300">
                  <strong className="text-yellow-400">Analysis:</strong>{" "}
                  {tip.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
