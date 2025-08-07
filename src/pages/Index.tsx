import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Zap, Star, CheckCircle, BarChart, Target } from "lucide-react";
const Index = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
          <div className="text-center">
            <Badge className="mb-8 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Product Owner & SaaS Creator</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-7xl mb-8">
              Building better products through
              <span className="text-primary"> user insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12">
              I'm a freelance Product Owner who helps teams build user-centric digital experiences. 
              I also created Revox, a SaaS platform that transforms app store feedback into actionable product insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/revox">
                  <Zap className="mr-2 h-5 w-5" />
                  Try Revox Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/contact">
                  Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Product Ownership Services</h2>
            <p className="text-lg text-muted-foreground">Comprehensive support for your product development journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: Target,
            title: "Product Strategy",
            desc: "Define vision and roadmaps aligned with business goals"
          }, {
            icon: Users,
            title: "User Research",
            desc: "Deep user insights through feedback analysis and research"
          }, {
            icon: BarChart,
            title: "Data-Driven Decisions",
            desc: "Analytics and metrics to guide product choices"
          }].map((service, index) => <Card key={index} className="text-center hover:border-primary/50 transition-colors">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>)}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Revox Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6">Introducing Revox</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Turn user feedback into product decisions
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Built from my experience as a Product Owner, Revox automatically analyzes app store reviews 
                to help teams identify issues, prioritize features, and make data-driven product decisions.
              </p>
              <div className="space-y-3 mb-8">
                {["Automated review collection and analysis", "AI-powered categorization and insights", "Save 10+ hours per week on manual analysis", "Used by 500+ product teams worldwide"].map((feature, index) => <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>)}
              </div>
              <Button asChild size="lg">
                <Link to="/revox">
                  Explore Revox <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl p-8">
              <div className="text-center space-y-6">
                <Star className="h-16 w-16 text-primary mx-auto" />
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">Teams using Revox</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10M+</div>
                  <div className="text-muted-foreground">Reviews analyzed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-blue-500/10">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to build better products together?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you need Product Owner expertise or want to transform your feedback analysis with Revox, I'm here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/blog">Read My Blog</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;