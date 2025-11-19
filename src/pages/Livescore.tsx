import React, { useEffect, useState } from "react";
import { type FullFixture } from "../types/livescore";
import { LoadingPage } from "./Loading";
import { ErrorPage } from "./Error";

export const LiveScore: React.FC = () => {
  const [fixtures, setFixtures] = useState<FullFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


/*   const formatDate= ()=>{
    const d= new Date();
    return `
      ${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}
    `
  } */

  //console.log(formatDate())
  useEffect(() => {
    const fetchFixtures = async () => {
      try {

        const res = await fetch(`https://football-project-backend-cv2j.onrender.com/fixtures`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: FullFixture[] = await res.json();
        console.log(data)
        setFixtures(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching fixtures");
        return <ErrorPage message={error || "Error fetching fixtures"} />;
      } finally {
        setLoading(false);
      }
    };
    console.log(fixtures)

    fetchFixtures();
  }, []);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage message={error}/>
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2">
            Football Fixtures
          </h1>
         {/*} <p className="text-center text-gray-400 text-sm sm:text-base">
            {new Date("2025-11-16").toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>*/}
          <p className="text-center text-yellow-400 text-sm mt-2">
            {fixtures.length === 1 ? "match" : "matches"}
          </p>
        </div>

        {/* Fixtures List */}
        <div className="space-y-3 sm:space-y-4">
          {fixtures.map((match) => (
            <div
              key={match.fixture.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Mobile View */}
              <div className="md:hidden p-4">
                {/* Status & Time */}
                <div className="flex justify-between items-center mb-4 text-xs sm:text-sm">
                  <span className="text-gray-400">
                    {new Date(match.fixture.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      match.fixture.status.short === "FT"
                        ? "bg-gray-600 text-white"
                        : match.fixture.status.short === "LIVE"
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {match.fixture.status.short}
                  </span>
                </div>

                {/* Teams & Score */}
                <div className="space-y-3">
                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={match.teams.home.logo}
                        alt={match.teams.home.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
                      />
                      <span className="font-semibold text-sm sm:text-base truncate">
                        {match.teams.home.name}
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold ml-2">
                      {match.goals.home ?? 0}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={match.teams.away.logo}
                        alt={match.teams.away.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
                      />
                      <span className="font-semibold text-sm sm:text-base truncate">
                        {match.teams.away.name}
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold ml-2">
                      {match.goals.away ?? 0}
                    </span>
                  </div>
                </div>

                {/* Venue */}
                <div className="mt-3 pt-3 border-t border-gray-700 text-center">
                  <p className="text-xs sm:text-sm text-gray-400">
                    {match.fixture.venue.name}
                  </p>
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:flex items-center justify-between p-6">
                {/* Home Team */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={match.teams.home.logo}
                    alt={match.teams.home.name}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="font-semibold text-lg">
                    {match.teams.home.name}
                  </span>
                </div>

                {/* Score & Status */}
                <div className="text-center px-8">
                  <div className="text-3xl font-bold mb-2">
                    {match.goals.home ?? 0} - {match.goals.away ?? 0}
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                      match.fixture.status.short === "FT"
                        ? "bg-gray-600 text-white"
                        : match.fixture.status.short === "LIVE"
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {match.fixture.status.long}
                  </span>
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-4 flex-1 justify-end">
                  <span className="font-semibold text-lg">
                    {match.teams.away.name}
                  </span>
                  <img
                    src={match.teams.away.logo}
                    alt={match.teams.away.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Time & Venue */}
                <div className="text-right text-gray-400 text-sm ml-6 min-w-[120px]">
                  <p>
                    {new Date(match.fixture.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs mt-1">{match.fixture.venue.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {fixtures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No fixtures available for this date</p>
          </div>
        )}
      </div>
    </div>
  );
};