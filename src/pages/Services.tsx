import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Compass, Layers, Users, BarChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Compass,
      title: t("productDiscovery"),
      description: t("productDiscoveryDesc"),
      features: [
        t("marketResearch"),
        t("userJourneyMapping"),
        t("productMarketFit"),
        t("strategicRoadmap"),
        t("stakeholderWorkshops")
      ],
      timeline: t("fourToEightWeeks")
    },
    {
      icon: Layers,
      title: t("productOwnership"),
      description: t("productOwnershipDesc"),
      features: [
        t("backlogManagement"),
        t("userStoryWriting"),
        t("sprintPlanning"),
        t("teamCoordination"),
        t("releasePlanning")
      ],
      timeline: t("ongoing")
    },
    {
      icon: Users,
      title: t("userFeedbackAnalysis"),
      description: t("userFeedbackAnalysisDesc"),
      features: [
        t("appStoreAnalysis"),
        t("userInterviews"),
        t("feedbackCategorization"),
        t("featureEvaluation"),
        t("satisfactionMetrics")
      ],
      timeline: t("twoToFourWeeks")
    },
    {
      icon: BarChart,
      title: t("mobileStrategy"),
      description: t("mobileStrategyDesc"),
      features: [
        t("mobileFirstDesign"),
        t("appStoreOptimization"),
        t("mobileAnalytics"),
        t("crossPlatformStrategy"),
        t("mobileUXPractices")
      ],
      timeline: t("threeToSixWeeks")
    }
  ];

  const workingMethods = [
    t("agileMethodologies"),
    t("designThinking"),
    t("leanStartup"),
    t("dataDriven"),
    t("continuousDiscovery"),
    t("remoteCollaboration")
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            {t("servicesHeroTitle")}
            <span className="text-primary"> {t("servicesHeroHighlight")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t("servicesHeroDescription")}
          </p>
        </div>

        {/* Services Grid */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <service.icon className="h-8 w-8 text-primary" />
                    <Badge variant="outline">{service.timeline}</Badge>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Working Methods */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("howIWork")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("howIWorkDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workingMethods.map((method, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{method}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">{t("myProcess")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: t("discovery"), description: t("discoveryDesc") },
              { step: "02", title: t("strategy"), description: t("strategyDesc") },
              { step: "03", title: t("execution"), description: t("executionDesc") },
              { step: "04", title: t("optimization"), description: t("optimizationDesc") }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t("readyToElevate")}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t("readyToElevateDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">
                {t("bookConsultation")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">{t("learnMoreAboutMe")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}