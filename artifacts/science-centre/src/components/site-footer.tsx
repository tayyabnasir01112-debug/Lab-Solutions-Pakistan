import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, MapPin, Phone, Mail, Linkedin, Twitter, Globe } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function img(path: string) {
  return `${BASE}${path}`;
}

export function SiteFooter({ variant = "default" }: { variant?: "default" | "slide" }) {
  if (variant === "slide") {
    return (
      <footer className="relative flex min-h-[100dvh] items-center overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container relative mx-auto px-6 py-28 md:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <img
                src={img("/images/sc-logo-full.png")}
                alt="Science Centre Logo"
                className="mb-8 h-16 w-auto object-contain brightness-0 invert"
              />
              <div className="mb-4 inline-flex border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white/70">
                Science Centre Pakistan
              </div>
              <h2 className="max-w-3xl font-[var(--app-font-heading)] text-4xl font-black leading-tight text-white md:text-6xl">
                Ready to shape the next lab workflow?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/62">
                Send a product, catalogue number, application, test menu or broad requirement. We will help route it to the right product family and next conversation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                  Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/products" className="inline-flex items-center border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-foreground">
                  Browse Catalogue
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-white/12 bg-white/[0.06] p-6">
                <h4 className="mb-5 font-[var(--app-font-heading)] text-sm font-black uppercase tracking-[0.16em] text-white">Quick Links</h4>
                <div className="grid gap-3 text-sm text-white/62">
                  {[
                    ["About Us", "/about"],
                    ["Global Partners", "/partners"],
                    ["Focus Areas", "/solutions"],
                    ["Product Catalogue", "/products"],
                    ["Contact", "/contact"],
                  ].map(([label, href]) => (
                    <Link key={label} href={href} className="transition-colors hover:text-primary">{label}</Link>
                  ))}
                </div>
              </div>
              <div className="border border-white/12 bg-white/[0.06] p-6">
                <h4 className="mb-5 font-[var(--app-font-heading)] text-sm font-black uppercase tracking-[0.16em] text-white">Head Office</h4>
                <div className="space-y-4 text-sm leading-relaxed text-white/62">
                  <div className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />3287 Adamjee Road Saddar, Rawalpindi, Pakistan</div>
                  <a href="tel:+92515568464" className="flex gap-3 transition-colors hover:text-primary"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />+92 51-5568464 | 5568498</a>
                  <a href="mailto:info@sciencecentre.com.pk" className="flex gap-3 transition-colors hover:text-primary"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />info@sciencecentre.com.pk</a>
                </div>
              </div>
              <div className="border border-white/12 bg-white/[0.06] p-6 sm:col-span-2">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-white/45">&copy; {new Date().getFullYear()} Science Centre Pakistan. All rights reserved.</div>
                  <div className="flex gap-3">
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
                        className="flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-primary"
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

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
                "Life Sciences",
                "Transplant Diagnostics",
                "Flow Cytometry Solutions",
                "Cell Culture Solutions",
                "Water Purification Systems",
                "NGS Solutions",
                "Allergen Solutions",
                "Biochemistry Instruments",
                "Filtration Solutions",
                "Flow Antibody Solutions",
                "General Lab Consumables",
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
