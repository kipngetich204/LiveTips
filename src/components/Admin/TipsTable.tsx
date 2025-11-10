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

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-yellow-400 mb-4 font-bold">Tips</h3>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">League</th>
            <th className="p-2">Home</th>
            <th className="p-2">Away</th>
            <th className="p-2">Prediction</th>
            <th className="p-2">Type</th>
            <th className="p-2">Markets</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tips.map((tip) => (
            <tr key={tip.id} className="border-b border-gray-700">
              {editingTipId === tip.id ? (
                <>
                  <td className="p-2">
                    <input
                      name="league"
                      value={editData?.league || ""}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="homeTeam"
                      value={editData?.homeTeam || ""}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="awayTeam"
                      value={editData?.awayTeam || ""}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="prediction"
                      value={editData?.prediction || ""}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      name="type"
                      value={editData?.type || "basic"}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    >
                      <option value="basic">Basic</option>
                      <option value="vip">VIP</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      name="markets"
                      value={editData?.markets || "Over 2.5 Goals"}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    >
                      <option>Over 2.5 Goals</option>
                      <option>GG</option>
                      <option>1X2</option>
                      <option>Handicap</option>
                      <option>BTTS</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select
                      name="status"
                      value={editData?.status || "pending"}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    >
                      <option>pending</option>
                      <option>won</option>
                      <option>lost</option>
                    </select>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button onClick={saveEdit} className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 text-sm">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-600 text-sm">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{tip.league}</td>
                  <td className="p-2">{tip.homeTeam}</td>
                  <td className="p-2">{tip.awayTeam}</td>
                  <td className="p-2">{tip.prediction}</td>
                  <td className="p-2">{tip.type}</td>
                  <td className="p-2">{tip.markets}</td>
                  <td className="p-2">{tip.status}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => startEdit(tip)} className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 text-sm">Edit</button>
                    <button onClick={() => handleDelete(tip.id)} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

/*   function startEdit(tip: Tip) {
    setEditingTipId(tip.id);
    setEditData({ ...tip });
  } */
};
