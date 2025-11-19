//import { useEffect, useState } from "react";
import "../index.css";


export const Marquee = () => {

  const tips = [
    "🔥 Live Tip: Back Team A - 2.1",
    "⚡️ Hot: Over 2.5 Goals",
    //"📈 Signal: Trade Long",
    //"✅ Win more with live tips",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-3 sm:my-8 sm:px-4">
      <div className="bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-400 rounded-2xl shadow-2xl p-[2px]">
        <div className="bg-gray-900 rounded-xl p-3 sm:p-4 lg:p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 ring-2 ring-white/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M12 2v20M2 12h20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <div className="text-xs sm:text-sm text-gray-300">Live Signals</div>
                <div className="text-sm sm:text-lg font-semibold text-white">
                  Win more with live tips
                </div>
              </div>
            </div>

            <div className="text-[10px] sm:text-xs text-gray-400">Real-time</div>
          </div>

          {/* MARQUEE */}
          <div className="overflow-hidden rounded-md border border-white/10 bg-black/40 p-2 sm:p-3">
            <div className="flex animate-marquee hover:pause">
              {[...tips, ...tips, ...tips].map((tip, i) => (
                <span
                  key={i}
                  className="
                    mx-2 sm:mx-3 px-2 sm:px-3 py-1 
                    bg-white/5 rounded-full 
                    text-white text-sm sm:text-lg 
                    font-medium whitespace-nowrap
                  "
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-400">
            Hover to pause
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }

        .animate-marquee {
          animation: marquee 10s linear infinite;
        }

        /* Slower scrolling on small screens */
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 16s;
          }
        }

        .hover\\:pause:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
