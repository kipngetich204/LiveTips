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
    const newType = currentType  === "premium" ? "basic": "premium";
    await updateDoc(userRef, { type: newType });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-yellow-400 mb-4 font-bold">Users</h3>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-2">Email</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.type}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => toggleAdmin(user.id, user.type)}
                  className="bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Toggle Type
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
