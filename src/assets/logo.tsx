interface BlinkingLogoProps { 
  size?: number; 
  logoText?: string; 
  color?: string; 
} 

export function Logo({ 
  size = 120, 
  logoText = "LT", 
  color = "#6366F1", 
}: BlinkingLogoProps) { 
  // Responsive size calculation
  const responsiveSize = typeof window !== 'undefined' 
    ? Math.min(size, window.innerWidth * 0.4, window.innerHeight * 0.4)
    : size;
  const px = `${responsiveSize}px`; 

  return ( 
    <div className="flex items-center justify-center min-h-screen w-full"> 
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
        body, #root { 
          background-color: black; 
          margin: 0;
          padding: 0;
        } 
        .blink { animation: blink 1.4s ease-in-out infinite; } 
        .border-blink { animation: borderPulse 2s ease-in-out infinite; } 
      `}</style> 

      <div 
        className="relative rounded-full flex items-center justify-center" 
        style={{ width: px, height: px }} 
      > 
        {/* Soft pulsing outer border */} 
        <div 
          className="absolute rounded-full border-4 border-current border-opacity-80 border-blink" 
          style={{ 
            inset: 0, 
            color, 
            pointerEvents: "none", 
          }} 
        /> 

        {/* Inner circle + blinking content */} 
        <div 
          className="relative rounded-full flex items-center justify-center blink" 
          style={{ 
            width: "85%", 
            height: "85%", 
            background: "white", 
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)", 
            borderRadius: "9999px", 
          }} 
        > 
          <svg 
            width={size * 0.5} 
            height={size * 0.5} 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg" 
          > 
            <defs> 
              <linearGradient id="grad" x1="0%" x2="100%" y1="0%" y2="100%"> 
                <stop offset="0%" stopColor={color} /> 
                <stop offset="100%" stopColor="#06B6D4" /> 
              </linearGradient> 
            </defs> 

            {/* Circle */} 
            <circle cx="50" cy="50" r="45" fill="url(#grad)" /> 

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

export default function App() {
  return <Logo size={120} logoText="LT" color="#6366F1" />;
}