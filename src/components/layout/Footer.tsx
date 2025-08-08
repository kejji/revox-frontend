import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";

const footerLinks = {
  about: [
    { name: "About Me", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  rgInsights: [
    { name: "Product", href: "/rg-insights" },
    { name: "How it Works", href: "/rg-insights/how-it-works" },
    { name: "Use Cases", href: "/rg-insights/use-cases" },
    { name: "Pricing", href: "/rg-insights/pricing" },
    { name: "About", href: "/rg-insights/about" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "GDPR Compliance", href: "/gdpr" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-xl font-bold text-foreground">
              Règle & Gestion
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Product Owner services and RG Insights SaaS platform for better product decisions through user feedback analysis.
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
            <h3 className="text-sm font-semibold text-foreground">About</h3>
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

          {/* RG Insights Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">RG Insights</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.rgInsights.map((link) => (
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
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
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
            © {new Date().getFullYear()} Règle & Gestion. All rights reserved. Built with care for Product Owners.
          </p>
        </div>
      </div>
    </footer>
  );
}