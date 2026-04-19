import { useState, useEffect } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader = ({ onComplete }: LoaderProps) => {
  const [phase, setPhase] = useState<'d' | 'roof' | 'wello' | 'done'>('d');

  useEffect(() => {
    // Phase 1: Show D
    const timer1 = setTimeout(() => setPhase('roof'), 500);
    
    // Phase 2: Add roof to D
    const timer2 = setTimeout(() => setPhase('wello'), 1200);
    
    // Phase 3: Show "wello"
    const timer3 = setTimeout(() => setPhase('done'), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    if (phase === 'done') {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-[9999]">
      <div className="flex items-center justify-center">
        {/* D letter with animated roof */}
        <div className="relative">
          {/* The D */}
          <span 
            className={`
              text-6xl md:text-8xl font-bold text-slate-800 inline-block
              transition-all duration-700 ease-out
              ${phase === 'd' ? 'opacity-30 scale-90' : ''}
              ${phase === 'roof' ? 'opacity-60 scale-95' : ''}
              ${phase === 'wello' ? 'opacity-100 scale-100' : ''}
              ${phase === 'done' ? 'opacity-100 scale-100' : ''}
            `}
          >
            D
          </span>
          
          {/* The Roof - appears above D */}
          <div 
            className={`
              absolute -top-2 left-1/2 -translate-x-1/2
              transition-all duration-700 ease-out
              ${phase === 'd' ? 'opacity-0 -translate-y-4 scale-50' : ''}
              ${phase === 'roof' ? 'opacity-100 translate-y-0 scale-100' : ''}
              ${phase === 'wello' ? 'opacity-100 translate-y-0 scale-100' : ''}
              ${phase === 'done' ? 'opacity-100 translate-y-0 scale-100' : ''}
            `}
          >
            <svg width="60" height="35" viewBox="0 0 60 35" className="md:w-[70px] md:h-[40px]">
              <path 
                d="M30 0 L60 35 L0 35 Z" 
                fill="#2563eb"
                className="drop-shadow-lg"
              />
            </svg>
          </div>
        </div>

        {/* "wello" text - fades in after roof */}
        <div 
          className={`
            ml-2 overflow-hidden
            transition-all duration-700 ease-out
            ${phase === 'd' ? 'w-0 opacity-0' : ''}
            ${phase === 'roof' ? 'w-0 opacity-0' : ''}
            ${phase === 'wello' ? 'w-32 opacity-100' : ''}
            ${phase === 'done' ? 'w-32 opacity-100' : ''}
          `}
        >
          <span className="text-4xl md:text-6xl font-bold text-blue-600 whitespace-nowrap">
            wello
          </span>
        </div>
      </div>

      {/* Loading dots */}
      {phase === 'wello' && (
        <div className="absolute bottom-20 flex gap-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
};

// Wrapper component that manages loading state
export const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return <Loader onComplete={() => setShowLoader(false)} />;
  }

  return <>{children}</>;
};
