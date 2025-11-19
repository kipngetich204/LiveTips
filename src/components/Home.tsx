import {  useState } from 'react';
import { MarketsSidebar } from "../Home/LeftBar";
//import { TodayTips } from "../Home/CenterBar";
import { YesterdayTips } from "../Home/RightBar";
//import { getTips } from "../pages/Tips";
//import type { Tiptype } from "../Home/RightBar";
import { Tips } from '../pages/Tips';

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
    <div className="w-full min-h-screen mt-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Mobile Tabs - Hidden on desktop */}
        <div className="md:hidden  top-16 bg-gray-900 z-10 border-b border-gray-700">
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

        {/* Mobile Tab Content */}
        <div className="md:hidden px-4 py-6">
          {activeTab === 'today' && <Tips />}
          {activeTab === 'markets' && <MarketsSidebar />}
          {activeTab === 'yesterday' && <YesterdayTips />}
        </div>

        {/* Desktop Grid Layout - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 px-6 py-8">
          
          {/* Left Sidebar - Markets */}
          <div className="md:col-span-2 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-600">
            <MarketsSidebar />
          </div>

          {/* Center - Today's Tips */}
          <div className="md:col-span-8 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-600">
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