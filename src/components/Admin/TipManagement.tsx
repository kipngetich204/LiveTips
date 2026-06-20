import React, { useEffect, useState, useRef } from "react";
import { db } from "../../FirebaseConfig/firebase";
import {
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { type FullFixture } from "../../types/livescore";
import { type Tiptype } from "../../types/tips";
import { ErrorPage } from "../../pages/Error";



// adding first testing data for tips page
// Add import at the top
import { testingTipsData } from "../../testingData/testing_tips_data";

// Add this handler inside TipManagement
const handleUploadDailyTips = async () => {
  const dailyTip = testingTipsData[0];
  if (!dailyTip) {
    alert("No daily tips data found.");
    return;
  }

  const confirmed = confirm(
    `Upload daily tips for ${dailyTip.date} (${dailyTip.total} matches) to Firebase?`
  );
  if (!confirmed) return;

  try {
    // Use the date as the document ID so each day is unique
    // and re-uploading the same date overwrites instead of duplicating
    const docRef = doc(db, "dailyTips", dailyTip.date);
    await setDoc(docRef, {
      date: dailyTip.date,
      generated_at: dailyTip.generated_at,
      total: dailyTip.total,
      summary: dailyTip.summary,
      matches: dailyTip.matches,
      uploadedAt: new Date().toISOString(),
    });
    alert(`✅ Daily tips for ${dailyTip.date} uploaded successfully!`);
  } catch (err) {
    console.error("Error uploading daily tips:", err);
    alert("❌ Failed to upload daily tips. Please try again.");
  }
};

const API_BASE_URL = "https://backend-livetips.onrender.com";

const marketsOptions: Tiptype["markets"][] = [
  "Over 2.5 Goals",
  "GG",
  "1X2",
  "Handicap",
  "BTTS",
];

// Helper function to format date to 24-hour time
const formatTime24Hour = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Autocomplete Select Component
const AutocompleteSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  loading 
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

  const filteredOptions = options.filter(option =>
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

export const TipManagement = () => {
  const [tips, setTips] = useState<Tiptype[]>([]);
  const [isAddTip, setIsAddTip] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    league: "",
    homeTeam: "",
    awayTeam: "",
    prediction: "",
    type: "basic" as "basic" | "premium",
    markets: "Over 2.5 Goals" as Tiptype["markets"],
    fixtureId: "",
    reason: "",
    time: "",
    date: "",
    time24: "",
    score: "",
    matchStatus: "Not Started" as "Live" | "Finished" | "Not Started",
  });

  const [fixtures, setFixtures] = useState<FullFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch fixtures from API
  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setError(null);
        const res = await fetch(`${API_BASE_URL}/matches`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        
        // The API returns { matches: Tiptype[], ... }
        // We need to convert this to FullFixture format for the UI
        const matchesData = data.matches || [];
        
        // Convert matches to fixture format for autocomplete
        const fixturesData: FullFixture[] = matchesData.map((match: any) => ({
          fixture: {
            id: parseInt(match.id) || 0,
            date: `${match.date}T${match.time}:00Z`,
            timestamp: new Date(`${match.date}T${match.time}:00Z`).getTime() / 1000,
            timezone: "UTC",
            venue: {
              name: "",
              city: "",
            },
            status: {
              long: match.matchStatus,
              short: match.matchStatus === "Live" ? "LIVE" : match.matchStatus === "Finished" ? "FT" : "NS",
              elapsed: null,
            },
          },
          league: {
            id: 0,
            name: match.league,
            country: "",
            logo: "",
            season: 0,
            round: "",
            standings: false,
          },
          teams: {
            home: {
              id: 0,
              name: match.homeTeam,
              logo: "",
            },
            away: {
              id: 0,
              name: match.awayTeam,
              logo: "",
            },
          },
          goals: {
            home: 0,
            away: 0,
          },
          score: {
            halftime: { home: null, away: null },
            fulltime: { home: null, away: null },
            extratime: { home: null, away: null },
            penalty: { home: null, away: null },
          },
        }));
        
        setFixtures(fixturesData);
        setLastUpdate(new Date());
      } catch (err: any) {
        console.error("Error fetching fixtures:", err);
        setError(err.message || "Error fetching fixtures");
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();

    // Refresh fixtures every 5 minutes
    const interval = setInterval(fetchFixtures, 300000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all tips from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tips"), (snapshot) => {
      const liveTips: Tiptype[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Tiptype, "id">),
      }));
      setTips(liveTips);
    });
    return () => unsub();
  }, []);

  if (error && fixtures.length === 0) {
    return <ErrorPage message={error} />;
  }

  // Create team options from fixtures with formatted time and date
  const teamOptions = fixtures.map(fixture => {
    const fixtureDate = fixture.fixture?.date || '';
    return {
      label: `${fixture.teams?.home?.name || ''} vs ${fixture.teams?.away?.name || ''} - ${formatDate(fixtureDate)} ${formatTime24Hour(fixtureDate)}`,
      value: fixture.fixture?.id?.toString() || '',
      homeTeam: fixture.teams?.home?.name || '',
      awayTeam: fixture.teams?.away?.name || '',
      league: fixture.league?.name || '',
      time: fixtureDate,
      date: formatDate(fixtureDate),
      time24: formatTime24Hour(fixtureDate),
      fixtureId: fixture.fixture?.id?.toString() || '',
    };
  });

  const handleHomeTeamChange = (fixtureId: string) => {
    const selectedFixture = teamOptions.find(opt => opt.value === fixtureId);
    if (selectedFixture) {
      setFormData(prev => ({
        ...prev,
        fixtureId: selectedFixture.fixtureId,
        homeTeam: selectedFixture.homeTeam,
        awayTeam: selectedFixture.awayTeam,
        league: selectedFixture.league,
        time: selectedFixture.time,
        date: selectedFixture.date,
        time24: selectedFixture.time24,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.homeTeam || !formData.awayTeam || !formData.prediction) {
      alert("Please fill in all required fields");
      return;
    }

    const newTip: Omit<Tiptype, "id" | "status"> = {
      league: formData.league,
      homeTeam: formData.homeTeam,
      awayTeam: formData.awayTeam,
      prediction: formData.prediction,
      type: formData.type,
      markets: formData.markets,
      livescoreId: formData.fixtureId,
      date: formData.date,
      reason: formData.reason,
      time: formData.time24,
      score: formData.score || '- : -',
      matchStatus: "Not Started",
    };
    
    try {
      const docRef = await addDoc(collection(db, "tips"), {
        ...newTip,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      const savedTip: Tiptype = { id: docRef.id, ...newTip, status: "pending" };
      setTips((prev) => [...prev, savedTip]);
      setFormData({
        league: "",
        homeTeam: "",
        awayTeam: "",
        prediction: "",
        type: "basic",
        markets: "Over 2.5 Goals",
        fixtureId: "",
        reason: "",
        time: "",
        date: "",
        time24: "",
        score: "",
        matchStatus: "Not Started",
      });
      setIsAddTip(false);
      alert("Tip created successfully!");
    } catch (error) {
      console.error("Error saving tip:", error);
      alert("Failed to save tip. Please try again.");
    }
  };

  const startEditing = (tip: Tiptype) => {
    setIsEditing(tip.id);
    setFormData({
      league: tip.league,
      homeTeam: tip.homeTeam,
      awayTeam: tip.awayTeam,
      prediction: tip.prediction,
      type: tip.type,
      markets: tip.markets,
      fixtureId: tip.livescoreId,
      time: tip.time,
      reason: tip.reason,
      date: tip.date || '',
      time24: tip.time || '',
      score: tip.score || '',
      matchStatus: tip.matchStatus || "Not Started",
    });
    setIsAddTip(true);
  };

  const handleUpdate = async () => {
    if (!isEditing) return;
    try {
      const tipRef = doc(db, "tips", isEditing);
      const updateData = {
        league: formData.league,
        homeTeam: formData.homeTeam,
        awayTeam: formData.awayTeam,
        prediction: formData.prediction,
        type: formData.type,
        markets: formData.markets,
        reason: formData.reason,
        time: formData.time24,
        date: formData.date,
        livescoreId: formData.fixtureId,
        lastUpdated: new Date().toISOString(),
      };
      await updateDoc(tipRef, updateData);
      setTips((prev) =>
        prev.map((tip) => (tip.id === isEditing ? { ...tip, ...updateData } : tip))
      );
      setIsEditing(null);
      setFormData({
        league: "",
        homeTeam: "",
        awayTeam: "",
        prediction: "",
        type: "basic",
        markets: "Over 2.5 Goals",
        fixtureId: "",
        time: "",
        reason: "",
        date: "",
        time24: "",
        score: "",
        matchStatus: "Not Started",
      });
      setIsAddTip(false);
      alert("Tip updated successfully!");
    } catch (error) {
      console.error("Error updating tip:", error);
      alert("Failed to update tip. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tip?")) return;
    try {
      await deleteDoc(doc(db, "tips", id));
      setTips((prev) => prev.filter((tip) => tip.id !== id));
      alert("Tip deleted successfully!");
    } catch (error) {
      console.error("Error deleting tip:", error);
      alert("Failed to delete tip. Please try again.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: Tiptype["status"]) => {
    try {
      const tipRef = doc(db, "tips", id);
      await updateDoc(tipRef, { 
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      });
      setTips((prev) =>
        prev.map((tip) => (tip.id === id ? { ...tip, status: newStatus } : tip))
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-400">Tip Management</h2>
          <div className="text-sm text-gray-400">
            {fixtures.length} matches available • Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Error banner */}
        {error && fixtures.length > 0 && (
          <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm">
            ⚠️ Could not fetch latest matches. Using cached data.
          </div>
        )}

        <button
          onClick={() => {
            setIsAddTip((prev) => !prev);
            setIsEditing(null);
            setFormData({
              league: "",
              homeTeam: "",
              awayTeam: "",
              prediction: "",
              type: "basic",
              markets: "Over 2.5 Goals",
              fixtureId: "",
              reason: "",
              time: "",
              date: "",
              time24: "",
              score: "",
              matchStatus: "Not Started",
            });
          }}
          className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600 transition-colors font-semibold"
        >
          {isAddTip ? "✕ Close Form" : "+ Add Tip"}
        </button>

        {isAddTip && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6 space-y-3 border border-gray-700">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-yellow-400">
                {isEditing ? "Edit Tip" : "Create New Tip"}
              </h3>
              <p className="text-sm text-gray-400">
                {loading ? "Loading matches..." : `Select from ${fixtures.length} available matches`}
              </p>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Select Match * 
                <span className="text-xs text-gray-500 ml-2">(Search by team name)</span>
              </label>
              <AutocompleteSelect
                value={formData.fixtureId}
                onChange={handleHomeTeamChange}
                options={teamOptions.map(opt => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                placeholder="Type to search for a match..."
                loading={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Home Team</label>
                <input
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleChange}
                  placeholder="Auto-filled from match selection"
                  className="w-full p-2 rounded bg-gray-700 text-gray-400"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Away Team</label>
                <input
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleChange}
                  placeholder="Auto-filled from match selection"
                  className="w-full p-2 rounded bg-gray-700 text-gray-400"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">League</label>
              <input
                name="league"
                value={formData.league}
                onChange={handleChange}
                placeholder="Auto-filled from match selection"
                className="w-full p-2 rounded bg-gray-700 text-gray-400"
                readOnly
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Fixture ID</label>
                <input
                  name="fixtureId"
                  value={formData.fixtureId}
                  placeholder="Auto-filled"
                  className="w-full p-2 rounded bg-gray-700 text-gray-400 text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Date</label>
                <input
                  name="date"
                  value={formData.date}
                  placeholder="Auto-filled"
                  className="w-full p-2 rounded bg-gray-700 text-gray-400 text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Time (24hr)</label>
                <input
                  name="time24"
                  value={formData.time24}
                  placeholder="Auto-filled"
                  className="w-full p-2 rounded bg-gray-700 text-gray-400 text-sm"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Prediction * 
                <span className="text-xs text-gray-500 ml-2">
                  (e.g., "Home Win", "Over 2.5", "BTTS Yes", "Draw")
                </span>
              </label>
              <input
                name="prediction"
                value={formData.prediction}
                onChange={handleChange}
                placeholder="Enter your prediction..."
                className="w-full p-2 rounded bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Reason / Analysis
                <span className="text-xs text-gray-500 ml-2">(Optional but recommended)</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Explain your prediction: team form, head-to-head, injuries, tactics..."
                className="w-full p-2 rounded bg-gray-700 min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-300">Tip Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700"
                >
                  <option value="basic">Basic (Free)</option>
                  <option value="premium">Premium (VIP)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">Market</label>
                <select
                  name="markets"
                  value={formData.markets}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700"
                >
                  {marketsOptions.map((market) => (
                    <option key={market} value={market}>
                      {market}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={isEditing ? handleUpdate : handleSubmit}
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 w-full font-semibold transition-colors"
            >
              {isEditing ? "💾 Update Tip" : "✓ Save Tip"}
            </button>
          </div>
        )}

        <div className="flex gap-3 mb-4">
  <button
    onClick={() => {
      setIsAddTip((prev) => !prev);
      setIsEditing(null);
      setFormData({
        league: "", homeTeam: "", awayTeam: "", prediction: "",
        type: "basic", markets: "Over 2.5 Goals", fixtureId: "",
        reason: "", time: "", date: "", time24: "", score: "",
        matchStatus: "Not Started",
      });
    }}
    className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
  >
    {isAddTip ? "✕ Close Form" : "+ Add Tip"}
  </button>

  <button
    onClick={handleUploadDailyTips}
    className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
  >
    ⬆ Upload Daily Tips ({testingTipsData[0]?.date})
  </button>
</div>

        {/* Display tips */}
        <div className="mt-6">
          <div className="mb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-300">
              All Tips ({tips.length})
            </h3>
            <div className="flex gap-2 text-xs">
              <span className="text-green-400">
                Won: {tips.filter(t => t.status === "won").length}
              </span>
              <span className="text-red-400">
                Lost: {tips.filter(t => t.status === "lost").length}
              </span>
              <span className="text-yellow-400">
                Pending: {tips.filter(t => t.status === "pending").length}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {tips.length === 0 ? (
              <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">
                <div className="text-4xl mb-3">📋</div>
                <p className="mb-1">No tips yet</p>
                <p className="text-sm text-gray-500">Click "Add Tip" to create your first tip</p>
              </div>
            ) : (
              tips.map((tip, index) => (
                <div
                  key={`${tip.id}-${index}`}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-yellow-300 font-semibold text-lg">
                        {tip.homeTeam} vs {tip.awayTeam}
                      </p>
                      <p className="text-gray-400 text-sm">{tip.league}</p>
                      <div className="flex gap-3 mt-1 flex-wrap">
                        {tip.date && (
                          <p className="text-gray-500 text-xs">
                            📅 {tip.date}
                          </p>
                        )}
                        {tip.time && (
                          <p className="text-gray-500 text-xs">
                            🕒 {tip.time}
                          </p>
                        )}
                        {tip.livescoreId && (
                          <p className="text-gray-500 text-xs">
                            ID: {tip.livescoreId}
                          </p>
                        )}
                        {tip.score && (
                          <p className="text-white text-xs font-semibold">
                            Score: {tip.score}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          tip.type === "premium"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {tip.type.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          tip.matchStatus === "Live"
                            ? "bg-red-600 text-white animate-pulse"
                            : tip.matchStatus === "Finished"
                            ? "bg-gray-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {tip.matchStatus}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <p className="text-white">
                      <span className="text-gray-400 text-sm">Prediction:</span>{" "}
                      <span className="font-semibold">{tip.prediction}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Market:</span> {tip.markets}
                    </p>
                    {tip.reason && (
                      <p className="text-sm text-gray-300 bg-gray-900 p-2 rounded">
                        <span className="text-gray-500">Analysis:</span> {tip.reason}
                      </p>
                    )}
                    <p className="text-sm">
                      <span className="text-gray-500">Status:</span>{" "}
                      <span
                        className={`font-semibold ${
                          tip.status === "won"
                            ? "text-green-400"
                            : tip.status === "lost"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {tip.status.toUpperCase()}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={tip.status}
                      onChange={(e) =>
                        handleStatusChange(tip.id, e.target.value as Tiptype["status"])
                      }
                      className="bg-gray-700 text-white rounded px-3 py-1 text-sm hover:bg-gray-600 transition-colors"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="won">✅ Won</option>
                      <option value="lost">❌ Lost</option>
                    </select>

                    <button
                      onClick={() => startEditing(tip)}
                      className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tip.id)}
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