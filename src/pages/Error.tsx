import { Link } from "react-router-dom";

export function ErrorPage({ message }: { message?: string }) {
  return (
    <div className="relative bg-surface-muted text-text-primary py-20 px-6 min-h-screen flex items-center justify-center">
      {/* Main card */}
      <div className="relative z-10 max-w-lg w-full text-center bg-surface-raised p-10 rounded-card shadow-card-hover border border-border">
        <div className="w-16 h-16 mx-auto mb-4">
          <svg viewBox="0 0 512 512" className="w-full h-full">
            <circle cx="256" cy="256" r="256" fill="white" />
            <circle cx="256" cy="256" r="192" fill="black" />
            <polygon
              points="256,64 296,176 384,176 312,240 336,336 256,280 176,336 200,240 128,176 216,176"
              fill="white"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3 text-text-primary">Oops! Something went wrong</h1>

        {message && <p className="text-text-secondary mb-4 text-sm">{message}</p>}

        <p className="text-text-secondary mb-6 text-sm sm:text-base">
          Welcome to <span className="font-semibold text-text-primary">Live Tips</span> — your go-to platform for betting tips, live scores, and daily predictions.
          It seems this page isn't available or an unexpected error occurred.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="min-h-11 px-5 py-2 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black hover:opacity-90 transition-opacity rounded-control font-semibold"
          >
            Retry
          </button>
          <Link
            to="/"
            className="min-h-11 flex items-center justify-center px-5 py-2 bg-surface text-text-primary border border-text-primary font-semibold rounded-control hover:bg-surface-muted transition-colors"
          >
            Go Home
          </Link>
        </div>

        <p className="text-text-secondary mt-6 text-xs">
          If the problem persists, contact support or try again later.
        </p>
      </div>
    </div>
  );
}