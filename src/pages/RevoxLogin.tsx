import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, BarChart3 } from "lucide-react";

export default function RevoxLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add your authentication logic here
    // For now, just simulate a delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Brand */}
        <div className="text-center space-y-6">
          <div className="animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <BarChart3 className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
              Revox
            </h1>
            <p className="text-muted-foreground text-base font-medium animate-fade-in delay-100">
              Turn reviews into product insights
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="animate-fade-in delay-200 border border-border/50 shadow-2xl bg-card/80 backdrop-blur-lg hover:shadow-3xl transition-all duration-300">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/90">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 text-base rounded-xl bg-background/60 border-2 border-border/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 hover:border-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/90">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 text-base rounded-xl bg-background/60 border-2 border-border/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 hover:border-primary/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/10"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Signing you in...
                  </div>
                ) : (
                  "Sign In to Revox"
                )}
              </Button>

              <div className="text-center pt-2">
                <Link 
                  to="/revox/forgot-password" 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-4 animate-fade-in delay-300">
          <p className="text-base text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/revox/auth" 
              className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline underline-offset-4"
            >
              Sign up for free
            </Link>
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/revox/about" className="hover:text-primary transition-colors font-medium">
              About Revox
            </Link>
            <span className="text-border">•</span>
            <Link to="/revox/help" className="hover:text-primary transition-colors font-medium">
              Help Center
            </Link>
            <span className="text-border">•</span>
            <Link to="/revox" className="hover:text-primary transition-colors font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}