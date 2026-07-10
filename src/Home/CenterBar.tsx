// TodayTips.tsx (center)
import { type MatchPrediction } from "../types/tips";
import { useAuth } from "../context/AuthContext";

interface TodayTipsProps {
  tips: MatchPrediction[];
}

export const TodayTips = ({ tips }: TodayTipsProps) => {
  const { user } = useAuth();
  return (
    <div className="bg-surface-raised rounded-card pt-0 p-4 border border-border">
      <h2 className="text-text-primary font-bold mb-4 text-center">Today's Tips</h2>
      {tips.length === 0 ? (
        <p className="text-text-secondary text-center">No tips available today.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted text-text-secondary text-xs uppercase tracking-wide border-b border-border">
              <th className="py-2 px-3 font-semibold">Time</th>
              <th className="py-2 px-3 font-semibold">Home</th>
              <th className="py-2 px-3 font-semibold">Away</th>
              <th className="py-2 px-3 font-semibold">Prediction</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((tip) => (
              <tr key={tip.id} className="odd:bg-surface even:bg-surface-raised hover:bg-surface-muted transition-colors border-b border-border last:border-0">
                <td className="py-2 px-3 font-data text-text-secondary">{tip.time}</td>
                <td className="py-2 px-3 text-text-primary font-semibold">{tip.homeTeam}</td>
                <td className="py-2 px-3 text-text-primary">{tip.awayTeam}</td>
                <td className="py-2 px-3 text-text-primary font-medium">
                  {user?.type === "premium" ? tip.predictions.premium.predictions[0]?.prediction : tip.predictions.basic.predictions[0]?.prediction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};