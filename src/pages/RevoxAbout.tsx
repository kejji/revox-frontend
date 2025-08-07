import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Target, Users, Zap, CheckCircle } from "lucide-react";

export default function RevoxAbout() {
  const timeline = [
    {
      year: "2022",
      title: "The Problem Identified",
      description: "After years of manually analyzing app store reviews, I realized there had to be a better way to extract actionable insights from user feedback."
    },
    {
      year: "2023",
      title: "Building the Solution",
      description: "Started developing Revox as a side project, leveraging AI and machine learning to automate the feedback analysis process I was doing manually."
    },
    {
      year: "2024",
      title: "Early Success",
      description: "Tested with beta users and saw immediate results: teams saving 10+ hours per week and making faster, more informed product decisions."
    },
    {
      year: "Today",
      title: "Scaling Impact",
      description: "Revox now helps hundreds of Product Owners and teams across industries make better decisions with automated feedback analysis."
    }
  ];

  const values = [
    {
      icon: Target,
      title: "User-Centric",
      description: "Every feature we build is designed to help you better understand and serve your users."
    },
    {
      icon: Zap,
      title: "Efficiency First",
      description: "We believe Product Owners should spend time on strategy, not manual data processing."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Great products are built by teams. Revox facilitates better collaboration through shared insights."
    },
    {
      icon: Lightbulb,
      title: "Continuous Innovation",
      description: "As the product landscape evolves, so do we. We're constantly improving our analysis capabilities."
    }
  ];

  const stats = [
    {
      number: "500+",
      label: "Product Teams Using Revox"
    },
    {
      number: "10M+",
      label: "Reviews Analyzed"
    },
    {
      number: "85%",
      label: "Time Saved on Analysis"
    },
    {
      number: "50+",
      label: "Countries Served"
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            The Story Behind Revox
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            Built by a Product Owner
            <span className="text-primary"> for Product Owners</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Revox was born from a real problem I faced as a Product Owner: spending countless hours manually analyzing user feedback when I should have been focusing on strategy and building great products.
          </p>
        </div>

        {/* Origin Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">The Problem That Started It All</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  As a Product Owner working with mobile applications, I was spending 10-15 hours every week manually going through app store reviews. I'd copy and paste comments into spreadsheets, try to categorize them, and struggle to identify patterns across hundreds of data points.
                </p>
                <p>
                  The breaking point came during a retrospective when our team realized we'd missed a critical UX issue that had been mentioned in over 50 reviews. That's when I knew there had to be a better way.
                </p>
                <p>
                  I started building Revox not as a business, but as a solution to my own problem. The goal was simple: automate the tedious parts of feedback analysis so Product Owners could focus on what they do best – making strategic product decisions.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl p-8">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader>
                  <CardTitle className="text-center text-primary">Before Revox</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">15 hours</div>
                    <div className="text-sm text-muted-foreground">Weekly manual analysis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">Critical issues missed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2">3 weeks</div>
                    <div className="text-sm text-muted-foreground">To identify patterns</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">The Revox Journey</h2>
            <p className="text-lg text-muted-foreground">
              From personal problem to solution used by hundreds of teams
            </p>
          </div>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide how we build Revox
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <value.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Revox by the Numbers</h2>
            <p className="text-lg text-muted-foreground">
              The impact we're making across the product community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="mb-20">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                To empower Product Owners and teams with the insights they need to build products that truly serve their users. We believe that every piece of user feedback contains valuable information – our job is to make that information accessible and actionable.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary">User-Centric Product Development</Badge>
                <Badge variant="secondary">Data-Driven Decision Making</Badge>
                <Badge variant="secondary">Efficient Product Operations</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Personal Connection */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Why This Matters to Me</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  As someone who's spent years in Product Owner roles, I know firsthand how challenging it can be to balance strategic thinking with the day-to-day operational tasks of managing feedback and prioritizing features.
                </p>
                <p>
                  Revox represents my commitment to helping other Product Owners spend more time on what they love – understanding users, defining strategy, and building amazing products – and less time on repetitive analysis tasks.
                </p>
                <p>
                  Every feature we add to Revox is tested in real Product Owner workflows, because I use it myself for my consulting work and understand the challenges you face.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground mb-1">Built by practitioners</p>
                      <p className="text-sm text-muted-foreground">Created by someone who uses it daily in Product Owner work</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground mb-1">Continuously improved</p>
                      <p className="text-sm text-muted-foreground">Regular updates based on real Product Owner feedback and needs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground mb-1">User-focused design</p>
                      <p className="text-sm text-muted-foreground">Every interface decision prioritizes Product Owner workflow efficiency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join the Revox Community
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Become part of a growing community of Product Owners who are making better decisions with user feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/contact">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/about">Meet the Founder</Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}