import { useEffect, useState } from 'react';

interface LogoProps { 
  size?: number; 
  logoText?: string; 
  color?: string;
  variant?: 'navbar' | 'loading' | 'standalone';
  className?: string;
} 

export function Logo({ 
  size = 120, 
  logoText = "LT", 
  color = "#6366F1",
  variant = 'standalone',
  className = '',
}: LogoProps) { 
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Responsive size calculation based on variant
  const getResponsiveSize = () => {
    if (variant === 'navbar') {
      // Fixed small size for navbar (responsive to screen size)
      return window.innerWidth < 640 ? 32 : 40; // 32px mobile, 40px desktop
    }
    if (variant === 'loading') {
      // Larger for loading screen
      return Math.min(size, dimensions.width * 0.3, dimensions.height * 0.3);
    }
    // Standalone - use provided size with constraints
    return Math.min(size, dimensions.width * 0.4, dimensions.height * 0.4);
  };

  const responsiveSize = dimensions.width > 0 ? getResponsiveSize() : size;
  const px = `${responsiveSize}px`;

  // Wrapper classes based on variant
  const wrapperClass = variant === 'loading' 
    ? 'flex items-center justify-center min-h-screen w-full bg-black'
    : variant === 'navbar'
    ? 'flex items-center justify-center'
    : 'flex items-center justify-center min-h-screen w-full';

  return ( 
    <div className={`${wrapperClass} ${className}`}> 
      <style>{` 
        @keyframes blink { 
          0%, 40% { opacity: 1; transform: scale(1); } 
          50% { opacity: 0.65; transform: scale(0.96); } 
          100% { opacity: 1; transform: scale(1); } 
        } 

        @keyframes borderPulse { 
          0% { box-shadow: 0 0 0 0 rgba(99,102,241, 0.45); } 
          50% { box-shadow: 0 0 20px 10px rgba(99,102,241, 0.12); } 
          100% { box-shadow: 0 0 0 0 rgba(99,102,241, 0); } 
        }
        
        .logo-blink { animation: blink 1.4s ease-in-out infinite; } 
        .logo-border-blink { animation: borderPulse 2s ease-in-out infinite; } 
      `}</style> 

      <div 
        className="relative rounded-full flex items-center justify-center" 
        style={{ width: px, height: px }} 
      > 
        {/* Soft pulsing outer border */} 
        <div 
          className="absolute rounded-full border-4 border-current border-opacity-80 logo-border-blink" 
          style={{ 
            inset: 0, 
            color, 
            pointerEvents: "none",
          }} 
        /> 

        {/* Inner circle + blinking content */} 
        <div 
          className="relative rounded-full flex items-center justify-center logo-blink" 
          style={{ 
            width: "85%", 
            height: "85%", 
            background: "white", 
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)", 
            borderRadius: "9999px",
          }} 
        > 
          <svg 
            width={responsiveSize * 0.5} 
            height={responsiveSize * 0.5} 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg" 
          > 
            <defs> 
              <linearGradient id={`grad-${variant}`} x1="0%" x2="100%" y1="0%" y2="100%"> 
                <stop offset="0%" stopColor={color} /> 
                <stop offset="100%" stopColor="#06B6D4" /> 
              </linearGradient> 
            </defs> 

            {/* Circle */} 
            <circle cx="50" cy="50" r="45" fill={`url(#grad-${variant})`} /> 

            {/* Text (auto-scaled) */} 
            <text 
              x="50" 
              y="57" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fontFamily="Inter, sans-serif" 
              fontWeight="700" 
              fontSize={logoText.length > 5 ? 30 : 40} 
              fill="white" 
            > 
              {logoText} 
            </text> 
          </svg> 
        </div> 
      </div> 
    </div> 
  ); 
}

// Demo showing all variants
export default function App() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setShowLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <Logo variant="loading" size={150} logoText="LT" color="#6366F1" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Example */}
      <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg fixed top-0 left-0 w-full z-50 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo variant="navbar" logoText="LT" color="#6366F1" />
            <span className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              LIVE TIPS
            </span>
          </div>
          <div className="text-sm text-gray-300">
            Navigation items here
          </div>
        </div>
      </nav>

      {/* Content with proper spacing */}
      <main className="pt-20 px-4">
        <div className="max-w-4xl mx-auto py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Logo Variants Demo
          </h1>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Navbar Logo (Small)</h2>
              <div className="bg-slate-900 p-4 rounded">
                <Logo variant="navbar" logoText="LT" color="#6366F1" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Usage: <code className="bg-gray-100 px-2 py-1 rounded">{'<Logo variant="navbar" />'}</code>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Loading Screen Logo (Large)</h2>
              <div className="bg-black rounded h-64 relative overflow-hidden">
                <Logo variant="loading" size={120} logoText="LT" color="#6366F1" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Usage: <code className="bg-gray-100 px-2 py-1 rounded">{'<Logo variant="loading" size={150} />'}</code>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Standalone Logo (Medium)</h2>
              <div className="h-64 relative">
                <Logo variant="standalone" size={100} logoText="LT" color="#6366F1" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Usage: <code className="bg-gray-100 px-2 py-1 rounded">{'<Logo variant="standalone" />'}</code>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}