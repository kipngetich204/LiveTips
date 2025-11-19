import { Link } from "react-router-dom";

export function ErrorPage({ message }: { message?: string }) {
  const soccerSVG = (
    <svg
      viewBox="0 0 512 512"
      className="w-full h-full"
      fill="currentColor"
    >
      <circle cx="256" cy="256" r="256" fill="white" />
      <circle cx="256" cy="256" r="192" fill="black" />
      <polygon
        points="256,64 296,176 384,176 312,240 336,336 256,280 176,336 200,240 128,176 216,176"
        fill="white"
      />
    </svg>
  );

  return (
    <div className="bg-gray-900 text-white py-20 px-6 min-h-screen">
      {/* Floating soccer balls */}
      <div className="absolute w-full h-full top-0 left-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const size = 30 + Math.random() * 40;
          const left = Math.random() * 100;
          const duration = 6 + Math.random() * 4;
          const delay = Math.random() * 5;
          return (
            <div
              key={i}
              className="absolute text-white opacity-60"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `100%`,
                animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
              }}
            >
              {soccerSVG}
            </div>
          );
        })}
      </div>

      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.5; }
            50% { transform: translateY(-50vh) translateX(15px) rotate(180deg); opacity: 0.8; }
            100% { transform: translateY(-100vh) translateX(-10px) rotate(360deg); opacity: 0; }
          }
        `}
      </style>

      {/* Main card */}
      <div className="relative z-10 max-w-lg mx-auto text-center bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-700">
        <div className="text-yellow-400 text-7xl mb-4 animate-bounce">⚽</div>

        <h1 className="text-3xl font-bold mb-3">Oops! Something went wrong</h1>

        {message && <p className="text-gray-300 mb-4 text-sm">{message}</p>}

        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          Welcome to <span className="font-semibold text-yellow-400">Live Tips</span> — your go-to platform for betting tips, live scores, and daily predictions. 
          It seems this page isn’t available or an unexpected error occurred.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 transition rounded-lg font-semibold"
          >
            Retry
          </button>
          <Link
            to="/"
            className="px-5 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition"
          >
            Go Home
          </Link>
        </div>

        <p className="text-gray-500 mt-6 text-xs">
          If the problem persists, contact support or try again later.
        </p>
      </div>
    </div>
  );
}
