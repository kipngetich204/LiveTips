import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { type FullFixture } from "../types/livescore";
import { LoadingPage } from "./Loading";
import { ErrorPage } from "./Error";
import { InlineLoader } from "../components/feedback/InlineLoader";

const API_BASE_URL = "https://backend-livetips.onrender.com";

export const LiveScore: React.FC = () => {
  const [fixtures, setFixtures] = useState<FullFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFixtures = async () => {
    try {
      setError(null);
      if (!loading) setIsRefreshing(true);

      const res = await fetch(`${API_BASE_URL}/livescore`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const fixturesData = data.fixtures || [];

      setFixtures(fixturesData);
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error("Error fetching fixtures:", err);
      setError(err.message || "Error fetching fixtures");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFixtures();

    // Auto-refresh every 30 seconds for live scores
    const interval = setInterval(fetchFixtures, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && fixtures.length === 0) return <LoadingPage />;
  if (error && fixtures.length === 0) return <ErrorPage message={error} />;

  return (
    <div className="w-full bg-surface-muted text-text-primary pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center flex-1 text-text-primary">
              Live Football Scores
            </h1>
            {isRefreshing && <InlineLoader label="Updating…" />}
          </div>

          <p className="text-center text-text-secondary text-sm sm:text-base mt-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="text-center mt-2 space-y-1">
            <p className="text-danger text-sm font-medium">
              {fixtures.length} live {fixtures.length === 1 ? "match" : "matches"}
            </p>
            <p className="text-xs font-data text-text-secondary">
              Auto-updates every 30 seconds • Last updated:{" "}
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>

          {/* Error banner */}
          {error && fixtures.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 bg-danger-bg border border-danger/20 text-danger p-3 rounded-control text-sm">
              <AlertTriangle size={16} aria-hidden="true" />
              Could not fetch latest updates. Showing cached data.
            </div>
          )}
        </div>

        {/* Fixtures List */}
        <div className="space-y-3 sm:space-y-4">
          {fixtures.map((match) => {
            const isLive = ["LIVE", "1H", "2H", "HT", "ET", "P"].includes(
              match.fixture.status.short || ""
            );
            const isFinished = ["FT", "AET", "PEN"].includes(
              match.fixture.status.short || ""
            );

            return (
              <div
                key={match.fixture.id}
                className={`bg-surface-raised border border-border rounded-card shadow-card overflow-hidden hover:shadow-card-hover transition-shadow ${
                  isLive ? "ring-2 ring-danger" : ""
                }`}
              >
                {/* Mobile View */}
                <div className="md:hidden p-4">
                  {/* Status & Time */}
                  <div className="flex justify-between items-center mb-4 text-xs sm:text-sm">
                    <div className="font-data">
                      <span className="text-text-secondary">
                        {new Date(match.fixture.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {match.fixture.status.elapsed && (
                        <span className="ml-2 text-text-primary font-semibold">
                          {match.fixture.status.elapsed}'
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        isFinished
                          ? "bg-pending text-brand-white"
                          : isLive
                          ? "bg-danger text-brand-white animate-pulse"
                          : "bg-info text-brand-white"
                      }`}
                    >
                      {match.fixture.status.short}
                    </span>
                  </div>

                  {/* League Info */}
                  <div className="mb-3 pb-2 border-b border-border">
                    <p className="text-xs text-text-secondary flex items-center gap-2">
                      {match.league.logo && (
                        <img
                          src={match.league.logo}
                          alt={match.league.name}
                          className="w-4 h-4 object-contain"
                        />
                      )}
                      {match.league.name} - {match.league.round}
                    </p>
                  </div>

                  {/* Teams & Score */}
                  <div className="space-y-3">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={match.teams.home.logo}
                          alt={match.teams.home.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0"
                        />
                        <span
                          className={`font-semibold text-sm sm:text-base truncate ${
                            match.teams.home.winner ? "text-success" : "text-text-primary"
                          }`}
                        >
                          {match.teams.home.name}
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold font-data text-text-primary ml-2">
                        {match.goals.home ?? 0}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={match.teams.away.logo}
                          alt={match.teams.away.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0"
                        />
                        <span
                          className={`font-semibold text-sm sm:text-base truncate ${
                            match.teams.away.winner ? "text-success" : "text-text-primary"
                          }`}
                        >
                          {match.teams.away.name}
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold font-data text-text-primary ml-2">
                        {match.goals.away ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Half-time Score */}
                  {match.score.halftime.home !== null && (
                    <div className="mt-3 pt-2 border-t border-border text-center">
                      <p className="text-xs font-data text-text-secondary">
                        HT: {match.score.halftime.home} - {match.score.halftime.away}
                      </p>
                    </div>
                  )}

                  {/* Venue */}
                  {match.fixture.venue.name && (
                    <div className="mt-3 pt-3 border-t border-border text-center">
                      <p className="text-xs sm:text-sm text-text-secondary">
                        {match.fixture.venue.name}
                        {match.fixture.venue.city && `, ${match.fixture.venue.city}`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block p-6">
                  {/* League Info */}
                  <div className="mb-4 pb-2 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      {match.league.logo && (
                        <img
                          src={match.league.logo}
                          alt={match.league.name}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span>
                        {match.league.name} - {match.league.round}
                      </span>
                    </div>
                    {match.fixture.venue.name && (
                      <p className="text-sm text-text-secondary">
                        {match.fixture.venue.name}
                        {match.fixture.venue.city && `, ${match.fixture.venue.city}`}
                      </p>
                    )}
                  </div>

                  {/* Main Match Display */}
                  <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={match.teams.home.logo}
                        alt={match.teams.home.name}
                        className="w-16 h-16 object-contain"
                      />
                      <span
                        className={`font-semibold text-lg ${
                          match.teams.home.winner ? "text-success" : "text-text-primary"
                        }`}
                      >
                        {match.teams.home.name}
                      </span>
                    </div>

                    {/* Score & Status */}
                    <div className="text-center px-8">
                      <div className="text-4xl font-bold font-data text-text-primary mb-2">
                        {match.goals.home ?? 0} - {match.goals.away ?? 0}
                      </div>
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                            isFinished
                              ? "bg-pending text-brand-white"
                              : isLive
                              ? "bg-danger text-brand-white animate-pulse"
                              : "bg-info text-brand-white"
                          }`}
                        >
                          {match.fixture.status.long}
                          {match.fixture.status.elapsed && (
                            <span className="ml-1 font-data">
                              {match.fixture.status.elapsed}'
                            </span>
                          )}
                        </span>
                        {match.score.halftime.home !== null && (
                          <p className="text-xs font-data text-text-secondary">
                            HT: {match.score.halftime.home} -{" "}
                            {match.score.halftime.away}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-4 flex-1 justify-end">
                      <span
                        className={`font-semibold text-lg ${
                          match.teams.away.winner ? "text-success" : "text-text-primary"
                        }`}
                      >
                        {match.teams.away.name}
                      </span>
                      <img
                        src={match.teams.away.logo}
                        alt={match.teams.away.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>

                    {/* Time */}
                    <div className="text-right font-data text-text-secondary text-sm ml-6 min-w-[100px]">
                      <p>
                        {new Date(match.fixture.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {fixtures.length === 0 && !loading && (
          <div className="text-center py-12 bg-surface-raised border border-border rounded-card">
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
            <p className="text-text-secondary text-lg mb-2">
              No live matches at the moment
            </p>
            <p className="text-text-secondary text-sm">
              Check back later for live scores
            </p>
          </div>
        )}
      </div>
    </div>
  );
};