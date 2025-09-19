import { useState, useEffect, useRef } from "react";
import { Button } from "./button";

interface ResponsiveTextProps {
  text: string;
  maxLines?: number;
  onShowMore?: (text: string) => void;
  className?: string;
}

export function ResponsiveText({ 
  text, 
  maxLines = 1, 
  onShowMore,
  className = ""
}: ResponsiveTextProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!containerRef.current) return;
      
      const element = containerRef.current.querySelector('[data-text-content]') as HTMLElement;
      if (!element) return;
      
      // Check if content overflows by comparing scroll dimensions with client dimensions
      const isOverflowing = element.scrollHeight > element.clientHeight || 
                           element.scrollWidth > element.clientWidth;
      
      setIsTruncated(isOverflowing);
    };

    checkTruncation();
    
    const resizeObserver = new ResizeObserver(checkTruncation);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [text, maxLines]);

  const handleShowMore = () => {
    if (onShowMore) {
      onShowMore(text);
    }
  };

  return (
    <div ref={containerRef} className={className}>
      <div className="relative">
        <div
          data-text-content
          className="text-sm text-foreground leading-relaxed overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: maxLines,
            lineClamp: maxLines
          }}
        >
          {text}
          {isTruncated && onShowMore && (
            <span className="inline">
              {" "}
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium inline align-baseline"
                onClick={handleShowMore}
              >
                … Show more
              </Button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}