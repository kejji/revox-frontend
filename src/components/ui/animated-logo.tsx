import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface AnimatedLogoProps {
  showAnimation?: boolean;
  className?: string;
}

export function AnimatedLogo({ showAnimation = false, className = "" }: AnimatedLogoProps) {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (showAnimation && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [showAnimation, hasAnimated]);

  return (
    <Link 
      to="/" 
      className={`inline-block ${className}`}
    >
      <span 
        className={`
          text-xl font-bold text-foreground transition-all duration-300
          ${showAnimation ? 'animate-logo-appear opacity-0' : 'opacity-100'}
          ${hasAnimated ? 'animate-logo-float' : ''}
          hover:text-primary
        `}
      >
        Revogate
      </span>
    </Link>
  );
}