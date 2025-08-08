import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Target, Smartphone, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const expertise = [
    {
      icon: Target,
      title: t("productStrategy"),
      description: t("productStrategyDesc")
    },
    {
      icon: Users,
      title: t("userCentricDesign"),
      description: t("userCentricDesignDesc")
    },
    {
      icon: Smartphone,
      title: t("mobileExcellence"),
      description: t("mobileExcellenceDesc")
    },
    {
      icon: TrendingUp,
      title: t("dataDecisions"),
      description: t("dataDecisionsDesc")
    }
  ];

  const industries = [
    t("bankingFintech"),
    t("saasPlatforms"),
    t("ecommerce"),
    t("healthcareTech"),
    t("insurance"),
    t("telecommunications")
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            {t("aboutHeroTitle")}
            <span className="text-primary"> {t("aboutHeroHighlight")}</span> {t("aboutHeroTitle2")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t("aboutHeroDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/services">
                {t("viewMyServices")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">{t("getInTouch")}</Link>
            </Button>
          </div>
        </div>

        {/* Background */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t("background")}</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              {t("backgroundP1")}
            </p>
            <p>
              {t("backgroundP2")} <Link to="/revox" className="text-primary font-medium">{t("revox")}</Link>{t("backgroundP3")}
            </p>
          </div>
        </section>

        {/* Expertise */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t("coreExpertise")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map((item, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t("industriesIServe")}</h2>
          <p className="text-lg text-muted-foreground mb-6">
            {t("industriesDescription")}
          </p>
          <div className="flex flex-wrap gap-3">
            {industries.map((industry, index) => (
              <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
                {industry}
              </Badge>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t("readyToWork")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("readyToWorkDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">{t("startConversation")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/blog">{t("readMyInsights")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}