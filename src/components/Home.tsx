import { MarketsSidebar } from "../Home/LeftBar";
import { TodayTips } from "../Home/CenterBar";
import { YesterdayTips } from "../Home/RightBar";
import { tipsList } from "../pages/Tips";
import type { Tiptype } from "../Home/RightBar";

export const Home = () => {
  return (
    <div className="w-full h-auto mt-16 bg-gray-900 text-white flex flex-col overflow-hidden">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-4 md:p-6 pt-20 overflow-hidden">
        {/* Left Sidebar */}
        <div className="md:col-span-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-600">
          <MarketsSidebar />
        </div>

        {/* Center */}
        <div className="md:col-span-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-600">
          <TodayTips tips={tipsList as Tiptype[]} />
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-600">
          <YesterdayTips />
        </div>
      </div>
    </div>
  );
};
