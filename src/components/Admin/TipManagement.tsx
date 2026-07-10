import { useEffect, useState, useRef } from "react";
import { db } from "../../FirebaseConfig/firebase";
import { onSnapshot, doc, setDoc } from "firebase/firestore";
import { type FullFixture } from "../../types/livescore";
import {
  type MatchPrediction,
  type DailyTipsDoc,
  type Prediction,
  type PredictionTier,
  /* type MatchPredictions, */
} from "../../types/tips";
import { ErrorPage } from "../../pages/Error";

const API_BASE_URL = "https://backend-livetips.onrender.com";

import { TIER_ORDER, type TierKey } from "../../utils/Tieraccess ";

type Summary = DailyTipsDoc["summary"];
const TIER_COLORS: Record<TierKey, string> = {
  basic: "text-green-400",
  premium: "text-yellow-400",
  super_premium: "text-orange-400",
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Helper for the fixture-search autocomplete: extract "HH:MM" from an ISO string.
const formatTime24Hour = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
};

function emptyPrediction(): Prediction {
  return { market: "", prediction: "", confidence: 70, result: null };
}

function emptyTier(): PredictionTier {
  return { predictions: [emptyPrediction()], reason: "" };
}

function emptyMatch(): MatchPrediction {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    livescoreId: "",
    date: todayISO(),
    league: "",
    league_round: "",
    homeTeam: "",
    awayTeam: "",
    time: "",
    score: "- : -",
    matchStatus: "Not Started",
    status: "pending",
    reason: "",
    expected_score: "",
    confidence_score: 70,
    risk_level: "Medium",
    value_rating: 3,
    tip_of_the_day: false,
    match_importance: "Medium",
    referee: null,
    predictions: {
      basic: emptyTier(),
      premium: emptyTier(),
      super_premium: emptyTier(),
    },
  };
}

function computeSummary(matches: MatchPrediction[]): Summary {
  const countFor = (tier: TierKey) =>
    matches.filter((m) => (m.predictions?.[tier]?.predictions?.length ?? 0) > 0).length;
  const tod = matches.find((m) => m.tip_of_the_day);
  return {
    basic: countFor("basic"),
    premium: countFor("premium"),
    super_premium: countFor("super_premium"),
    tip_of_the_day: tod ? `${tod.homeTeam} vs ${tod.awayTeam}` : "",
  };
}

// ---------------------------------------------------------------------------
// Autocomplete Select (unchanged from before, still used for fixture search)
// ---------------------------------------------------------------------------

