import { useAuth } from "../context/AuthContext";
import { Tips } from "./Tips";
export function Premium() {
  const { user } = useAuth();
  const plans = [
    {
      name: "Basic",
      price: "$5/month",
      features: ["Access to live predictions", "Ad-free experience"],
    },
    {
      name: "Pro",
      price: "$10/month",
      features: ["Everything in Basic", "Expert analysis", "Priority updates"],
    },
    {
      name: "Elite",
      price: "$20/month",
      features: ["All Pro features", "1-on-1 strategy calls"],
    },
  ];

  return (
    <>{ user && user.type === 'premium' ? <Tips/> :
    <section className="py-16 bg-black text-white min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-yellow-400">Premium Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:bg-gray-700 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-yellow-400 font-bold text-lg mb-4">{plan.price}</p>
              <ul className="text-gray-300 text-sm space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition">
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
        
}
    </>
  );
}
