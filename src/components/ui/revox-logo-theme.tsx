import { useTheme } from "@/components/theme-provider";

export function RevoxLogoTheme({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  
  // Determine if we should use dark mode colors
  const isDark = theme === "dark" || 
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className={`transition-all duration-300 ${className}`}>
      <svg 
        version="1.1" 
        id="Layer_1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        x="0px" 
        y="0px"
        width="100%" 
        viewBox="0 0 1024 1024" 
        enableBackground="new 0 0 1024 1024" 
        xmlSpace="preserve"
        className="w-full h-full transition-all duration-300"
      >
        {/* Main background - adapts to theme */}
        <path 
          fill={isDark ? "#1a1a1a" : "#F6F7F7"} 
          opacity="1.000000" 
          stroke="none" 
          d="M589.000000,1025.000000 C392.666656,1025.000000 196.833328,1025.000000 1.000000,1025.000000 C1.000000,683.666687 1.000000,342.333344 1.000000,1.000000 C342.333344,1.000000 683.666687,1.000000 1025.000000,1.000000 C1025.000000,342.333344 1025.000000,683.666687 1025.000000,1025.000000 C879.833313,1025.000000 734.666687,1025.000000 589.000000,1025.000000z"
          className="transition-all duration-300"
        />
        
        {/* Letter shapes - adapt to theme */}
        <path 
          fill={isDark ? "#ffffff" : "#1F2937"} 
          opacity="1.000000" 
          stroke="none" 
          d="M275.590393,522.972351 C275.688202,522.656555 275.786041,522.340759 276.057983,521.564819 C276.057983,521.564819 276.196289,521.092651 276.812805,520.806152 C279.650909,517.020325 282.322632,513.094910 285.359192,509.475555 C293.534637,499.730927 303.745911,492.838135 315.419495,487.800415 C324.306824,483.965118 328.603271,475.979095 327.821838,466.473907 C327.239502,459.390533 324.352570,456.613861 317.234467,456.851898 C300.858734,457.399567 286.494110,463.700134 273.534821,473.208984 C250.585739,490.047668 237.727173,513.964966 227.775024,539.869019z"
          className="transition-all duration-300"
        />
        
        {/* Add more key paths with theme-aware colors */}
        <path 
          fill={isDark ? "#3B82F6" : "#2563EB"} 
          opacity="1.000000" 
          stroke="none" 
          d="M420.000000,350.000000 L420.000000,680.000000 L470.000000,680.000000 L470.000000,550.000000 L550.000000,550.000000 C580.000000,550.000000 600.000000,530.000000 600.000000,500.000000 L600.000000,400.000000 C600.000000,370.000000 580.000000,350.000000 550.000000,350.000000 L420.000000,350.000000z M470.000000,400.000000 L550.000000,400.000000 L550.000000,500.000000 L470.000000,500.000000 L470.000000,400.000000z"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
}