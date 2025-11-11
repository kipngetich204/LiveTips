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

  const getTypeColor = (type: string) => {
    return type === "credit" ? "text-green-400" : "text-red-400";
  };

  const getTypeBadgeColor = (type: string) => {
    return type === "credit" 
      ? "bg-green-500/20 text-green-400 border-green-500/30" 
      : "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mt-6">
      <h3 className="text-yellow-400 mb-4 font-bold text-lg sm:text-xl">Transactions</h3>
      
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="p-3 text-sm font-semibold">User</th>
              <th className="p-3 text-sm font-semibold">Amount</th>
              <th className="p-3 text-sm font-semibold">Type</th>
              <th className="p-3 text-sm font-semibold">Date</th>
              <th className="p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-750">
                {editingId === tx.id ? (
                  <>
                    <td className="p-3">
                      <input
                        name="userEmail"
                        type="email"
                        value={editData?.userEmail || ""}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                        placeholder="user@example.com"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        name="amount"
                        type="number"
                        step="0.01"
                        value={editData?.amount || 0}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        name="type"
                        value={editData?.type || "credit"}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      >
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        name="date"
                        type="date"
                        value={editData?.date || ""}
                        onChange={handleChange}
                        className="bg-gray-700 text-white rounded px-2 py-1 w-full text-sm"
                      />
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
                    <td className="p-3 text-sm">{tx.userEmail}</td>
                    <td className={`p-3 text-sm font-bold ${getTypeColor(tx.type)}`}>
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getTypeColor(tx.type)}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-400">{formatDate(tx.date)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(tx)} className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-sm font-medium">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(tx.id)} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm font-medium">
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
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            {editingId === tx.id ? (
              // Edit Mode - Mobile
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">User Email</label>
                  <input
                    name="userEmail"
                    type="email"
                    value={editData?.userEmail || ""}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                    placeholder="user@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Amount</label>
                    <input
                      name="amount"
                      type="number"
                      step="0.01"
                      value={editData?.amount || 0}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Type</label>
                    <select
                      name="type"
                      value={editData?.type || "credit"}
                      onChange={handleChange}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                    >
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Date</label>
                  <input
                    name="date"
                    type="date"
                    value={editData?.date || ""}
                    onChange={handleChange}
                    className="bg-gray-700 text-white rounded px-3 py-2 w-full text-sm"
                  />
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
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">User</p>
                    <p className="text-sm font-medium truncate">{tx.userEmail}</p>
                  </div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded border ${getTypeBadgeColor(tx.type)}`}>
                    {tx.type}
                  </span>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Amount</p>
                      <p className={`text-2xl font-bold ${getTypeColor(tx.type)}`}>
                        ${tx.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Date</p>
                      <p className="text-sm font-medium text-gray-300">
                        {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-700">
                  <button 
                    onClick={() => startEdit(tx)} 
                    className="flex-1 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(tx.id)} 
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

      {transactions.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No transactions found</p>
          <p className="text-sm mt-2">Transaction history will appear here</p>
        </div>
      )}
    </div>
  );
};