import { useTheme } from "@/components/theme-provider";
import revoxLogoDark from "@/assets/revox-logo-dark.svg";
import revoxLogoLight from "@/assets/revox-logo-light.svg";

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({ className = "h-32 w-auto mx-auto" }: AnimatedLogoProps) {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="revox-logo-animated">
      <img 
        src={resolvedTheme === 'dark' ? revoxLogoDark : revoxLogoLight} 
        alt="Revox Logo" 
        className={`revox-logo-wave ${className}`}
      />
    </div>
  );
}