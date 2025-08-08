import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Linkedin, Calendar, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            {t("contactHeroTitle")}
            <span className="text-primary"> {t("contactHeroHighlight")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t("contactHeroDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t("sendMessage")}</CardTitle>
                <p className="text-muted-foreground">
                  {t("sendMessageDesc")}
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="firstName">{t("contactFirstName")}</Label>
                       <Input id="firstName" placeholder="John" />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="lastName">{t("contactLastName")}</Label>
                       <Input id="lastName" placeholder="Doe" />
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="email">{t("contactEmail")}</Label>
                     <Input id="email" type="email" placeholder="john.doe@company.com" />
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="company">{t("contactCompany")}</Label>
                     <Input id="company" placeholder="Your Company" />
                   </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="projectType">{t("projectType")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectProjectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product-discovery">{t("productDiscoveryType")}</SelectItem>
                        <SelectItem value="product-ownership">{t("productOwnershipType")}</SelectItem>
                        <SelectItem value="mobile-strategy">{t("mobileStrategyType")}</SelectItem>
                        <SelectItem value="feedback-analysis">{t("feedbackAnalysisType")}</SelectItem>
                        <SelectItem value="revox-demo">{t("revoxDemo")}</SelectItem>
                        <SelectItem value="consulting">{t("generalConsulting")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeline">{t("projectTimeline")}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("whenStart")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">{t("asap")}</SelectItem>
                        <SelectItem value="1-month">{t("oneMonth")}</SelectItem>
                        <SelectItem value="3-months">{t("threeMonths")}</SelectItem>
                        <SelectItem value="6-months">{t("sixMonths")}</SelectItem>
                        <SelectItem value="just-exploring">{t("justExploring")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("projectDetails")}</Label>
                    <Textarea 
                      id="message" 
                      placeholder={t("projectDetailsPlaceholder")}
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    {t("sendMessageBtn")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & CTAs */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t("directContact")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("directContactDesc")}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:contact@revogate.com">
                    {t("sendEmail")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* LinkedIn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5" />
                  {t("linkedin")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("linkedinDesc")}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    {t("connectLinkedIn")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Revox Demo */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t("tryRevox")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("tryRevoxDesc")}
                </p>
                <Button asChild className="w-full">
                  <a href="/revox">
                    {t("bookRevoxDemo")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">{t("responseTime")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("responseTimeDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}