const AutocompleteSelect = ({
  value,
  onChange,
  options,
  placeholder,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  loading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string, optionLabel: string) => {
    onChange(optionValue);
    setSearchTerm(optionLabel);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full p-2 rounded bg-gray-700 text-white"
        disabled={loading}
      />
      {loading && (
        <div className="absolute right-2 top-2">
          <div className="animate-spin h-5 w-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
        </div>
      )}
      {isOpen && !loading && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map((option, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(option.value, option.label)}
              className="p-2 hover:bg-gray-600 cursor-pointer text-white"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {isOpen && !loading && filteredOptions.length === 0 && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg p-2 text-gray-400">
          No matches found
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Tier editor: one prediction tier (basic / premium / super_premium),
// each with its own reason + a dynamic list of market/pick/confidence rows.
// ---------------------------------------------------------------------------

const TierEditor = ({
  tierKey,
  tier,
  onChange,
}: {
  tierKey: TierKey;
  tier: PredictionTier;
  onChange: (tier: PredictionTier) => void;
}) => {
  const updatePrediction = (idx: number, patch: Partial<Prediction>) => {
    const predictions = tier.predictions.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    onChange({ ...tier, predictions });
  };

  const addPrediction = () => {
    onChange({ ...tier, predictions: [...tier.predictions, emptyPrediction()] });
  };

  const removePrediction = (idx: number) => {
    onChange({ ...tier, predictions: tier.predictions.filter((_, i) => i !== idx) });
  };

  return (
    <div className="border border-gray-700 rounded-lg p-3 mb-3">
      <h4 className={`font-bold text-sm uppercase mb-2 ${TIER_COLORS[tierKey]}`}>
        {tierKey.replace("_", " ")}
      </h4>

      <textarea
        value={tier.reason}
        onChange={(e) => onChange({ ...tier, reason: e.target.value })}
        placeholder={`Why these ${tierKey.replace("_", " ")} picks...`}
        className="w-full p-2 rounded bg-gray-700 text-sm mb-2"
        rows={2}
      />

      <div className="space-y-2">
        {tier.predictions.map((pred, idx) => (
          <div key={idx} className="grid grid-cols-[2fr_2fr_80px_auto] gap-2 items-center">
            <input
              value={pred.market}
              onChange={(e) => updatePrediction(idx, { market: e.target.value })}
              placeholder="Market (e.g. Over 2.5)"
              className="p-1.5 rounded bg-gray-900 text-sm"
            />
            <input
              value={pred.prediction}
              onChange={(e) => updatePrediction(idx, { prediction: e.target.value })}
              placeholder="Pick (e.g. Yes)"
              className="p-1.5 rounded bg-gray-900 text-sm"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={pred.confidence}
              onChange={(e) => updatePrediction(idx, { confidence: Number(e.target.value) })}
              className="p-1.5 rounded bg-gray-900 text-sm"
            />
            <button
              type="button"
              onClick={() => removePrediction(idx)}
              className="text-red-400 hover:text-red-300 text-sm px-1"
              title="Remove market"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPrediction}
        className="mt-2 text-xs text-yellow-400 hover:text-yellow-300"
      >
        + Add market
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const TipManagement = () => {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [dailyDoc, setDailyDoc] = useState<DailyTipsDoc | null>(null);
  const [docLoading, setDocLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [matchForm, setMatchForm] = useState<MatchPrediction>(emptyMatch());

  const [fixtures, setFixtures] = useState<FullFixture[]>([]);
  const [fixturesLoading, setFixturesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to the selected day's document.
  useEffect(() => {
    setDocLoading(true);
    const unsub = onSnapshot(
      doc(db, "dailyTips", selectedDate),
      (snap) => {
        setDailyDoc(snap.exists() ? ({ id: snap.id, ...snap.data() } as DailyTipsDoc) : null);
        setDocLoading(false);
      },
      (err) => {
        console.error("Error loading daily tips doc:", err);
        setDocLoading(false);
      }
    );
    return () => unsub();
  }, [selectedDate]);

  // Fetch fixtures for the match-search autocomplete.
  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setError(null);
        const res = await fetch(`${API_BASE_URL}/matches`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const matchesData = data.matches || [];

        const fixturesData: FullFixture[] = matchesData.map((match: any) => ({
          fixture: {
            id: parseInt(match.id) || 0,
            date: `${match.date}T${match.time}:00Z`,
            timestamp: new Date(`${match.date}T${match.time}:00Z`).getTime() / 1000,
            timezone: "UTC",
            venue: { name: "", city: "" },
            status: {
              long: match.matchStatus,
              short: match.matchStatus === "Live" ? "LIVE" : match.matchStatus === "Finished" ? "FT" : "NS",
              elapsed: null,
            },
          },
          league: { id: 0, name: match.league, country: "", logo: "", season: 0, round: "", standings: false },
          teams: {
            home: { id: 0, name: match.homeTeam, logo: "" },
            away: { id: 0, name: match.awayTeam, logo: "" },
          },
          goals: { home: 0, away: 0 },
          score: {
            halftime: { home: null, away: null },
            fulltime: { home: null, away: null },
            extratime: { home: null, away: null },
            penalty: { home: null, away: null },
          },
        }));

        setFixtures(fixturesData);
      } catch (err: any) {
        console.error("Error fetching fixtures:", err);
        setError(err.message || "Error fetching fixtures");
      } finally {
        setFixturesLoading(false);
      }
    };

    fetchFixtures();
    const interval = setInterval(fetchFixtures, 300000);
    return () => clearInterval(interval);
  }, []);

  if (error && fixtures.length === 0) {
    return <ErrorPage message={error} />;
  }

  const matches = dailyDoc?.matches ?? [];

  const teamOptions = fixtures.map((fixture) => {
    const fixtureDate = fixture.fixture?.date || "";
    return {
      label: `${fixture.teams?.home?.name || ""} vs ${fixture.teams?.away?.name || ""} - ${formatTime24Hour(fixtureDate)}`,
      value: fixture.fixture?.id?.toString() || "",
      homeTeam: fixture.teams?.home?.name || "",
      awayTeam: fixture.teams?.away?.name || "",
      league: fixture.league?.name || "",
      time24: formatTime24Hour(fixtureDate),
      fixtureId: fixture.fixture?.id?.toString() || "",
    };
  });

  const handleFixtureSelect = (fixtureId: string) => {
    const opt = teamOptions.find((o) => o.value === fixtureId);
    if (!opt) return;
    setMatchForm((prev) => ({
      ...prev,
      livescoreId: opt.fixtureId,
      homeTeam: opt.homeTeam,
      awayTeam: opt.awayTeam,
      league: opt.league,
      time: opt.time24,
      date: selectedDate,
    }));
  };

  // Persist the full matches array for the selected date, recomputing summary/total.
  const saveMatches = async (newMatches: MatchPrediction[]) => {
    const docRef = doc(db, "dailyTips", selectedDate);
    await setDoc(
      docRef,
      {
        date: selectedDate,
        generated_at: dailyDoc?.generated_at ?? new Date().toISOString(),
        total: newMatches.length,
        summary: computeSummary(newMatches),
        matches: newMatches,
        uploadedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  };

  const resetForm = () => {
    setMatchForm(emptyMatch());
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async () => {
    if (!matchForm.homeTeam || !matchForm.awayTeam) {
      alert("Please fill in home team and away team (search for a fixture or type them manually).");
      return;
    }
    if (!matchForm.predictions.basic.predictions.some((p) => p.market && p.prediction)) {
      alert("Add at least one Basic tier market + pick.");
      return;
    }

    const finalMatch: MatchPrediction = { ...matchForm, date: selectedDate };

    let newMatches: MatchPrediction[];
    if (editingId) {
      newMatches = matches.map((m) => (m.id === editingId ? finalMatch : m));
    } else {
      newMatches = [...matches, finalMatch];
    }

    // Only one "tip of the day" per day.
    if (finalMatch.tip_of_the_day) {
      newMatches = newMatches.map((m) => (m.id === finalMatch.id ? m : { ...m, tip_of_the_day: false }));
    }

    try {
      await saveMatches(newMatches);
      resetForm();
      alert(editingId ? "Match updated!" : "Match added!");
    } catch (err) {
      console.error("Error saving match:", err);
      alert("Failed to save. Please try again.");
    }
  };

  const startEditing = (match: MatchPrediction) => {
    setMatchForm(match);
    setEditingId(match.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this match?")) return;
    try {
      await saveMatches(matches.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting match:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: MatchPrediction["status"]) => {
    try {
      await saveMatches(matches.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-yellow-400">Tip Management</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Editing day:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm [color-scheme:dark]"
            />
          </div>
        </div>

        {error && fixtures.length > 0 && (
          <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm">
            ⚠️ Could not fetch latest matches for search. Fixture autocomplete may be stale.
          </div>
        )}

        <button
          onClick={() => {
            if (isFormOpen) {
              resetForm();
            } else {
              setMatchForm(emptyMatch());
              setEditingId(null);
              setIsFormOpen(true);
            }
          }}
          className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors font-semibold"
        >
          {isFormOpen ? "✕ Close Form" : "+ Add Match"}
        </button>

        {isFormOpen && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6 space-y-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-yellow-400">
              {editingId ? "Edit Match" : `New Match for ${selectedDate}`}
            </h3>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Search Fixture <span className="text-xs text-gray-500 ml-2">(optional — auto-fills below)</span>
              </label>
              <AutocompleteSelect
                value={matchForm.livescoreId}
                onChange={handleFixtureSelect}
                options={teamOptions.map((opt) => ({ label: opt.label, value: opt.value }))}
                placeholder="Type to search for a match..."
                loading={fixturesLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Home Team *</label>
                <input
                  value={matchForm.homeTeam}
                  onChange={(e) => setMatchForm((p) => ({ ...p, homeTeam: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Away Team *</label>
                <input
                  value={matchForm.awayTeam}
                  onChange={(e) => setMatchForm((p) => ({ ...p, awayTeam: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-300">League</label>
                <input
                  value={matchForm.league}
                  onChange={(e) => setMatchForm((p) => ({ ...p, league: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Round</label>
                <input
                  value={matchForm.league_round}
                  onChange={(e) => setMatchForm((p) => ({ ...p, league_round: e.target.value }))}
                  placeholder="e.g. Quarter-final"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Kickoff Time</label>
                <input
                  value={matchForm.time}
                  onChange={(e) => setMatchForm((p) => ({ ...p, time: e.target.value }))}
                  placeholder="20:00"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Match Reason / Analysis</label>
              <textarea
                value={matchForm.reason}
                onChange={(e) => setMatchForm((p) => ({ ...p, reason: e.target.value }))}
                className="w-full p-2 rounded bg-gray-700 min-h-[70px]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Expected Score</label>
                <input
                  value={matchForm.expected_score}
                  onChange={(e) => setMatchForm((p) => ({ ...p, expected_score: e.target.value }))}
                  placeholder="2-1"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Confidence %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={matchForm.confidence_score}
                  onChange={(e) => setMatchForm((p) => ({ ...p, confidence_score: Number(e.target.value) }))}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Risk Level</label>
                <select
                  value={matchForm.risk_level}
                  onChange={(e) => setMatchForm((p) => ({ ...p, risk_level: e.target.value as MatchPrediction["risk_level"] }))}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Value Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={matchForm.value_rating}
                  onChange={(e) => setMatchForm((p) => ({ ...p, value_rating: Number(e.target.value) }))}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Match Importance</label>
                <select
                  value={matchForm.match_importance}
                  onChange={(e) =>
                    setMatchForm((p) => ({ ...p, match_importance: e.target.value as MatchPrediction["match_importance"] }))
                  }
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Referee</label>
                <input
                  value={matchForm.referee ?? ""}
                  onChange={(e) => setMatchForm((p) => ({ ...p, referee: e.target.value || null }))}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300 pb-2">
                <input
                  type="checkbox"
                  checked={matchForm.tip_of_the_day}
                  onChange={(e) => setMatchForm((p) => ({ ...p, tip_of_the_day: e.target.checked }))}
                  className="h-4 w-4"
                />
                Tip of the Day
              </label>
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-300 mb-2">Predictions by Tier</h3>
              {TIER_ORDER.map((tierKey) => (
                <TierEditor
                  key={tierKey}
                  tierKey={tierKey}
                  tier={matchForm.predictions[tierKey]}
                  onChange={(tier) =>
                    setMatchForm((p) => ({ ...p, predictions: { ...p.predictions, [tierKey]: tier } }))
                  }
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 w-full font-semibold transition-colors"
            >
              {editingId ? "💾 Update Match" : "✓ Save Match"}
            </button>
          </div>
        )}

        <div className="mt-6">
          <div className="mb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-300">
              Matches for {selectedDate} ({matches.length})
            </h3>
            <div className="flex gap-2 text-xs">
              <span className="text-green-400">Won: {matches.filter((m) => m.status === "won").length}</span>
              <span className="text-red-400">Lost: {matches.filter((m) => m.status === "lost").length}</span>
              <span className="text-yellow-400">Pending: {matches.filter((m) => m.status === "pending").length}</span>
            </div>
          </div>

          <div className="space-y-3">
            {docLoading ? (
              <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">Loading...</div>
            ) : matches.length === 0 ? (
              <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">
                <div className="text-4xl mb-3">📋</div>
                <p className="mb-1">No matches for this day yet</p>
                <p className="text-sm text-gray-500">Click "Add Match" to create one</p>
              </div>
            ) : (
              matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-yellow-300 font-semibold text-lg">
                        {match.homeTeam} vs {match.awayTeam}
                        {match.tip_of_the_day && (
                          <span className="ml-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-0.5 rounded-full">
                            TIP OF THE DAY
                          </span>
                        )}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {match.league} {match.league_round && `· ${match.league_round}`}
                      </p>
                      <div className="flex gap-3 mt-1 flex-wrap text-xs text-gray-500">
                        {match.time && <span>🕒 {match.time}</span>}
                        {match.livescoreId && <span>ID: {match.livescoreId}</span>}
                        {match.score && <span className="text-white font-semibold">Score: {match.score}</span>}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        match.matchStatus === "Live"
                          ? "bg-red-600 text-white animate-pulse"
                          : match.matchStatus === "Finished"
                          ? "bg-gray-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {match.matchStatus}
                    </span>
                  </div>

                  <div className="grid gap-2 mb-3 sm:grid-cols-3">
                    {TIER_ORDER.map((tierKey) => {
                      const tier = match.predictions[tierKey];
                      if (!tier?.predictions?.length) return null;
                      return (
                        <div key={tierKey} className="bg-gray-900/60 rounded p-2">
                          <p className={`text-xs font-bold uppercase mb-1 ${TIER_COLORS[tierKey]}`}>
                            {tierKey.replace("_", " ")}
                          </p>
                          {tier.predictions.map((pred, i) => (
                            <p key={i} className="text-xs text-gray-300">
                              {pred.market}: <span className="text-green-400">{pred.prediction}</span>
                            </p>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={match.status}
                      onChange={(e) => handleStatusChange(match.id, e.target.value as MatchPrediction["status"])}
                      className="bg-gray-700 text-white rounded px-3 py-1 text-sm hover:bg-gray-600 transition-colors"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="won">✅ Won</option>
                      <option value="lost">❌ Lost</option>
                    </select>
                    <button
                      onClick={() => startEditing(match)}
                      className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(match.id)}
                      className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};