import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
export function Footer() {
  const {
    t
  } = useLanguage();
  const footerLinks = {
    about: [{
      name: t("footerAboutMe"),
      href: "/about"
    }, {
      name: t("footerServices"),
      href: "/services"
    }, {
      name: t("footerBlog"),
      href: "/blog"
    }, {
      name: t("footerContact"),
      href: "/contact"
    }],
    revox: [{
      name: t("footerProduct"),
      href: "/revox"
    }, {
      name: t("footerHowItWorks"),
      href: "/revox/how-it-works"
    }, {
      name: t("footerUseCases"),
      href: "/revox/use-cases"
    }, {
      name: t("footerPricing"),
      href: "/revox/pricing"
    }],
    legal: [{
      name: t("footerPrivacyPolicy"),
      href: "/privacy"
    }, {
      name: t("footerTermsOfService"),
      href: "/terms"
    }, {
      name: t("footerGDPRCompliance"),
      href: "/gdpr"
    }]
  };
  return <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          

          {/* About Links */}
          

          {/* Revox Links */}
          

          {/* Legal Links */}
          
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Revogate. {t("footerCopyright")}
          </p>
        </div>
      </div>
    </footer>;
}