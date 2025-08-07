import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Target, Smartphone, TrendingUp } from "lucide-react";

export default function About() {
  const expertise = [
    {
      icon: Target,
      title: "Product Strategy",
      description: "Define product vision and roadmaps that align with business goals and user needs."
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description: "Build products that truly solve user problems through research and feedback analysis."
    },
    {
      icon: Smartphone,
      title: "Mobile Excellence",
      description: "Specialized expertise in mobile app development and mobile-first experiences."
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Decisions",
      description: "Use analytics and user feedback to make informed product decisions."
    }
  ];

  const industries = [
    "Banking & Fintech",
    "SaaS Platforms",
    "E-commerce",
    "Healthcare Tech",
    "Insurance",
    "Telecommunications"
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            Product Owner with a
            <span className="text-primary"> user-first</span> approach
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            I'm a freelance Product Owner specialized in mobile and tech products. I help startups and enterprise clients build user-centric digital experiences that drive real business value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/services">
                View My Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>

        {/* Background */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Background</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              With over a decade of experience in product management and ownership, I specialize in transforming complex business requirements into user-friendly digital solutions. My journey began in traditional product management, but I quickly found my passion in the intersection of user experience and business strategy.
            </p>
            <p>
              What sets me apart is my deep understanding of mobile ecosystems and my ability to translate user feedback into actionable product improvements. This expertise led me to create <Link to="/revox" className="text-primary font-medium">Revox</Link>, a SaaS platform that helps Product Owners like myself make better prioritization decisions using app store feedback.
            </p>
          </div>
        </section>

        {/* Expertise */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Core Expertise</h2>
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
          <h2 className="text-3xl font-bold text-foreground mb-8">Industries I Serve</h2>
          <p className="text-lg text-muted-foreground mb-6">
            I work across various sectors, with particular expertise in regulated industries where user trust and compliance are paramount.
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
            Ready to work together?
          </h2>
          <p className="text-muted-foreground mb-6">
            Let's discuss how I can help you build better products that your users will love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">Start a Conversation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/blog">Read My Insights</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}