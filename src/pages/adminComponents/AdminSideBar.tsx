import { NavLink } from "react-router-dom";

export function AdminSidebar() {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen flex flex-col p-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-10">Admin Panel</h2>

      <nav className="flex flex-col space-y-3">
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition ${
              isActive ? "bg-yellow-500 text-black font-semibold" : "hover:bg-gray-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin-dashboard/users"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition ${
              isActive ? "bg-yellow-500 text-black font-semibold" : "hover:bg-gray-800"
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin-dashboard/matches"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition ${
              isActive ? "bg-yellow-500 text-black font-semibold" : "hover:bg-gray-800"
            }`
          }
        >
          Matches
        </NavLink>

        <NavLink
          to="/admin-dashboard/tips"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition ${
              isActive ? "bg-yellow-500 text-black font-semibold" : "hover:bg-gray-800"
            }`
          }
        >
          Tips
        </NavLink>
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            window.location.href = "/login";
          }}
          className="w-full bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-lg mt-6"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
