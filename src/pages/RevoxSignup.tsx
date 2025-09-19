import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import revoxLogo from "@/assets/revox-logo.png";

export default function RevoxSignup() {
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
          </div>
        </div>

        {/* Signup Form */}
        <div className="animate-fade-in delay-200 space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Try Revox Free
            </h2>
            <p className="text-sm text-muted-foreground">
              Start extracting insights from reviews today
            </p>
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