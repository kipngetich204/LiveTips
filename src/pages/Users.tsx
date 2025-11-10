import  { useState, useEffect } from "react";

interface UserType {
  uuid: string;
  number: number;
  email: string;
  type: "basic" | "premium";
}

export const Users = () => {
  // Default data
  const initialUsers: UserType[] = [
    {
      uuid: crypto.randomUUID(),
      number: 1,
      email: "kipngetichbrian204@gmail.com",
      type: "premium",
    },
  ];

  // Load from localStorage or use default
  const [users, setUsers] = useState<UserType[]>(() => {
    const stored = localStorage.getItem("practiseUserData");
    return stored ? JSON.parse(stored) : initialUsers;
  });

  const [formData, setFormData] = useState<Omit<UserType, "number" | "uuid">>({
    email: "",
    type: "basic",
  });

  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Sync users with localStorage
  useEffect(() => {
    localStorage.setItem("practiseUserData", JSON.stringify(users));
  }, [users]);

  // ✅ Add new user
  const addUser = () => {
    if (!formData.email.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    const newUser: UserType = {
      uuid: crypto.randomUUID(),
      number: users.length + 1,
      email: formData.email,
      type: formData.type,
    };

    setUsers([...users, newUser]);
    setFormData({ email: "", type: "basic" });
  };

  // ✅ Delete user
  const deleteUser = (uuid: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const filtered = users.filter((u) => u.uuid !== uuid);
      setUsers(filtered);
    }
  };

  // ✅ Start editing
  const startEditing = (user: UserType) => {
    setEditingUser(user);
    setFormData({ email: user.email, type: user.type });
  };

  // ✅ Save updates
  const updateUser = () => {
    if (!editingUser) return;

    const updated = users.map((u) =>
      u.uuid === editingUser.uuid
        ? { ...u, email: formData.email, type: formData.type }
        : u
    );

    setUsers(updated);
    setEditingUser(null);
    setFormData({ email: "", type: "basic" });
  };

  return (
    <div className="w-4/5 h-auto bg-gray-100 p-6 rounded-lg shadow-md flex flex-col mt-8 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Manage Users
      </h2>

      {/* Form Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="email"
          placeholder="User email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border border-gray-300 rounded p-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as "basic" | "premium" })
          }
          className="border border-gray-300 rounded p-2 w-full md:w-1/5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
        </select>

        {editingUser ? (
          <button
            onClick={updateUser}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Update User
          </button>
        ) : (
          <button
            onClick={addUser}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            Add User
          </button>
        )}
      </div>

      {/* Table Section */}
      <div>
        <h1>Users Count</h1>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Total Users: {users.length}</h2>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Premium Users: {users.filter(user => user.type==="premium").length}</h2>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Basic Users: {users.filter(user => user.type==="basic").length}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-center border p-2">#</th>
              <th className="text-center border p-2">UUID</th>
              <th className="text-center border p-2">Email</th>
              <th className="text-center border p-2">Type</th>
              <th className="text-center border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.uuid}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <td className="text-center border p-2">{user.number}</td>
                <td className="text-center border p-2 truncate max-w-[150px]">
                  {user.uuid}
                </td>
                <td className="text-center border p-2">{user.email}</td>
                <td className="text-center border p-2 capitalize">{user.type}</td>
                <td className="text-center border p-2 flex justify-center gap-2">
                  <button
                    onClick={() => startEditing(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.uuid)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-4 italic"
                >
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
