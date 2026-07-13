import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Phone, Mail, Linkedin, Twitter, Globe } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function img(path: string) {
  return `${BASE}${path}`;
}

export function SiteFooter() {
  return (
    <footer className="bg-background pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <img
              src={img("/images/sc-logo.png")}
              alt="Science Centre Logo"
              className="h-14 w-auto object-contain mb-6"
            />
            <p className="text-muted-foreground text-sm font-light mb-6">
              Pakistan&apos;s premier B2B distributor of advanced laboratory equipment, analytical
              instruments, and molecular biology tools.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Linkedin className="h-4 w-4" />, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: <Twitter className="h-4 w-4" />, href: "https://twitter.com", label: "Twitter" },
                { icon: <Globe className="h-4 w-4" />, href: "https://sciencecentre.com.pk", label: "Website" },
              ].map(({ icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-10 w-10 bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-[var(--app-font-heading)] font-bold text-foreground mb-6 uppercase text-sm tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                ["About Us", "/about"],
                ["Global Partners", "/partners"],
                ["Focus Areas", "/solutions"],
                ["Product Catalogue", "/products"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-primary transition-colors hover:translate-x-1 inline-block transition-transform"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[var(--app-font-heading)] font-bold text-foreground mb-6 uppercase text-sm tracking-wider">
              Applications
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                "Transplant Diagnostics",
                "Life Sciences",
                "Molecular Biology",
                "Immunology",
                "Analytical Chemistry",
              ].map((item) => (
                <li key={item}>
                  <Link href="/solutions" className="hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[var(--app-font-heading)] font-bold text-foreground mb-6 uppercase text-sm tracking-wider">
              Head Office
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  3287 Adamjee Road Saddar
                  <br />
                  Rawalpindi, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+9251556846445568498" className="hover:text-primary transition-colors">
                  +92 51-5568464 | 5568498
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href="mailto:info@sciencecentre.com.pk"
                  className="hover:text-primary transition-colors"
                >
                  info@sciencecentre.com.pk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-light">
          <div>&copy; {new Date().getFullYear()} Science Centre Pakistan. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
