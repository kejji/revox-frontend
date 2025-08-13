import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  
  const footerLinks = {
    about: [
      { name: t("footerAboutMe"), href: "/about" },
      { name: t("footerServices"), href: "/services" },
      { name: t("footerBlog"), href: "/blog" },
      { name: t("footerContact"), href: "/contact" },
    ],
    revox: [
      { name: t("footerProduct"), href: "/revox" },
      { name: t("footerHowItWorks"), href: "/revox/how-it-works" },
      { name: t("footerUseCases"), href: "/revox/use-cases" },
      { name: t("footerPricing"), href: "/revox/pricing" },
    ],
    legal: [
      { name: t("footerPrivacyPolicy"), href: "/privacy" },
      { name: t("footerTermsOfService"), href: "/terms" },
      { name: t("footerGDPRCompliance"), href: "/gdpr" },
    ],
  };
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-xl font-bold text-foreground">
              Revogate
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("footerDescription")}
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-primary"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("footerAboutSection")}</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Revox Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("footerRevoxSection")}</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.revox.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("footerLegalSection")}</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Revogate. {t("footerCopyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}