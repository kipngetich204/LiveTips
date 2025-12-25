import {  useState } from 'react';
import { MarketsSidebar } from "../Home/LeftBar";
//import { TodayTips } from "../Home/CenterBar";
import { YesterdayTips } from "../Home/RightBar";
//import { getTips } from "../pages/Tips";
//import type { Tiptype } from "../Home/RightBar";
import { Tips } from '../pages/Tips/Tips';

export const Home = () => {
  const [activeTab, setActiveTab] = useState('today');
/*     const [tipsList, setTipsList] = useState<Tiptype[]>([]);
    // Fetch tips on component mount
    useEffect(() => {
      const fetchTips = async () => {
        const tips = await getTips();
        setTipsList(tips);
      };
      fetchTips();
    }, []); */

  return (
    <div className="w-full bg-gray-900 text-white md:pt-0">
     <div className="max-w-7xl mx-auto">
        
        {/* Mobile Tabs - Fixed sticky position */}
        <div className="md:hidden sticky top-16 bg-gray-900 z-20 border-b border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 py-4 px-4 font-medium transition-colors ${
                activeTab === 'today'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Today's Tips
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`flex-1 py-4 px-4 font-medium transition-colors ${
                activeTab === 'markets'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Markets
            </button>
            <button
              onClick={() => setActiveTab('yesterday')}
              className={`flex-1 py-4 px-4 font-medium transition-colors ${
                activeTab === 'yesterday'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-800'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Yesterday
            </button>
          </div>
        </div>

        {/* Mobile Tab Content - Horizontally scrollable */}
        <div className="md:hidden overflow-x-auto overflow-y-hidden scrollbar-hide py-6">
          <div className="flex w-max">
            <div className={`w-screen px-4 flex-shrink-0 ${activeTab !== 'today' ? 'hidden' : ''}`}>
              <Tips />
            </div>
            <div className={`w-screen px-4 flex-shrink-0 ${activeTab !== 'markets' ? 'hidden' : ''}`}>
              <MarketsSidebar />
            </div>
            <div className={`w-screen px-4 flex-shrink-0 ${activeTab !== 'yesterday' ? 'hidden' : ''}`}>
              <YesterdayTips />
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 px-6 py-8">
          
          {/* Left Sidebar - Markets */}
          <div className="md:col-span-2 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-600">
            <MarketsSidebar />
          </div>

          {/* Center - Today's Tips */}
          <div className="md:col-span-8 overflow-y-auto max-h-[calc(100vh-8rem)]  scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-600">
            <Tips />
          </div>

          {/* Right Sidebar - Yesterday's Tips */}
          <div className="md:col-span-2 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-600">
            <YesterdayTips />
          </div>
          
        </div>
      </div>
    </div>
  );
};