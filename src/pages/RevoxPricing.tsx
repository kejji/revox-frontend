import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CheckCircle, X, Star, Users, Shield, Zap } from "lucide-react";

export default function RevoxPricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out Revox",
      monthlyPrice: 0,
      annualPrice: 0,
      badge: null,
      icon: Zap,
      features: [
        "1 app connection",
        "100 reviews analyzed per month",
        "Basic categorization",
        "Email reports",
        "Community support"
      ],
      notIncluded: [
        "Custom categories",
        "API access",
        "Priority support",
        "Advanced analytics"
      ],
      cta: "Start Free",
      ctaVariant: "outline" as const
    },
    {
      name: "Pro",
      description: "For growing product teams",
      monthlyPrice: 99,
      annualPrice: 79,
      badge: "Most Popular",
      icon: Users,
      features: [
        "5 app connections",
        "5,000 reviews analyzed per month",
        "Advanced categorization & sentiment analysis",
        "Custom categories and tags",
        "Slack & email notifications",
        "Export capabilities",
        "Priority email support",
        "Trend analysis"
      ],
      notIncluded: [
        "Unlimited apps",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ],
      cta: "Start Pro Trial",
      ctaVariant: "default" as const
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      monthlyPrice: 299,
      annualPrice: 249,
      badge: "Best Value",
      icon: Shield,
      features: [
        "Unlimited app connections",
        "Unlimited reviews analyzed",
        "All Pro features included",
        "API access",
        "Custom integrations",
        "Dedicated success manager",
        "24/7 priority support",
        "Custom onboarding",
        "Advanced security & compliance",
        "Custom reporting"
      ],
      notIncluded: [],
      cta: "Contact Sales",
      ctaVariant: "default" as const
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
    },
    {
      question: "What happens if I exceed my review limit?",
      answer: "We'll notify you when you're approaching your limit. You can either upgrade your plan or wait for the next billing cycle."
    },
    {
      question: "Do you offer discounts for startups?",
      answer: "Yes! We offer up to 50% off for qualifying early-stage startups. Contact us for more details."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees ever. You only pay for your chosen plan."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. Cancel anytime with no penalties. Your access continues until the end of your billing period."
    },
    {
      question: "Do you offer custom enterprise plans?",
      answer: "Yes, we can create custom plans for large enterprises with specific needs. Contact our sales team."
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            Simple, transparent
            <span className="text-primary"> pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that fits your team size and analysis needs. All plans include core features with no hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <Label htmlFor="billing-toggle" className={`text-sm ${!isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={`text-sm ${isAnnual ? 'font-medium' : 'text-muted-foreground'}`}>
              Annual
            </Label>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-2 ${plan.badge === "Most Popular" ? "border-primary shadow-lg scale-105" : "border-border hover:border-primary/50"} transition-all`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <plan.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-foreground">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        /month
                      </span>
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${plan.monthlyPrice}/month when billed monthly
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-2">
                        <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground line-through">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    asChild 
                    variant={plan.ctaVariant}
                    size="lg" 
                    className="w-full"
                  >
                    <Link to={plan.name === "Enterprise" ? "/contact" : "/contact"}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Feature Comparison
            </h2>
            <p className="text-lg text-muted-foreground">
              See what's included in each plan
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-medium text-foreground">Features</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Free</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Pro</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["App connections", "1", "5", "Unlimited"],
                  ["Reviews analyzed/month", "100", "5,000", "Unlimited"],
                  ["Basic categorization", "✓", "✓", "✓"],
                  ["Advanced sentiment analysis", "✗", "✓", "✓"],
                  ["Custom categories", "✗", "✓", "✓"],
                  ["API access", "✗", "✗", "✓"],
                  ["24/7 support", "✗", "✗", "✓"],
                  ["Dedicated success manager", "✗", "✗", "✓"]
                ].map(([feature, free, pro, enterprise], index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 px-4 text-sm text-foreground">{feature}</td>
                    <td className="py-3 px-4 text-center text-sm text-muted-foreground">{free}</td>
                    <td className="py-3 px-4 text-center text-sm text-foreground">{pro}</td>
                    <td className="py-3 px-4 text-center text-sm text-foreground">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your free trial today. No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/contact">Start Free Trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}