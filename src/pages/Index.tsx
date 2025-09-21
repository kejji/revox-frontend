import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Rocket, Clock } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import revoxLogoDark from "@/assets/revox-logo-dark.svg";
import revoxLogoLight from "@/assets/revox-logo-light.svg";
const Index = () => {
  const {
    resolvedTheme
  } = useTheme();
  return <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/2 to-accent/3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.03),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.04),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,hsl(var(--primary)/0.02),transparent_70%)]" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent/30 rounded-full animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary/15 rounded-full animate-pulse [animation-delay:2s]" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            

            {/* Main Heading */}
            <div className="space-y-6 animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Revogate
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">is coming soon</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We fuse product vision and engineering to break silos, rethink rules and deliver revolutionary digital experiences.
              </p>
            </div>

            {/* Revox Pitch Section */}
            <div className="animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 space-y-8 max-w-3xl mx-auto">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center mb-2">
                    <img src={resolvedTheme === 'dark' ? revoxLogoDark : revoxLogoLight} alt="Revox Logo" className="h-16 w-auto" />
                  </div>
                  
                  <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-7xl mb-8 animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
                    Turn user feedback into{" "}
                    <span className="text-primary bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent animate-pulse">
                      actionable insights
                    </span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    Revox automatically extracts, analyzes, and monitors user feedback from app stores, helping 
                    Product Owners and teams make data-driven decisions that improve user satisfaction.
                  </p>
                </div>
                
                <div className="flex justify-center animate-fade-in [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
                  <Button asChild size="lg" variant="revox-gradient" className="text-lg px-8 py-6 hover-scale transition-all duration-300 group">
                    <Link to="/revox">
                      Explore Revox Now
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>


            {/* Footer Note */}
            <div className="animate-fade-in [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards]">
              <p className="text-sm text-muted-foreground/70">
                Stay tuned for something amazing. Revogate is coming soon.
              </p>
            </div>

          </div>
        </div>
      </div>
    </Layout>;
};
export default Index;