import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, Star, BarChart, Users, Shield, Zap } from "lucide-react";

export default function Revox() {
  const features = [
    {
      icon: Zap,
      title: "Automated Collection",
      description: "Automatically extract and categorize app store reviews from Google Play and Apple App Store"
    },
    {
      icon: BarChart,
      title: "Smart Analysis",
      description: "AI-powered insights that identify patterns, issues, and feature requests in user feedback"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share insights across product, marketing, and strategy teams with role-based access"
    },
    {
      icon: Shield,
      title: "Enterprise Ready",
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

  const testimonials = [
    {
      quote: "Revox helped us identify a critical UX issue that was mentioned in over 200 reviews but we'd completely missed.",
      author: "Sarah Chen",
      role: "Senior Product Manager",
      company: "FinTech Startup"
    },
    {
      quote: "The automated categorization saves our team hours every week. We can focus on solving problems instead of finding them.",
      author: "Marcus Rodriguez",
      role: "Chief Product Officer",
      company: "Banking App"
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Built by a Product Owner, for Product Owners
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-7xl mb-8">
            Turn user feedback into
            <span className="text-primary"> actionable insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-10">
            Revox automatically extracts, analyzes, and monitors user feedback from app stores, helping Product Owners and teams make data-driven decisions that improve user satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/revox/auth">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/revox/how-it-works">
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              GDPR Compliant
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Enterprise Ready
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              No Setup Required
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need to analyze user feedback
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From automated collection to actionable insights, Revox handles the entire feedback analysis workflow.
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
                Why Product Owners choose Revox
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stop spending hours manually analyzing feedback. Let Revox do the heavy lifting so you can focus on what matters: building better products.
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
                <div className="text-lg font-medium text-foreground mb-4">Faster Analysis</div>
                <p className="text-sm text-muted-foreground">
                  What used to take hours now takes minutes with automated feedback categorization and insight generation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Product Teams
            </h2>
            <p className="text-lg text-muted-foreground">
              See what Product Owners and teams are saying about Revox
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <blockquote className="text-lg text-foreground mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-medium text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases CTA */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Product Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Prioritize features based on actual user feedback and identify critical issues faster.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/revox/use-cases#product-teams">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:border-primary/50 transition-colors">
              <CardHeader>
                <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Marketing Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Understand customer sentiment and identify opportunities for product messaging.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/revox/use-cases#marketing-teams">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Strategy Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Make informed strategic decisions with comprehensive user feedback analysis.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/revox/use-cases#strategy-leaders">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to transform your feedback analysis?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of Product Owners who are making better decisions with Revox. Start your free trial today.
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