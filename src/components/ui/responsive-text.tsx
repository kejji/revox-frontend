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
  const textRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!textRef.current || !hiddenRef.current) return;
      
      const visibleElement = textRef.current;
      const hiddenElement = hiddenRef.current;
      
      // Compare the scroll width of the truncated vs full text
      setIsTruncated(hiddenElement.scrollWidth > visibleElement.clientWidth || 
                     hiddenElement.scrollHeight > visibleElement.clientHeight);
    };

    checkTruncation();
    
    const resizeObserver = new ResizeObserver(checkTruncation);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [text, maxLines]);

  const handleShowMore = () => {
    if (onShowMore) {
      onShowMore(text);
    }
  };

  return (
    <div className={className}>
      {/* Visible truncated text */}
      <div className="flex items-start gap-2">
        <div
          ref={textRef}
          className="text-sm text-foreground leading-relaxed flex-1 overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: maxLines,
            lineClamp: maxLines
          }}
        >
          {text}
        </div>
        
        {isTruncated && onShowMore && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium flex-shrink-0 self-start"
            onClick={handleShowMore}
          >
            … Show more
          </Button>
        )}
      </div>
      
      {/* Hidden element to measure full text dimensions */}
      <div
        ref={hiddenRef}
        className="text-sm leading-relaxed absolute opacity-0 pointer-events-none whitespace-nowrap overflow-visible"
        style={{ top: '-9999px', left: '-9999px' }}
        aria-hidden="true"
      >
        {text}
      </div>
    </div>
  );
}