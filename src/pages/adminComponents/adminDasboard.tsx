import { AdminSidebar } from "./AdminSideBar";
import { AdminTopbar } from "./AdminTopBar";

export function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-gray-600 text-sm">Total Users</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-500">1,204</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-gray-600 text-sm">Matches Tracked</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-500">312</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-gray-600 text-sm">Tips Published</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-500">58</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-gray-600 text-sm">Active Premium Users</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-500">102</p>
            </div>
          </div>

          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Recent Activities
            </h3>
            <div className="bg-white rounded-xl shadow p-4 space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-700">
                  ✅ New user registered — <span className="font-semibold">John Doe</span>
                </p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-700">
                  ⚽ Match added — <span className="font-semibold">Arsenal vs Chelsea</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  💡 New tip posted — <span className="font-semibold">Over 2.5 Goals</span>
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
