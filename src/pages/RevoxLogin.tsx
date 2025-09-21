import { useState } from "react";
import { signIn, signUp, confirmSignUp, fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Github, User, Linkedin } from "lucide-react";
import revoxLogoDark from "@/assets/revox-logo-dark.svg";
import revoxLogoLight from "@/assets/revox-logo-light.svg";
import { useTheme } from "@/components/theme-provider";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RevoxLogin() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Helper function from RevoxAuth
  async function ensureSignedOutIfSwitching(targetEmail: string) {
    try {
      const session = await fetchAuthSession();
      if (!session.tokens) return;

      const user = await getCurrentUser().catch(() => null);
      const currentUsername = (user?.username || "").toLowerCase();

      if (
        targetEmail &&
        currentUsername &&
        currentUsername !== targetEmail.toLowerCase()
      ) {
        await signOut();
      }
    } catch {
      // ignore
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    
    try {
      // 1) if already connected with another account → signOut first
      await ensureSignedOutIfSwitching(formData.email);

      // 2) re-check state after potential signOut
      const current = await fetchAuthSession();
      if (current.tokens) {
        // session still active → probably same user
        navigate("/revox/dashboard");
        return;
      }

      // 3) attempt sign in
      const res = await signIn({ username: formData.email, password: formData.password });

      // unconfirmed account → redirect to auth for confirmation
      if ((res as any)?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        setNeedsConfirm(true);
        setSuccessMsg(t("confirmAccountEmail"));
        return;
      }

      // 4) success
      navigate("/revox/dashboard");
    } catch (err: any) {
      if (err?.name === "UserNotConfirmedException") {
        setNeedsConfirm(true);
        setSuccessMsg(t("confirmAccountEmail"));
      } else if (err?.name === "NotAuthorizedException") {
        setErrorMsg(t("incorrectCredentials"));
      } else if (err?.name === "UserNotFoundException") {
        setErrorMsg(t("userNotFound"));
      } else if (err?.name === "UserAlreadyAuthenticatedException") {
        navigate("/revox/dashboard");
      } else {
        setErrorMsg(err?.message || t("signInFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    
    try {
      // Split name into first and last name if provided
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await signUp({
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            ...(firstName ? { given_name: firstName } : {}),
            ...(lastName ? { family_name: lastName } : {}),
          },
        },
      });
      
      setNeedsConfirm(true);
      setSuccessMsg(t("confirmationCodeSent"));
    } catch (err: any) {
      if (err?.name === "UsernameExistsException") {
        setNeedsConfirm(true);
        setErrorMsg(t("accountExistsConfirm"));
      } else if (err?.name === "InvalidPasswordException") {
        setErrorMsg(t("passwordPolicyError"));
      } else {
        setErrorMsg(err?.message || t("signUpFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    
    try {
      // Step 1: Confirm the account
      await confirmSignUp({ 
        username: formData.email, 
        confirmationCode: code 
      });
      
      setSuccessMsg(t("accountConfirmed"));
      
      // Step 2: Automatically sign in to get valid token
      await signIn({ 
        username: formData.email, 
        password: formData.password 
      });
      
      setSuccessMsg(t("signInSuccess"));
      
      // Step 3: Redirect to dashboard with valid token
      setTimeout(() => {
        navigate("/revox/dashboard");
      }, 1000);
      
    } catch (err: any) {
      if (err?.name === "CodeMismatchException") {
        setErrorMsg(t("invalidCode"));
      } else if (err?.name === "ExpiredCodeException") {
        setErrorMsg(t("expiredCode"));
      } else if (err?.name === "NotAuthorizedException") {
        setErrorMsg(t("invalidCredentials"));
      } else {
        setErrorMsg(err?.message || t("confirmationFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo Header */}
        <div className="text-center mb-4">
          <img 
            src={resolvedTheme === 'dark' ? revoxLogoDark : revoxLogoLight} 
            alt="Revox Logo" 
            className="h-20 w-auto mx-auto"
          />
        </div>

        {/* Login Form */}
        <div className="animate-fade-in delay-200 space-y-6">
          
          <form onSubmit={isSignupMode ? handleSignupSubmit : handleLoginSubmit} className="space-y-5">
            <div className="space-y-4">
              {isSignupMode && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("fullName")}
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    className="pl-12 h-12 rounded-xl border border-border/30 bg-background focus:border-revox-blue transition-colors"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("email")}
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    className="pl-12 h-12 rounded-xl border border-border/30 bg-background focus:border-revox-blue transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isSignupMode ? t("createPassword") : t("password")}
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    className="pl-12 pr-12 h-12 rounded-xl border border-border/30 bg-background focus:border-revox-blue transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-revox-blue transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
            {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

            <Button
              type="submit"
              variant="revox-gradient"
              className="w-full h-12 rounded-xl font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    {isSignupMode ? t("creatingAccount") : t("signingIn")}
                  </div>
                ) : (
                  isSignupMode ? t("createAccount") : t("signIn")
              )}
            </Button>

            {!isSignupMode && (
              <div className="text-center">
                <Link 
                  to="/revox/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-revox-blue transition-colors"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">{t("or")}</span>
            </div>
          </div>

          {/* Social Sign-in Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-center text-muted-foreground">{t("continueWith")}</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border border-border/30 hover:border-revox-blue/30 transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-xs font-medium">Google</span>
                </div>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border border-border/30 hover:border-revox-blue/30 transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <Linkedin className="w-5 h-5 text-[#0077B5]" />
                  <span className="text-xs font-medium">LinkedIn</span>
                </div>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl border border-border/30 hover:border-revox-blue/30 transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-1">
                  <Github className="w-5 h-5" />
                  <span className="text-xs font-medium">GitHub</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Confirmation Code Section */}
        {needsConfirm && (
          <div className="mt-6 p-4 border border-border/30 rounded-xl bg-muted/30 animate-fade-in">
            <h4 className="font-medium mb-2 text-foreground">{t("confirmEmail")}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t("enterCodeSentTo")} <strong>{formData.email}</strong>
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  id="confirmCode"
                  type="text"
                  placeholder={t("enterCode")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 rounded-xl border border-border/30 bg-background focus:border-revox-blue transition-colors"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleConfirm} 
                  disabled={isLoading || !code.trim()}
                  variant="revox-gradient"
                  className="flex-1 h-10 rounded-lg"
                  type="button"
                >
                  {isLoading ? t("confirming") : t("confirm")}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setNeedsConfirm(false)} 
                  className="flex-1 h-10 rounded-lg"
                  type="button"
                >
                  {t("editEmail")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center space-y-4 animate-fade-in delay-300">
          <p className="text-sm text-muted-foreground">
            {isSignupMode ? t("alreadyHaveAccount") : t("dontHaveAccount")}{" "}
            <button 
              onClick={() => {
                setIsSignupMode(!isSignupMode);
                setErrorMsg(null);
                setSuccessMsg(null);
                setNeedsConfirm(false);
                setCode("");
              }}
              className="text-revox-blue hover:text-revox-blue/80 transition-colors"
            >
              {isSignupMode ? t("signIn") : t("signUp")}
            </button>
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}