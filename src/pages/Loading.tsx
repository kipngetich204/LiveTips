
import { Logo } from "../assets/logo";
export const LoadingPage = () => {
  return (
    <>
    <Logo/>
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <p className="text-yellow-400 text-lg animate-pulse">Loading tips...</p>
    </div>
    </>
  );
};



