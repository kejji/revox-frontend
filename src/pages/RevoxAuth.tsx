import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Building, Zap, Shield, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RevoxAuth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/revox/dashboard');
  };
  
  return (
    <Layout>
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          {/* Back button */}
          <div className="mb-8">
            <Button asChild variant="ghost">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToHome")}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Auth forms */}
            <div>
              <div className="mb-8">
                <Badge className="mb-4">{t("joinRevox")}</Badge>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {t("authTitle")}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t("authDescription")}
                </p>
              </div>

              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">{t("signUp")}</TabsTrigger>
                  <TabsTrigger value="signin">{t("signIn")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signup">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("createAccount")}</CardTitle>
                      <CardDescription>{t("signUpDescription")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{t("authFirstName")}</Label>
                          <Input id="firstName" placeholder={t("firstNamePlaceholder")} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{t("authLastName")}</Label>
                          <Input id="lastName" placeholder={t("lastNamePlaceholder")} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">{t("authCompany")}</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="company" className="pl-10" placeholder={t("companyPlaceholder")} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("authEmail")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="email" type="email" className="pl-10" placeholder={t("emailPlaceholder")} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">{t("authPassword")}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="password" type="password" className="pl-10" placeholder={t("passwordPlaceholder")} />
                        </div>
                      </div>
                      <Button className="w-full" onClick={handleLogin}>
                        <Zap className="mr-2 h-4 w-4" />
                        {t("startFreeTrial")}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        {t("signUpTerms")}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="signin">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("welcomeBack")}</CardTitle>
                      <CardDescription>{t("signInDescription")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">{t("authEmail")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="signin-email" type="email" className="pl-10" placeholder={t("emailPlaceholder")} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">{t("authPassword")}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="signin-password" type="password" className="pl-10" placeholder={t("passwordPlaceholder")} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="remember" className="rounded" />
                          <Label htmlFor="remember" className="text-sm">{t("rememberMe")}</Label>
                        </div>
                        <Button variant="link" className="px-0 text-sm">
                          {t("forgotPassword")}
                        </Button>
                      </div>
                      <Button className="w-full" onClick={handleLogin}>
                        {t("signInToRevox")}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Separator />
                <div className="flex items-center justify-center mt-6 space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>{t("gdprCompliant")}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>{t("enterpriseReady")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Benefits */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">{t("whyRevox")}</h3>
                <div className="space-y-4">
                  {[
                    { title: t("savesTime"), desc: t("savesTimeDesc") },
                    { title: t("aiPowered"), desc: t("aiPoweredDesc") },
                    { title: t("actionableInsights"), desc: t("actionableInsightsDesc") },
                    { title: t("teamCollaboration"), desc: t("teamCollaborationDesc") }
                  ].map((benefit, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-foreground">{benefit.title}</div>
                        <div className="text-sm text-muted-foreground">{benefit.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center p-6 border rounded-xl">
                <div className="text-2xl font-bold text-primary mb-2">14 {t("daysTrial")}</div>
                <div className="text-muted-foreground mb-4">{t("daysTrialDesc")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("noCardRequired")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RevoxAuth;