import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import revoxLogo from "@/assets/revox-logo.svg";
import { useTheme } from "@/components/theme-provider";

export default function RevoxSignup() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      {/* Theme Toggle - positioned in top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-sm space-y-12">
        {/* Logo and Brand */}
        <div className="text-center space-y-8">
          <div className="animate-fade-in">
            <div className="mb-8">
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div className="animate-fade-in delay-200 space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Reviews. Insights. Growth
            </h2>
          </div>

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
                  className="pl-12 h-12 rounded-xl border border-border/30 bg-background focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Work email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="pl-12 h-12 rounded-xl border border-border/30 bg-background focus:border-primary transition-colors"
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

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                "Start Free Trial"
              )}
            </Button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Sign-in Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium text-foreground">Continue with Google</span>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="font-medium text-foreground">Continue with LinkedIn</span>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-xl border border-border/30 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <Github className="w-5 h-5 text-foreground" />
                  <span className="font-medium text-foreground">Continue with GitHub</span>
                </div>
              </Button>
            </div>

          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-6 animate-fade-in delay-300">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              to="/revox/login" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}