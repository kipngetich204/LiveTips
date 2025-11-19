import React, { useEffect, useState, useRef } from "react";
import { db } from "../../FirebaseConfig/firebase";
import {
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { type FullFixture } from "../../types/livescore";
import { type Tiptype } from "../../types/tips";
import { ErrorPage } from "../../pages/Error";

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
    matchStatus: "Not Started",
  });

  const [fixtures, setFixtures] = useState<FullFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const res = await fetch(`https://football-project-backend-cv2j.onrender.com/fixtures`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: FullFixture[] = await res.json();
        setFixtures(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error fetching fixtures");
        return <ErrorPage message={err.message || "Error fetching fixtures"} />;
      } finally {
        setLoading(false);
      }
    };

    fetchFixtures();
  }, []);

  // Fetch all tips
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

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

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
      score:formData.score || '',
      matchStatus: "Not Started",
    };
    try {
      const docRef = await addDoc(collection(db, "tips"), {
        ...newTip,
        status: "pending",
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
    } catch (error) {
      console.error("Error deleting tip:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Tiptype["status"]) => {
    try {
      const tipRef = doc(db, "tips", id);
      await updateDoc(tipRef, { status: newStatus });
      setTips((prev) =>
        prev.map((tip) => (tip.id === id ? { ...tip, status: newStatus } : tip))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Tip Management</h2>

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
        className="bg-green-500 px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
      >
        {isAddTip ? "Close Form" : "Add Tip"}
      </button>

      {isAddTip && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6 space-y-3">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Select Match *</label>
            <AutocompleteSelect
              value={formData.fixtureId}
              onChange={handleHomeTeamChange}
              options={teamOptions.map(opt => ({
                label: opt.label,
                value: opt.value,
              }))}
              placeholder="Search for a match..."
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
                placeholder="Home Team"
                className="w-full p-2 rounded bg-gray-700"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Away Team</label>
              <input
                name="awayTeam"
                value={formData.awayTeam}
                onChange={handleChange}
                placeholder="Away Team"
                className="w-full p-2 rounded bg-gray-700"
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
              placeholder="League"
              className="w-full p-2 rounded bg-gray-700"
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
                className="w-full p-2 rounded bg-gray-700"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Date</label>
              <input
                name="date"
                value={formData.date}
                placeholder="Auto-filled"
                className="w-full p-2 rounded bg-gray-700"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Time (24hr)</label>
              <input
                name="time24"
                value={formData.time24}
                placeholder="Auto-filled"
                className="w-full p-2 rounded bg-gray-700"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Prediction *</label>
            <input
              name="prediction"
              value={formData.prediction}
              onChange={handleChange}
              placeholder="e.g., Home Win, Over 2.5, BTTS Yes"
              className="w-full p-2 rounded bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Reason / Analysis</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Explain why you're making this prediction..."
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
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
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
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 w-full font-semibold"
          >
            {isEditing ? "Update Tip" : "Save Tip"}
          </button>
        </div>
      )}

      {/* Display tips */}
      <div className="mt-6 space-y-3">
        {tips.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center text-gray-400">
            No tips yet. Click "Add Tip" to create your first tip.
          </div>
        ) : (
          tips.map((tip, index) => (
            <div
              key={`${tip.id}-${index}`}
              className="bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-yellow-300 font-semibold text-lg">
                    {tip.homeTeam} vs {tip.awayTeam}
                  </p>
                  <p className="text-gray-400 text-sm">{tip.league}</p>
                  <div className="flex gap-3 mt-1">
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
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    tip.type === "premium"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {tip.type.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <p className="text-white">
                  <span className="text-gray-400">Prediction:</span> {tip.prediction}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Market:</span> {tip.markets}
                </p>
                {tip.reason && (
                  <p className="text-sm text-gray-300">
                    <span className="text-gray-500">Reason:</span> {tip.reason}
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
                  className="bg-gray-700 text-white rounded px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>

                <button
                  onClick={() => startEditing(tip)}
                  className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tip.id)}
                  className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}