export function AdminTopbar() {
  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-700">Admin Dashboard</h1>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm"
        />
        <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black">
          A
        </div>
      </div>
    </header>
  );
}
