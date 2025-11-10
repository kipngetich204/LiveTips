
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "2025-11-01", revenue: 400 },
  { date: "2025-11-02", revenue: 300 },
  { date: "2025-11-03", revenue: 500 },
  { date: "2025-11-04", revenue: 700 },
];

export const AnalyticsGraph = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full h-64">
      <h3 className="text-gray-400 mb-2">Revenue Over Time</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid stroke="#444" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#FACC15" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
