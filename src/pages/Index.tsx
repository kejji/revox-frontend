import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Zap, Star, CheckCircle, BarChart, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
const Index = () => {
  const { t } = useLanguage();
  
  return <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
          <div className="text-center">
            <Badge className="mb-8 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{t("heroSubtitle")}</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-7xl mb-8">
              {t("heroTitle")}
              <span className="text-primary"> {t("heroTitleHighlight")}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12">
              {t("heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/revox">
                  <Zap className="mr-2 h-5 w-5" />
                  {t("tryRevoxFree")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/contact">
                  {t("getInTouch")} <ArrowRight className="ml-2 h-5 w-5" />
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
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("servicesTitle")}</h2>
            <p className="text-lg text-muted-foreground">{t("servicesDescription")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: Target,
            title: t("productStrategy"),
            desc: t("productStrategyDesc")
          }, {
            icon: Users,
            title: t("userResearch"),
            desc: t("userResearchDesc")
          }, {
            icon: BarChart,
            title: t("dataDecisions"),
            desc: t("dataDecisionsDesc")
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
              <Link to="/services">{t("viewAllServices")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Revox Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6">{t("introducingRevox")}</Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                {t("revoxTitle")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("revoxDescription")}
              </p>
              <div className="space-y-3 mb-8">
                {[t("revoxFeature1"), t("revoxFeature2"), t("revoxFeature3"), t("revoxFeature4")].map((feature, index) => <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>)}
              </div>
              <Button asChild size="lg">
                <Link to="/revox">
                  {t("exploreRevox")} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl p-8">
              <div className="text-center space-y-6">
                <Star className="h-16 w-16 text-primary mx-auto" />
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">{t("teamsUsing")}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10M+</div>
                  <div className="text-muted-foreground">{t("reviewsAnalyzed")}</div>
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
            {t("ctaTitle")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("ctaDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">{t("getInTouch")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/blog">{t("readMyBlog")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;