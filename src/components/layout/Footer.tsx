import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";

const footerLinks = {
  about: [
    { name: "About Me", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  revox: [
    { name: "Product", href: "/revox" },
    { name: "How it Works", href: "/revox/how-it-works" },
    { name: "Use Cases", href: "/revox/use-cases" },
    { name: "Pricing", href: "/revox/pricing" },
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
              ProductForge
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Product Owner services and FeedbackLens platform for better product decisions through user feedback analysis.
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

          {/* FeedbackLens Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">FeedbackLens</h3>
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
            © {new Date().getFullYear()} ProductForge. All rights reserved. Built with care for Product Owners.
          </p>
        </div>
      </div>
    </footer>
  );
}