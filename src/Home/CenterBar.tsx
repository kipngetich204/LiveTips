
import { type Tiptype } from "./RightBar";

interface TodayTipsProps {
  tips: Tiptype[];
}

export const TodayTips = ({ tips }: TodayTipsProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-yellow-400 font-bold mb-4 text-center">Today's Tips</h2>
      {tips.length === 0 ? (
        <p className="text-gray-300 text-center">No tips available today.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yellow-400 text-gray-900">
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Home</th>
              <th className="py-2 px-3">Away</th>
              <th className="py-2 px-3">Prediction</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((tip) => (
              <tr key={tip.id} className="odd:bg-gray-900 even:bg-gray-700 hover:bg-gray-600 transition">
                <td className="py-2 px-3">{tip.time}</td>
                <td className="py-2 px-3 text-yellow-300 font-semibold">{tip.homeTeam}</td>
                <td className="py-2 px-3">{tip.awayTeam}</td>
                <td className="py-2 px-3 text-green-400">{tip.prediction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
