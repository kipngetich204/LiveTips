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
    <div className="w-full bg-surface-muted text-text-primary md:pt-0">
     <div className="max-w-7xl mx-auto">
        
        {/* Mobile Tabs - Fixed sticky position */}
        <div className="md:hidden sticky top-16 bg-surface-muted z-20 border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 min-h-11 py-4 px-4 font-medium transition-colors ${
                activeTab === 'today'
                  ? 'text-text-primary border-b-2 border-brand-black dark:border-brand-white bg-surface-raised'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Today's Tips
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`flex-1 min-h-11 py-4 px-4 font-medium transition-colors ${
                activeTab === 'markets'
                  ? 'text-text-primary border-b-2 border-brand-black dark:border-brand-white bg-surface-raised'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Markets
            </button>
            <button
              onClick={() => setActiveTab('yesterday')}
              className={`flex-1 min-h-11 py-4 px-4 font-medium transition-colors ${
                activeTab === 'yesterday'
                  ? 'text-text-primary border-b-2 border-brand-black dark:border-brand-white bg-surface-raised'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Yesterday
            </button>
          </div>
        </div>

        {/* Mobile Tab Content - Horizontally scrollable */}
        <div className="md:hidden overflow-x-auto overflow-y-hidden scrollbar-hide py-6">
          <div className="flex w-max">
            <div className={`w-screen px-4 shrink-0 ${activeTab !== 'today' ? 'hidden' : ''}`}>
              <Tips />
            </div>
            <div className={`w-screen px-4 shrink-0 ${activeTab !== 'markets' ? 'hidden' : ''}`}>
              <MarketsSidebar />
            </div>
            <div className={`w-screen px-4 shrink-0 ${activeTab !== 'yesterday' ? 'hidden' : ''}`}>
              <YesterdayTips />
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 px-6 py-8">
          
          {/* Left Sidebar - Markets */}
          <div className="md:col-span-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <MarketsSidebar />
          </div>

          {/* Center - Today's Tips */}
          <div className="md:col-span-8 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <Tips />
          </div>

          {/* Right Sidebar - Yesterday's Tips */}
          <div className="md:col-span-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <YesterdayTips />
          </div>
          
        </div>
      </div>
    </div>
  );
};