import React, { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface Transaction {
  id: string;
  userEmail: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
}

export const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Omit<Transaction, "id"> | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "transactions"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Transaction, "id">) }));
      setTransactions(list);
    });
    return () => unsub();
  }, []);

  const startEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditData({ ...tx });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editData) return;
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: name === "amount" ? parseFloat(value) : value });
  };

  const saveEdit = async () => {
    if (!editingId || !editData) return;
    const txRef = doc(db, "transactions", editingId);
    await updateDoc(txRef, editData);
    setEditingId(null);
    setEditData(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await deleteDoc(doc(db, "transactions", id));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-yellow-400 mb-4 font-bold">Transactions</h3>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Type</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-gray-700">
              {editingId === tx.id ? (
                <>
                  <td className="p-2">
                    <input
                      name="userEmail"
                      value={editData?.userEmail || ""}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      name="amount"
                      type="number"
                      value={editData?.amount || 0}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      name="type"
                      value={editData?.type || "credit"}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    >
                      <option>credit</option>
                      <option>debit</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      name="date"
                      type="date"
                      value={editData?.date || ""}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <button onClick={saveEdit} className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 text-sm">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-600 text-sm">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{tx.userEmail}</td>
                  <td className="p-2">${tx.amount}</td>
                  <td className="p-2">{tx.type}</td>
                  <td className="p-2">{tx.date}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => startEdit(tx)} className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 text-sm">Edit</button>
                    <button onClick={() => handleDelete(tx.id)} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-sm">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
