

export const RevenueCard = () => {
  // Example revenue data
  const revenue = 12345;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-start">
      <h3 className="text-gray-400 text-sm">Total Revenue</h3>
      <p className="text-2xl font-bold text-yellow-400">${revenue.toLocaleString()}</p>
    </div>
  );
};
