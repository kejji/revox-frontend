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
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const features = [
    {
      icon: Zap,
      title: t("automatedCollection"),
      description: t("automatedCollectionDesc")
    },
    {
      icon: BarChart,
      title: t("smartAnalysis"),
      description: t("smartAnalysisDesc")
    },
    {
      icon: Users,
      title: t("revoxTeamCollaboration"),
      description: t("revoxTeamCollaborationDesc")
    },
    {
      icon: Shield,
      title: t("revoxEnterpriseReady"),
      description: "GDPR compliant, secure data handling designed for regulated industries"
    }
  ];

  const benefits = [
    "Save 10+ hours per week on manual feedback analysis",
    "Identify product issues 5x faster than manual processes",
    "Make data-driven prioritization decisions",
    "Improve user satisfaction through faster response times",
    "Scale feedback analysis beyond human capacity",
    "Generate actionable insights for stakeholders"
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={resolvedTheme === 'dark' ? revoxLogoDark : revoxLogoLight} 
              alt="Revox Logo" 
              className="h-32 w-auto mx-auto"
            />
          </div>
          <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {t("revoxHeroSubtitle")}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-7xl mb-8">
            {t("revoxHeroTitle")}
            <span className="text-primary"> {t("revoxHeroHighlight")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-10">
            {t("revoxHeroDescription")}
          </p>
          <div className="flex justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/revox/auth">
                {t("revoxStartFreeTrial")} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("revoxGdprCompliant")}
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              {t("revoxEnterpriseReady")}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {t("noSetupRequired")}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("everythingNeeded")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("everythingNeededDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t("whyChooseRevox")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("whyChooseRevoxDesc")}
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10x</div>
                <div className="text-lg font-medium text-foreground mb-4">{t("fasterAnalysis")}</div>
                <p className="text-sm text-muted-foreground">
                  {t("fasterAnalysisDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Use Cases CTA */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">{t("productTeams")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("productTeamsDesc")}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/revox/use-cases#product-teams">{t("learnMore")}</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:border-primary/50 transition-colors">
              <CardHeader>
                <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">{t("marketingTeams")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("marketingTeamsDesc")}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/revox/use-cases#marketing-teams">{t("learnMore")}</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">{t("strategyLeaders")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("strategyLeadersDesc")}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/revox/use-cases#strategy-leaders">{t("learnMore")}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("readyToTransform")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("readyToTransformDesc")}
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/contact">
                {t("revoxStartFreeTrial")} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}