import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface Tip {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  type: "basic" | "vip";
  status: "pending" | "won" | "lost";
  markets: "Over 2.5 Goals" | "GG" | "1X2" | "Handicap" | "BTTS";
}

export const TipsTable = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [editingTipId, setEditingTipId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Omit<Tip, "id"> | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tips"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Tip, "id">) }));
      setTips(list);
    });
    return () => unsub();
  }, []);

  const startEdit = (tip: Tip) => {
    setEditingTipId(tip.id);
    setEditData({ ...tip });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editData) return;
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveEdit = async () => {
    if (!editingTipId || !editData) return;
    const tipRef = doc(db, "tips", editingTipId);
    await updateDoc(tipRef, editData);
    setEditingTipId(null);
    setEditData(null);
  };

  const cancelEdit = () => {
    setEditingTipId(null);
    setEditData(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tip?")) return;
    await deleteDoc(doc(db, "tips", id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won": return "text-green-400";
      case "lost": return "text-red-400";
      default: return "text-yellow-400";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "vip" ? "text-purple-400" : "text-blue-400";
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
      <h3 className="text-yellow-400 mb-4 font-bold text-lg sm:text-xl">Tips</h3>
      
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3 text-sm font-semibold">League</th>
              <th className="p-3 text-sm font-semibold">Home</th>
              <th className="p-3 text-sm font-semibold">Away</th>
              <th className="p-3 text-sm font-semibold">Prediction</th>
              <th className="p-3 text-sm font-semibold">Type</th>
              <th className="p-3 text-sm font-semibold">Markets</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((tip) => (
              <tr key={tip.id} className="border-b border-gray-700 hover:bg-gray-750">
                {editingTipId === tip.id ? (
                  <>
                    <td className="p-3">
                      <input
                        name="league"
                        value={editData?.league || ""}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        name="homeTeam"
                        value={editData?.homeTeam || ""}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        name="awayTeam"
                        value={editData?.awayTeam || ""}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        name="prediction"
                        value={editData?.prediction || ""}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        name="type"
                        value={editData?.type || "basic"}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      >
                        <option value="basic">Basic</option>
                        <option value="vip">VIP</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        name="markets"
                        value={editData?.markets || "Over 2.5 Goals"}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      >
                        <option>Over 2.5 Goals</option>
                        <option>GG</option>
                        <option>1X2</option>
                        <option>Handicap</option>
                        <option>BTTS</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        name="status"
                        value={editData?.status || "pending"}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      >
                        <option>pending</option>
                        <option>won</option>
                        <option>lost</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 text-sm font-medium">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded hover:bg-gray-600 text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 text-sm">{tip.league}</td>
                    <td className="p-3 text-sm font-medium">{tip.homeTeam}</td>
                    <td className="p-3 text-sm font-medium">{tip.awayTeam}</td>
                    <td className="p-3 text-sm">{tip.prediction}</td>
                    <td className={`p-3 text-sm font-semibold uppercase ${getTypeColor(tip.type)}`}>{tip.type}</td>
                    <td className="p-3 text-sm">{tip.markets}</td>
                    <td className={`p-3 text-sm font-semibold uppercase ${getStatusColor(tip.status)}`}>{tip.status}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(tip)} className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm font-medium">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(tip.id)} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Hidden on desktop */}
      <div className="lg:hidden space-y-4">
        {tips.map((tip) => (
          <div key={tip.id} className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            {editingTipId === tip.id ? (
              // Edit Mode - Mobile
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">League</label>
                  <input
                    name="league"
                    value={editData?.league || ""}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Home Team</label>
                    <input
                      name="homeTeam"
                      value={editData?.homeTeam || ""}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Away Team</label>
                    <input
                      name="awayTeam"
                      value={editData?.awayTeam || ""}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Prediction</label>
                  <input
                    name="prediction"
                    value={editData?.prediction || ""}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Type</label>
                    <select
                      name="type"
                      value={editData?.type || "basic"}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                    >
                      <option value="basic">Basic</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Status</label>
                    <select
                      name="status"
                      value={editData?.status || "pending"}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                    >
                      <option>pending</option>
                      <option>won</option>
                      <option>lost</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Markets</label>
                  <select
                    name="markets"
                    value={editData?.markets || "Over 2.5 Goals"}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                  >
                    <option>Over 2.5 Goals</option>
                    <option>GG</option>
                    <option>1X2</option>
                    <option>Handicap</option>
                    <option>BTTS</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={saveEdit} className="flex-1 bg-green-500 px-4 py-2 rounded hover:bg-green-600 text-sm font-medium">
                    Save
                  </button>
                  <button onClick={cancelEdit} className="flex-1 bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode - Mobile
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">League</p>
                    <p className="text-sm font-medium">{tip.league}</p>
                  </div>
                  <div className="flex gap-1">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getTypeColor(tip.type)}`}>
                      {tip.type}
                    </span>
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getStatusColor(tip.status)}`}>
                      {tip.status}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <p className="text-xs text-gray-400 mb-1">Home</p>
                      <p className="text-sm font-bold">{tip.homeTeam}</p>
                    </div>
                    <div className="px-3 text-gray-500 font-bold">VS</div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-gray-400 mb-1">Away</p>
                      <p className="text-sm font-bold">{tip.awayTeam}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Prediction</p>
                    <p className="text-sm font-medium text-yellow-400">{tip.prediction}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Markets</p>
                    <p className="text-sm font-medium">{tip.markets}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-700">
                  <button 
                    onClick={() => startEdit(tip)} 
                    className="flex-1 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(tip.id)} 
                    className="flex-1 bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {tips.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No tips available</p>
          <p className="text-sm mt-2">Add your first tip to get started</p>
        </div>
      )}
    </div>
  );
};