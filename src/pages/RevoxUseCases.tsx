import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowRight, Users, BarChart, TrendingUp, CheckCircle, Target, MessageSquare, Lightbulb } from "lucide-react";

export default function RevoxUseCases() {
  const productTeamUseCases = [
    {
      title: "Bug Detection & Prioritization",
      description: "Automatically identify and prioritize bugs mentioned in user reviews",
      example: "Detected 87 users reporting login issues across 200+ reviews, flagged as critical priority",
      impact: "50% faster bug identification"
    },
    {
      title: "Feature Request Analysis",
      description: "Understand which features users want most and quantify demand",
      example: "Identified dark mode requests from 156 users, leading to successful feature implementation",
      impact: "Data-driven roadmap planning"
    },
    {
      title: "User Experience Insights",
      description: "Spot UX pain points and usability issues before they impact retention",
      example: "Found navigation confusion mentioned in 45% of 1-star reviews, guided UX redesign",
      impact: "30% improvement in user satisfaction"
    }
  ];

  const marketingTeamUseCases = [
    {
      title: "Brand Sentiment Monitoring",
      description: "Track how users feel about your brand and product over time",
      example: "Monitored sentiment decline after UI update, enabling quick response strategy",
      impact: "Proactive reputation management"
    },
    {
      title: "Competitive Intelligence",
      description: "Understand what users say about competitors vs your product",
      example: "Identified competitor weakness in customer support, created targeted campaign",
      impact: "20% increase in conversion rates"
    },
    {
      title: "Product Messaging Optimization",
      description: "Use real user language to improve marketing copy and positioning",
      example: "User reviews highlighted 'simplicity' value prop, updated website messaging",
      impact: "15% improvement in landing page conversion"
    }
  ];

  const strategyTeamUseCases = [
    {
      title: "Market Validation",
      description: "Validate product-market fit and identify expansion opportunities",
      example: "Reviews showed strong demand for B2B features, validated enterprise strategy",
      impact: "Informed $2M product investment decision"
    },
    {
      title: "Risk Assessment",
      description: "Early warning system for product and business risks",
      example: "Detected increasing complaints about pricing, prevented churn spike",
      impact: "Reduced customer churn by 25%"
    },
    {
      title: "Innovation Opportunities",
      description: "Identify whitespace and unmet needs in the market",
      example: "Discovered integration requests pointing to new product category",
      impact: "New revenue stream identified"
    }
  ];

  const industryExamples = [
    {
      industry: "Banking & Fintech",
      challenge: "Regulatory compliance while maintaining user satisfaction",
      solution: "Track security concerns and compliance-related feedback to balance regulations with UX",
      result: "40% reduction in security-related complaints"
    },
    {
      industry: "E-commerce",
      challenge: "Managing feedback across multiple product categories",
      solution: "Categorize feedback by product type and identify cross-category trends",
      result: "20% improvement in overall product ratings"
    },
    {
      industry: "Healthcare Tech",
      challenge: "Ensuring patient safety while innovating features",
      solution: "Monitor safety-related feedback and prioritize critical health issues",
      result: "Zero safety incidents reported in reviews"
    },
    {
      industry: "SaaS Platforms",
      challenge: "Rapid feature development with limited resources",
      solution: "Data-driven prioritization based on user demand and business impact",
      result: "50% increase in feature adoption rates"
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Use Cases & Success Stories
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            How teams use Revox to
            <span className="text-primary"> drive results</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From product prioritization to strategic planning, see how different teams leverage Revox to make better decisions with user feedback.
          </p>
        </div>

        {/* Team-Based Use Cases */}
        <section className="mb-20">
          <Tabs defaultValue="product" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="product" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Product Teams
              </TabsTrigger>
              <TabsTrigger value="marketing" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Marketing Teams
              </TabsTrigger>
              <TabsTrigger value="strategy" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Strategy Leaders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="product" id="product-teams">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Product Teams</h2>
                <p className="text-lg text-muted-foreground">
                  Product Owners and Managers use Revox to make data-driven decisions about features, bugs, and user experience improvements.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productTeamUseCases.map((useCase, index) => (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <Target className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">{useCase.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Example
                          </p>
                          <p className="text-sm text-foreground italic">"{useCase.example}"</p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-xs">
                            {useCase.impact}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="marketing" id="marketing-teams">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Marketing Teams</h2>
                <p className="text-lg text-muted-foreground">
                  Marketing professionals use Revox to understand brand sentiment, competitive positioning, and optimize messaging.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketingTeamUseCases.map((useCase, index) => (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <MessageSquare className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">{useCase.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Example
                          </p>
                          <p className="text-sm text-foreground italic">"{useCase.example}"</p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-xs">
                            {useCase.impact}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="strategy" id="strategy-leaders">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Strategy Leaders</h2>
                <p className="text-lg text-muted-foreground">
                  C-level executives and strategy teams use Revox for market intelligence, risk assessment, and innovation opportunities.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategyTeamUseCases.map((useCase, index) => (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <Lightbulb className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">{useCase.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Example
                          </p>
                          <p className="text-sm text-foreground italic">"{useCase.example}"</p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-xs">
                            {useCase.impact}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Industry Examples */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Industry Success Stories
            </h2>
            <p className="text-lg text-muted-foreground">
              See how Revox delivers value across different industries and regulatory environments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industryExamples.map((example, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{example.industry}</Badge>
                  <CardTitle className="text-lg">Challenge</CardTitle>
                  <p className="text-sm text-muted-foreground">{example.challenge}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Solution</h4>
                      <p className="text-sm text-muted-foreground">{example.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Result</h4>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{example.result}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="mb-20">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Calculate Your ROI</CardTitle>
              <p className="text-muted-foreground">
                See how much time and money Revox can save your team
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">Hours saved per week</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">$50k+</div>
                  <div className="text-sm text-muted-foreground">Annual savings on analysis</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">5x</div>
                  <div className="text-sm text-muted-foreground">Faster decision making</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to transform your team's workflow?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the teams already using Revox to make better product decisions with user feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/contact">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/revox/pricing">View Pricing</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}