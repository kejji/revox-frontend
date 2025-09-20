import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, BarChart, Users, Shield, Zap, TrendingUp, Clock, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import revoxLogoDark from "@/assets/revox-logo-dark.svg";
import revoxLogoLight from "@/assets/revox-logo-light.svg";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span id={`counter-${end}`}>{count}{suffix}</span>;
};

export default function Revox() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();

  const benefits = [
    { icon: Clock, text: "10x faster analysis" },
    { icon: TrendingUp, text: "5x issue detection" },
    { icon: Award, text: "Enterprise ready" }
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "AI processes feedback in real-time"
    },
    {
      icon: BarChart,
      title: "Smart Insights",
      description: "Actionable data from user feedback"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "GDPR ready, enterprise-grade security"
    }
  ];

  return (
    <Layout>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Floating Logo */}
            <div className="mb-12 animate-fade-in">
              <img 
                src={resolvedTheme === 'dark' ? revoxLogoDark : revoxLogoLight} 
                alt="Revox Logo" 
                className="h-24 w-auto mx-auto animate-float"
              />
            </div>

            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in delay-200">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Transform
                <span className="text-primary animate-pulse"> Feedback</span>
                <br />into Growth
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                AI-powered feedback analysis that turns user insights into actionable product decisions
              </p>

              {/* Animated CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                <Button 
                  asChild 
                  size="lg" 
                  className="text-lg px-8 py-6 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Link to="/revox/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300"
                >
                  <Link to="/revox/demo">
                    Watch Demo
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Shield className="h-4 w-4" />
                  GDPR Compliant
                </div>
                <div className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Star className="h-4 w-4" />
                  Enterprise Ready
                </div>
                <div className="flex items-center gap-2 hover:text-primary transition-colors">
                  <CheckCircle className="h-4 w-4" />
                  No Setup Required
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter end={10} suffix="x" />
                </div>
                <div className="text-lg font-medium">Faster Analysis</div>
                <div className="text-sm text-muted-foreground">vs manual processes</div>
              </div>
              
              <div className="text-center group">
                <div className="text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <div className="text-lg font-medium">Companies Trust Us</div>
                <div className="text-sm text-muted-foreground">across industries</div>
              </div>
              
              <div className="text-center group">
                <div className="text-5xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <div className="text-lg font-medium">Accuracy Rate</div>
                <div className="text-sm text-muted-foreground">in feedback categorization</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-16 animate-fade-in">
              Why Teams Choose Revox
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="group animate-fade-in hover-scale cursor-pointer"
                  style={{animationDelay: `${index * 200}ms`}}
                >
                  <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                      <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-xl font-semibold mb-2">{benefit.text}</h3>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-muted-foreground">
                Powerful features designed for modern product teams
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="group hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
                  style={{animationDelay: `${index * 300}ms`}}
                >
                  <CardContent className="p-8">
                    <feature.icon className="h-16 w-16 text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Trusted by Leading Teams
            </h2>
            
            <Card className="p-8 hover:shadow-lg transition-all duration-300">
              <blockquote className="text-2xl font-medium mb-6 italic">
                "Revox identified critical issues we completely missed. Game-changer for our product team."
              </blockquote>
              <div className="text-lg">
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-muted-foreground">Product Manager, TechCorp</div>
              </div>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-bold">
                Ready to Transform Your
                <span className="text-primary"> Product Strategy?</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join 500+ teams already using Revox to make data-driven decisions
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                <Button 
                  asChild 
                  size="lg" 
                  className="text-xl px-12 py-8 group hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/25 animate-pulse"
                >
                  <Link to="/revox/signup">
                    Start Free Trial Now
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="text-xl px-12 py-8 hover:scale-105 transition-all duration-300"
                >
                  <Link to="/revox/contact">
                    Talk to Sales
                  </Link>
                </Button>
              </div>

              {/* Urgency Element */}
              <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  🔥 Limited Time: Get 3 months free on annual plans
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}