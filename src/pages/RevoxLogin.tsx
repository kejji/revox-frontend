import { useState } from "react";
import { signIn, fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import revoxLogo from "@/assets/revox-logo.png";

export default function RevoxLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    
    try {
      // 1) if already connected with another account → signOut first
      await ensureSignedOutIfSwitching(email);

      // 2) re-check state after potential signOut
      const current = await fetchAuthSession();
      if (current.tokens) {
        // session still active → probably same user
        navigate("/revox/dashboard");
        return;
      }

      // 3) attempt sign in
      const res = await signIn({ username: email, password });

      // unconfirmed account → redirect to auth for confirmation
      if ((res as any)?.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        navigate("/revox/auth", { state: { tab: "signup" } });
        return;
      }

      // 4) success
      navigate("/revox/dashboard");
    } catch (err: any) {
      if (err?.name === "UserNotConfirmedException") {
        navigate("/revox/auth", { state: { tab: "signup" } });
      } else if (err?.name === "NotAuthorizedException") {
        setErrorMsg("Incorrect email or password.");
      } else if (err?.name === "UserNotFoundException") {
        setErrorMsg("No user found with this email.");
      } else if (err?.name === "UserAlreadyAuthenticatedException") {
        navigate("/revox/dashboard");
      } else {
        setErrorMsg(err?.message || "Sign in failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-12">
        {/* Logo and Brand */}
        <div className="text-center space-y-8">
          <div className="animate-fade-in">
            <div className="mb-8">
              <img 
                src={revoxLogo} 
                alt="Revox" 
                className="h-16 mx-auto animate-pulse"
              />
            </div>
            <p className="text-muted-foreground text-lg font-light animate-fade-in delay-100">
              Reviews. Insights. Growth.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="animate-fade-in delay-200 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 rounded-xl border border-border/30 bg-background focus:border-primary transition-colors"
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 rounded-xl border border-border/30 bg-background focus:border-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
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
              className="w-full h-12 rounded-xl font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link 
              to="/revox/forgot-password" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-6 animate-fade-in delay-300">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/revox/auth" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}