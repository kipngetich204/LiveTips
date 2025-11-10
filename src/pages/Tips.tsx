import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../FirebaseConfig/firebase'
import type { Tiptype } from '../types/tips'

// ✅ Fetch tips from Firestore
async function getTips(): Promise<Tiptype[]> {
  const querySnapshot = await getDocs(collection(db, 'tips'))
  const tipsList: Tiptype[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as Tiptype[]
  return tipsList
}

export const tipsList= await getTips()

export const Tips = () => {
  const { user } = useAuth()
  const [tips, setTips] = useState<Tiptype[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTips = async () => {
      const tipsData = await getTips()
      setTips(tipsData)
      setLoading(false)
    }
    fetchTips()
  }, [])

  // ✅ Determine which tips to show
  const displayedTips =
    user?.type === 'premium'
      ? tips.filter(tip => tip.type === 'premium' || tip.type === 'basic')
      : tips.filter(tip => tip.type === 'basic')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-yellow-400 text-lg animate-pulse">Loading tips...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Today’s Betting Tips
        </h2>

        {!displayedTips.length ? (
          <div className="text-center bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-300">No tips available right now. Check back later!</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-yellow-400 text-gray-900">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Home Team</th>
                  <th className="py-3 px-4">Away Team</th>
                  <th className="py-3 px-4">Prediction</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-center">Type</th>
                </tr>
              </thead>
              <tbody>
                {displayedTips.map((tip, index) => (
                  <tr
                    key={tip.id}
                    className={`hover:bg-gray-700 transition ${
                      index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
                    }`}
                  >
                    <td className="py-3 px-4">{tip.time}</td>
                    <td className="py-3 px-4 font-semibold text-yellow-300">
                      {tip.homeTeam}
                    </td>
                    <td className="py-3 px-4">{tip.awayTeam}</td>
                    <td className="py-3 px-4 text-green-400 font-medium">
                      {tip.prediction}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{tip.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          tip.type === 'premium'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                            : 'bg-green-500 text-black'
                        }`}
                      >
                        {tip.type.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            {user?.type === 'premium'
              ? 'You have access to both basic and premium tips.'
              : 'Upgrade to premium to unlock exclusive VIP tips!'}
          </p>
        </div>
      </div>
    </div>
  )
}
