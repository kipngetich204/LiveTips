//import type { Tiptype } from "../../types/tips";
import { type MatchPrediction } from "../../types/testingTips";

interface TipDetailsProps {
  tip: MatchPrediction | null;
  isLoading: boolean;
  onClose: () => void;
}

export const TipDetails: React.FC<TipDetailsProps> = ({ tip, isLoading, onClose }) => {
  if (!tip) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div
          className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-4 sm:p-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {tip.homeTeam} vs {tip.awayTeam}
              </h2>
              <p className="text-gray-800 text-sm sm:text-base">
                {tip.league}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-900 hover:text-black font-bold text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Match Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Date & Time</p>
                <p className="text-white font-semibold">
                  {tip.date} {tip.time}
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Match Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold inline-block ${
                    tip.matchStatus === "Live"
                      ? "bg-red-600 text-white animate-pulse"
                      : tip.matchStatus === "Finished"
                      ? "bg-gray-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {tip.matchStatus || "Pending"}
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-2">Current Score</p>
              <p className="text-4xl font-bold text-white">
                {tip.score || "- : -"}
              </p>
            </div>

            {/* Prediction Details */}
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Prediction</p>
              <p className="text-green-400 font-semibold text-lg mb-3">
                {tip.prediction}
              </p>
              <p className="text-gray-400 text-sm mb-2">Market</p>
              <p className="text-yellow-300 font-semibold mb-3">
                {tip.markets}
              </p>
            </div>

            {/* Reason */}
            <div className="bg-gray-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Analysis</p>
              <p className="text-gray-200">
                {tip.reason}
              </p>
            </div>

            {/* Result and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Result</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold inline-block ${
                    tip.status === "won"
                      ? "bg-green-500 text-white"
                      : tip.status === "lost"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {tip.status.toUpperCase()}
                </span>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Type</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                    tip.type === "premium"
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                      : "bg-green-500 text-black"
                  }`}
                >
                  {tip.type.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-900 p-4 sm:p-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
