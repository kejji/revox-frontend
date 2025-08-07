import { useState, useEffect } from "react";

export function HeroLogo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="flex items-center justify-center h-full">
        <div 
          className={`
            text-6xl md:text-8xl lg:text-9xl font-bold text-foreground
            transition-all duration-1000 ease-out
            ${isVisible 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-50 transform translate-y-8'
            }
          `}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '800',
            letterSpacing: '-0.02em'
          }}
        >
          Revogate
        </div>
      </div>
    </div>
  );
}