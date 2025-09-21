import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Star, BarChart, Users, Shield, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/theme-provider";
import revoxLogoDark from "@/assets/revox-logo-dark.svg";
import revoxLogoLight from "@/assets/revox-logo-light.svg";
export default function Revox() {
  const {
    t
  } = useLanguage();
  const {
    resolvedTheme
  } = useTheme();
  const features = [{
    icon: Zap,
    title: t("automatedCollection"),
    description: t("automatedCollectionDesc")
  }, {
    icon: BarChart,
    title: t("smartAnalysis"),
    description: t("smartAnalysisDesc")
  }, {
    icon: Users,
    title: t("revoxTeamCollaboration"),
    description: t("revoxTeamCollaborationDesc")
  }, {
    icon: Shield,
    title: t("revoxEnterpriseReady"),
    description: "GDPR compliant, secure data handling designed for regulated industries"
  }];
  const benefits = ["Save 10+ hours per week on manual feedback analysis", "Identify product issues 5x faster than manual processes", "Make data-driven prioritization decisions", "Improve user satisfaction through faster response times", "Scale feedback analysis beyond human capacity", "Generate actionable insights for stakeholders"];
  return <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            <img src={resolvedTheme === 'dark' ? revoxLogoDark : revoxLogoLight} alt="Revox Logo" className="h-32 w-auto mx-auto hover-scale transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-7xl mb-8 animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            {t("revoxHeroTitle")}
            <span className="text-primary bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent animate-pulse"> {t("revoxHeroHighlight")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-10 animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
            {t("revoxHeroDescription")}
          </p>
          <div className="flex justify-center mb-12 animate-fade-in [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
            <Button asChild size="lg" variant="revox-gradient" className="text-lg px-8 py-6 hover-scale transition-all duration-300">
              <Link to="/revox/login">
                {t("revoxStartFreeTrial")} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards]">
            <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300 cursor-default">
              <Shield className="h-4 w-4 text-revox-blue" />
              {t("revoxGdprCompliant")}
            </div>
            <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300 cursor-default">
              <Star className="h-4 w-4 text-revox-purple" />
              {t("revoxEnterpriseReady")}
            </div>
            <div className="flex items-center gap-2 hover:text-foreground transition-colors duration-300 cursor-default">
              <CheckCircle className="h-4 w-4 text-revox-orange" />
              {t("noSetupRequired")}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section className="mb-20">
          <div className="text-center mb-12 animate-fade-in [animation-delay:1000ms] opacity-0 [animation-fill-mode:forwards]">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("everythingNeeded")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("everythingNeededDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} className="text-center border-2 hover:border-revox-blue/50 transition-all duration-300 hover-scale hover:shadow-lg hover:shadow-revox-blue/10 bg-card/50 backdrop-blur-sm animate-fade-in opacity-0 [animation-fill-mode:forwards]" style={{
            animationDelay: `${1200 + index * 100}ms`
          }}>
                <CardHeader>
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 ${index === 0 ? 'text-revox-blue' : index === 1 ? 'text-revox-purple' : index === 2 ? 'text-revox-orange' : 'text-revox-dark-blue'}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </section>

        {/* Copyright */}
        
      </div>
    </Layout>;
}