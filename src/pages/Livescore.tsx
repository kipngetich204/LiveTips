export function LiveScore() {
  const liveMatches = [
    { id: 1, teams: "Barcelona vs Real Madrid", score: "2 - 1", time: "78’" },
    { id: 2, teams: "Man City vs Arsenal", score: "0 - 0", time: "45’" },
  ];

  return (
    <section className="py-16 bg-gray-900 text-white min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-yellow-400">Live Scores</h2>
        <div className="space-y-4">
          {liveMatches.map((match) => (
            <div
              key={match.id}
              className="bg-gray-800 rounded-xl p-4 flex justify-between items-center hover:bg-gray-700 transition"
            >
              <span className="font-semibold">{match.teams}</span>
              <span className="text-yellow-400">{match.score}</span>
              <span className="text-sm text-gray-400">{match.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
