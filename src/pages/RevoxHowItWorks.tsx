import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Brain, Target, Settings, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RevoxHowItWorks() {
  const { t } = useLanguage();
  const steps = [
    {
      step: "01",
      icon: Settings,
      title: t("connectYourApp"),
      description: t("connectYourAppDesc"),
      details: [
        "Support for both iOS and Android apps",
        "Instant connection in under 2 minutes",
        "No technical setup required",
        "Secure data handling"
      ]
    },
    {
      step: "02",
      icon: Download,
      title: t("automaticCollection"),
      description: t("automaticCollectionDesc"),
      details: [
        "Historical data going back 2+ years",
        "Real-time monitoring for new reviews",
        "Multi-language support",
        "Duplicate detection and filtering"
      ]
    },
    {
      step: "03",
      icon: Brain,
      title: t("aiPoweredAnalysis"),
      description: t("aiPoweredAnalysisDesc"),
      details: [
        "Sentiment analysis and emotion detection",
        "Automatic categorization by feature/issue",
        "Bug vs feature request identification",
        "Trend analysis over time"
      ]
    },
    {
      step: "04",
      icon: Target,
      title: t("actionableInsights"),
      description: "Get clear, prioritized recommendations with impact analysis to guide your product decisions.",
      details: [
        "Priority scoring based on frequency and impact",
        "Actionable recommendations for product teams",
        "Export capabilities for stakeholder reports",
        "Integration with popular project management tools"
      ]
    }
  ];

  const benefits = [
    {
      title: "10x Faster",
      description: "Analyze thousands of reviews in minutes instead of hours"
    },
    {
      title: "5x More Accurate",
      description: "AI-powered categorization reduces human bias and errors"
    },
    {
      title: "100% Coverage",
      description: "Never miss important feedback hidden in your app reviews"
    },
    {
      title: "Real-time",
      description: "Get alerts when new issues or trends emerge"
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {t("howRevoxWorks")}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            {t("fromReviewsToInsights")}
            <span className="text-primary"> {t("actionableInsights")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t("howRevoxWorksDesc")}
          </p>
        </div>

        {/* Process Steps */}
        <section className="mb-20">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5">
                    <CardContent className="p-8 text-center">
                      <step.icon className="h-16 w-16 text-primary mx-auto mb-4" />
                      <div className="text-lg font-medium text-foreground">Step {step.step}</div>
                      <div className="text-2xl font-bold text-primary">{step.title}</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("theRevoxAdvantage")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("revoxAdvantageDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("builtForProductTeams")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("builtForProductTeamsDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("securityCompliance")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">SOC 2 Type II</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Data encryption at rest</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Regular security audits</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("integrations")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Slack notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Jira integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Email reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">API access</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("support")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">24/7 support for Enterprise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Dedicated success manager</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Custom training sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Implementation support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("readyToSeeRevox")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("readyToSeeRevoxDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/contact">
                {t("revoxStartFreeTrial")} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/revox/use-cases">{t("viewUseCases")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}