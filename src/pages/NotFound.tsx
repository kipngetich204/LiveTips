import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-muted text-text-primary px-4">
      <h1 className="text-6xl font-bold text-text-primary mb-4 font-data">404</h1>
      <h2 className="text-2xl font-semibold mb-6 text-text-primary">Page Not Found</h2>
      <p className="text-text-secondary mb-6 text-center max-w-sm">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="min-h-11 flex items-center bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black px-6 py-3 rounded-control font-semibold hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </div>
  );
};