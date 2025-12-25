import { useAuth } from "../../hooks/useAuth";
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

  if (user && user.type === "premium") return <Tips />;

  return (
    <section className="py-12 sm:py-16 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-yellow-400">
          Premium Plans
        </h2>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:bg-gray-700 transition transform hover:-translate-y-1"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {plan.name}
              </h3>
              <p className="text-yellow-400 font-bold text-base sm:text-lg mb-4">
                {plan.price}
              </p>

              <ul className="text-gray-300 text-sm sm:text-base space-y-2 mb-6 text-left max-w-[200px] mx-auto">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>

              <button className="w-full bg-yellow-400 text-black font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-yellow-500 transition-all">
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
