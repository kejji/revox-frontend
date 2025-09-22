import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Rocket, Clock } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import revoxLogoDark from "@/assets/revox-logo-dark.svg";
import revoxLogoLight from "@/assets/revox-logo-light.svg";
import revogateLogoDark from "@/assets/revogate-expanded-logo-dark.svg";
import revogateLogoLight from "@/assets/revogate-expanded-logo-light.svg";
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


        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            

            {/* Main Heading */}
            <div className="space-y-6 animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards] mt-12">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <div className="flex items-center justify-center mb-2 relative">
                  <div className="relative h-24 md:h-32 flex items-center justify-center">
                    <img src={resolvedTheme === 'dark' ? revogateLogoDark : revogateLogoLight} alt="Revogate Logo" className="h-full w-auto transition-opacity duration-300 ease-in-out" />
                  </div>
                </div>
                
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We fuse product vision and engineering to break silos, rethink rules and deliver revolutionary digital experiences.
              </p>
            </div>

            {/* Revogate Products Section */}
            <div className="animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
                <div className="text-center space-y-4 mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Our <span className="text-primary">Products</span>
                  </h2>
                  
                </div>

                {/* Revox Product Card */}
                <div className="bg-card/30 border border-border/30 rounded-xl p-6 space-y-4">
                  <div className="text-center space-y-4">
                    
                    <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      Turn user feedback into{" "}
                      <span className="text-primary bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        actionable insights
                      </span>
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
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
            </div>


            {/* Footer Note */}
            <div className="animate-fade-in [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards]">
              
            </div>

          </div>
        </div>
      </div>
    </Layout>;
};
export default Index;