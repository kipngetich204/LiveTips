import { useEffect, useState } from "react";
import { db } from "../../FirebaseConfig/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface User {
  id: string;
  email: string;
  type: "basic" | "premium";
}

export const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<User, "id">) }));
      setUsers(list);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await deleteDoc(doc(db, "users", id));
  };

  const toggleAdmin = async (id: string, currentType: string) => {
    const userRef = doc(db, "users", id);
    const newType = currentType === "premium" ? "basic" : "premium";
    await updateDoc(userRef, { type: newType });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-yellow-400 font-bold text-lg md:text-xl">
          Users ({users.length})
        </h3>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750 transition">
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.type === "premium"
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {user.type}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAdmin(user.id, user.type)}
                      className="bg-blue-500 px-3 py-1.5 rounded hover:bg-blue-600 text-sm font-medium transition"
                    >
                      Toggle Type
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 px-3 py-1.5 rounded hover:bg-red-600 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No users found
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {users.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-750 transition">
                {/* User Info */}
                <div className="mb-3">
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-white font-medium break-all">{user.email}</p>
                </div>

                {/* Type Badge */}
                <div className="mb-3">
                  <p className="text-sm text-gray-400 mb-1">Type</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.type === "premium"
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {user.type}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => toggleAdmin(user.id, user.type)}
                    className="flex-1 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium transition"
                  >
                    Toggle Type
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};