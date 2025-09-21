import { useState } from "react";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Github } from "lucide-react";
import { Label } from "@/components/ui/label";
import revoxLogoDark from "@/assets/revox-logo-dark.svg";
import revoxLogoLight from "@/assets/revox-logo-light.svg";
import { useTheme } from "@/components/theme-provider";

export default function RevoxSignup() {
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Confirmation step state
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setSuccessMsg("We sent you a confirmation code by email.");
    } catch (err: any) {
      if (err?.name === "UsernameExistsException") {
        setNeedsConfirm(true);
        setErrorMsg("An account already exists with this email. If not confirmed yet, enter the code below.");
      } else if (err?.name === "InvalidPasswordException") {
        setErrorMsg("Password does not meet the policy requirements.");
      } else {
        setErrorMsg(err?.message || "Signup failed. Please try again.");
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
      
      setSuccessMsg("Account confirmed! Signing you in...");
      
      // Step 2: Automatically sign in to get valid token
      await signIn({ 
        username: formData.email, 
        password: formData.password 
      });
      
      setSuccessMsg("Successfully signed in! Redirecting to dashboard...");
      
      // Step 3: Redirect to dashboard with valid token
      setTimeout(() => {
        navigate("/revox/dashboard");
      }, 1000);
      
    } catch (err: any) {
      if (err?.name === "CodeMismatchException") {
        setErrorMsg("Invalid code. Please try again.");
      } else if (err?.name === "ExpiredCodeException") {
        setErrorMsg("Code expired. Please request a new code.");
      } else if (err?.name === "NotAuthorizedException") {
        setErrorMsg("Invalid credentials. Please check your password.");
      } else {
        setErrorMsg(err?.message || "Confirmation or sign-in failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-12">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <img 
            src={resolvedTheme === 'dark' ? revoxLogoDark : revoxLogoLight} 
            alt="Revox Logo" 
            className="h-32 w-auto mx-auto"
          />
        </div>

        {/* Signup Form */}
        <div className="animate-fade-in delay-200 space-y-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="pl-12 h-12 rounded-xl border border-border/30 bg-background focus:border-revox-blue transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="pl-12 h-12 rounded-xl border border-border/30 bg-background focus:border-revox-blue transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
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

            {/* Error and Success Messages */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{errorMsg}</p>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">{successMsg}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                variant="default"
                className="w-full h-12 rounded-xl font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>

              <Button
                type="button"
                variant="revox-gradient"
                className="w-full h-12 rounded-xl font-medium"
                onClick={() => navigate("/revox/login")}
              >
                Sign in
              </Button>
            </div>

            {/* Confirmation Code Section */}
            {needsConfirm && (
              <div className="mt-6 p-4 border border-border/30 rounded-xl bg-muted/30">
                <h4 className="font-medium mb-2 text-foreground">Confirm your email</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the 6-digit code sent to <strong>{formData.email}</strong>
                </p>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      id="confirmCode"
                      type="text"
                      placeholder="Enter 6-digit code"
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
                      variant="revox-primary"
                      className="flex-1 h-10 rounded-lg"
                      type="button"
                    >
                      {isLoading ? "Confirming..." : "Confirm"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setNeedsConfirm(false)} 
                      className="flex-1 h-10 rounded-lg"
                      type="button"
                    >
                      Edit email
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/revox/login" 
                  className="text-revox-blue hover:text-revox-blue/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}