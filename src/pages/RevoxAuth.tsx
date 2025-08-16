// src/pages/RevoxAuth.tsx
import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Shield, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Tab = "signup" | "signin";

export default function RevoxAuth() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // --- Sign Up form
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");

  // --- Confirm step (visible après signUp)
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [code, setCode] = useState("");

  // --- UI state
  const [tab, setTab] = useState<Tab>("signup");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // TEMP: on garde cette nav pour l’onglet Sign In (on branchera signIn plus tard)
  const handleDummyLogin = () => {
    navigate("/revox/dashboard");
  };

  async function handleSignup() {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await signUp({
        username: email, // v6: loginWith.email = true dans amplify.ts
        password,
        options: {
          userAttributes: {
            email,
            ...(firstName ? { given_name: firstName } : {}),
            ...(lastName  ? { family_name: lastName } : {}),
          },
        },
      });
      setNeedsConfirm(true);
      setSuccessMsg("We sent you a confirmation code by email.");
    } catch (err: any) {
      if (err?.name === "UsernameExistsException") {
        setNeedsConfirm(true);
        setErrorMsg("An account already exists with this email. If not confirmed yet, enter the code below.");
      } else if (err?.name === "InvalidPasswordException") {
        setErrorMsg("Password does not meet the policy.");
      } else {
        setErrorMsg(err?.message || "Signup failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      setSuccessMsg("Account confirmed! You can now sign in.");
      setNeedsConfirm(false);
      setTab("signin");
    } catch (err: any) {
      if (err?.name === "CodeMismatchException") {
        setErrorMsg("Invalid code. Please try again.");
      } else if (err?.name === "ExpiredCodeException") {
        setErrorMsg("Code expired. Request a new code.");
      } else {
        setErrorMsg(err?.message || "Confirmation failed.");
      }
    } finally {
      setLoading(false);
    }
  }

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

              <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signup">{t("signUp")}</TabsTrigger>
                  <TabsTrigger value="signin">{t("signIn")}</TabsTrigger>
                </TabsList>

                {/* SIGN UP */}
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
                          <Input
                            id="firstName"
                            placeholder={t("firstNamePlaceholder")}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{t("authLastName")}</Label>
                          <Input
                            id="lastName"
                            placeholder={t("lastNamePlaceholder")}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t("authEmail")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            placeholder={t("emailPlaceholder")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">{t("authPassword")}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="password"
                            type="password"
                            className="pl-10"
                            placeholder={t("passwordPlaceholder")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
                      {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

                      {/* Important: pas de navigation ici */}
                      <Button className="w-full" onClick={handleSignup} disabled={loading} type="button">
                        {t("startFreeTrial")}
                      </Button>

                      {/* Bloc de confirmation (apparaît après signUp) */}
                      {needsConfirm && (
                        <div className="mt-6 border-t pt-6">
                          <h4 className="font-medium mb-2">Confirm your email</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Enter the 6-digit code sent to <b>{email}</b>.
                          </p>
                          <div className="space-y-2">
                            <Label htmlFor="confirmCode">Confirmation code</Label>
                            <Input
                              id="confirmCode"
                              placeholder="123456"
                              value={code}
                              onChange={(e) => setCode(e.target.value)}
                            />
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button onClick={handleConfirm} disabled={loading} type="button">
                              Confirm
                            </Button>
                            <Button variant="outline" onClick={() => setNeedsConfirm(false)} type="button">
                              Edit email
                            </Button>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground text-center">
                        {t("signUpTerms")}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SIGN IN (branché à l’étape suivante) */}
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
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="signin-email" type="email" className="pl-10" placeholder={t("emailPlaceholder")} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">{t("authPassword")}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="signin-password" type="password" className="pl-10" placeholder={t("passwordPlaceholder")} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="remember" className="rounded" />
                          <Label htmlFor="remember" className="text-sm">{t("rememberMe")}</Label>
                        </div>
                        <Button variant="link" className="px-0 text-sm" type="button">
                          {t("forgotPassword")}
                        </Button>
                      </div>
                      {/* TEMP tant qu'on n'a pas branché signIn */}
                      <Button className="w-full" onClick={handleDummyLogin} type="button">
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
}