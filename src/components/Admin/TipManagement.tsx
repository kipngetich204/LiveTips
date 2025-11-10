import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig/firebase";
import {
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Tip {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  type: "basic" | "vip";
  status: "won" | "lost" | "pending";
  markets: "Over 2.5 Goals" | "GG" | "1X2" | "Handicap" | "BTTS";
}

const marketsOptions: Tip["markets"][] = [
  "Over 2.5 Goals",
  "GG",
  "1X2",
  "Handicap",
  "BTTS",
];

export const TipManagement = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isAddTip, setIsAddTip] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    league: "",
    homeTeam: "",
    awayTeam: "",
    prediction: "",
    type: "basic" as "basic" | "vip",
    markets: "Over 2.5 Goals" as Tip["markets"],
  });

  // Fetch all tips
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tips"), (snapshot) => {
      const liveTips: Tip[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Tip, "id">),
      }));
      setTips(liveTips);
    });
    return () => unsub();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTip: Omit<Tip, "id" | "status"> = { ...formData };
    try {
      const docRef = await addDoc(collection(db, "tips"), {
        ...newTip,
        status: "pending",
      });
      const savedTip: Tip = { id: docRef.id, ...newTip, status: "pending" };
      setTips((prev) => [...prev, savedTip]);
      setFormData({
        league: "",
        homeTeam: "",
        awayTeam: "",
        prediction: "",
        type: "basic",
        markets: "Over 2.5 Goals",
      });
      setIsAddTip(false);
    } catch (error) {
      console.error("Error saving tip:", error);
    }
  };

  const startEditing = (tip: Tip) => {
    setIsEditing(tip.id);
    setFormData({
      league: tip.league,
      homeTeam: tip.homeTeam,
      awayTeam: tip.awayTeam,
      prediction: tip.prediction,
      type: tip.type,
      markets: tip.markets,
    });
    setIsAddTip(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    try {
      const tipRef = doc(db, "tips", isEditing);
      await updateDoc(tipRef, formData);
      setTips((prev) =>
        prev.map((tip) => (tip.id === isEditing ? { ...tip, ...formData } : tip))
      );
      setIsEditing(null);
      setFormData({
        league: "",
        homeTeam: "",
        awayTeam: "",
        prediction: "",
        type: "basic",
        markets: "Over 2.5 Goals",
      });
      setIsAddTip(false);
    } catch (error) {
      console.error("Error updating tip:", error);
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

  const handleStatusChange = async (id: string, newStatus: Tip["status"]) => {
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
          });
        }}
        className="bg-green-500 px-4 py-2 rounded-lg mb-4"
      >
        {isAddTip ? "Close Form" : "Add Tip"}
      </button>

      {isAddTip && (
        <form
          onSubmit={isEditing ? handleUpdate : handleSubmit}
          className="bg-gray-800 p-4 rounded-lg mb-6 space-y-3"
        >
          <input
            name="league"
            value={formData.league}
            onChange={handleChange}
            placeholder="League"
            className="w-full p-2 rounded bg-gray-700"
          />
          <input
            name="homeTeam"
            value={formData.homeTeam}
            onChange={handleChange}
            placeholder="Home Team"
            className="w-full p-2 rounded bg-gray-700"
          />
          <input
            name="awayTeam"
            value={formData.awayTeam}
            onChange={handleChange}
            placeholder="Away Team"
            className="w-full p-2 rounded bg-gray-700"
          />
          <input
            name="prediction"
            value={formData.prediction}
            onChange={handleChange}
            placeholder="Prediction"
            className="w-full p-2 rounded bg-gray-700"
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700"
          >
            <option value="basic">Basic</option>
            <option value="vip">VIP</option>
          </select>
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

          <button
            type="submit"
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            {isEditing ? "Update Tip" : "Save Tip"}
          </button>
        </form>
      )}

      {/* Display tips */}
      <div className="mt-6 space-y-3">
        {tips.map((tip, index) => (
          <div
            key={`${tip.id}-${index}`}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-yellow-300 font-semibold">
                {tip.league}: {tip.homeTeam} vs {tip.awayTeam}
              </p>
              <p className="text-gray-300 text-sm">{tip.prediction}</p>
              <p className="text-sm text-gray-400">
                Market: {tip.markets}
              </p>
              <p className="text-sm text-gray-400">
                Status: {tip.status.toUpperCase()}
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={tip.status}
                onChange={(e) =>
                  handleStatusChange(tip.id, e.target.value as Tip["status"])
                }
                className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
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
        ))}
      </div>
    </div>
  );
};
