import { useState, useEffect, useRef } from "react";
import { Button } from "./button";

interface ResponsiveTextProps {
  text: string;
  maxLinesDesktop?: number;
  maxLinesMobile?: number;
  onShowMore?: (text: string) => void;
  className?: string;
}

export function ResponsiveText({ 
  text, 
  maxLinesDesktop = 3, 
  maxLinesMobile = 2, 
  onShowMore,
  className = ""
}: ResponsiveTextProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!textRef.current) return;
      
      const element = textRef.current;
      const isDesktopView = window.innerWidth >= 768;
      setIsDesktop(isDesktopView);
      
      // Temporarily remove line clamp to measure full height
      element.style.webkitLineClamp = 'none';
      element.style.overflow = 'visible';
      
      const fullHeight = element.scrollHeight;
      
      // Restore line clamp
      const maxLines = isDesktopView ? maxLinesDesktop : maxLinesMobile;
      element.style.webkitLineClamp = maxLines.toString();
      element.style.overflow = 'hidden';
      
      const clampedHeight = element.scrollHeight;
      setIsTruncated(fullHeight > clampedHeight);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    
    return () => window.removeEventListener('resize', checkTruncation);
  }, [text, maxLinesDesktop, maxLinesMobile]);

  const handleShowMore = () => {
    if (onShowMore) {
      onShowMore(text);
    }
  };

  const maxLines = isDesktop ? maxLinesDesktop : maxLinesMobile;

  return (
    <div className={`space-y-2 ${className}`}>
      <p
        ref={textRef}
        className="text-sm text-foreground leading-relaxed overflow-hidden"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: maxLines,
        }}
      >
        {text}
      </p>
      
      {isTruncated && onShowMore && (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
          onClick={handleShowMore}
        >
          … Show more
        </Button>
      )}
    </div>
  );
}