

export const Header = () => {
  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 shadow-md">
      <h2 className="ml-10 text-xl font-bold">Admin Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-300">Admin</span>
        <button className="bg-yellow-400 text-black px-3 py-1 rounded">Logout</button>
      </div>
    </div>
  );
};
