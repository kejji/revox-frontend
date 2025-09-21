// src/components/layout/Header.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { AlertsInterface } from "@/components/app-details/AlertsInterface";
import { useLanguage } from "@/contexts/LanguageContext";
import revogateLogo from "@/assets/revogate-logo.svg";

export type HeaderProps = {
  /** Affiche/masque la topbar globale. Par défaut: true */
  showTopbar?: boolean;
};

/** Header global du site (Lovable). 
 * Ajout minimal: prop showTopbar pour pouvoir le masquer sur certaines pages (ex: Dashboard).
 */
export function Header({ showTopbar = true }: HeaderProps) {
  // 👉 si on veut cacher le header global (pour éviter un double header), on ne rend rien
  if (!showTopbar) return null;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("revox"), href: "/revox", isProduct: true },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Show alerts only on Revox pages
  const showAlerts = location.pathname.startsWith("/revox");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img 
              src={revogateLogo} 
              alt="Revogate"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 pt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-md text-lg font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-foreground hover:text-primary hover:bg-primary/5",
                      item.isProduct &&
                        !isActive(item.href) &&
                        "text-blue-600 dark:text-blue-400"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-center gap-2 mb-4">
                    <ThemeToggle />
                    <LanguageToggle />
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/contact">{t("getInTouch")}</Link>
                  </Button>
                  <Button asChild variant="revox-gradient" size="lg" className="w-full">
                    <Link to="/revox/login">{t("tryRevoxFree")}</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive(item.href)
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-foreground hover:text-primary hover:bg-primary/5",
                item.isProduct &&
                  !isActive(item.href) &&
                  "text-blue-600 dark:text-blue-400 hover:text-blue-500"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
          <LanguageToggle />
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link to="/contact">{t("getInTouch")}</Link>
          </Button>
          <Button asChild variant="revox-gradient" size="lg">
            <Link to="/revox/login">{t("tryRevoxFree")}</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}