import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import {
  brands,
  categories,
  products,
  productsByBrand,
  productsByCategory,
  featuredProducts,
  brandById,
  categoryById,
} from "@/lib/catalogue";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function img(path: string) {
  return `${BASE}${path}`;
}

const NAV_LINKS = [
  { label: "Solutions", anchor: "solutions", isPage: false, hasMega: false },
  { label: "Products", anchor: "products", isPage: true, href: "/products", hasMega: true },
  { label: "Partners", anchor: "partners", isPage: false, hasMega: false },
  { label: "About", anchor: "about", isPage: true, href: "/about", hasMega: false },
  { label: "Contact", anchor: "contact", isPage: false, hasMega: false },
] as const;

type PreviewState =
  | { kind: "featured" }
  | { kind: "brand"; id: string }
  | { kind: "category"; id: string };

export function SiteNavbar({ visible = true }: { visible?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [preview, setPreview] = useState<PreviewState>({ kind: "featured" });
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/";
  const isDarkPage = location === "/" || location === "/about";
  const solid = scrolled || !isDarkPage;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu when route changes
  useEffect(() => {
    setMegaOpen(false);
    setMenuOpen(false);
  }, [location]);

  function hrefFor(link: typeof NAV_LINKS[number]) {
    if (link.isPage && "href" in link) return link.href;
    return isHome ? `#${link.anchor}` : `/#${link.anchor}`;
  }

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  // Right-panel product preview list
  const previewProducts =
    preview.kind === "brand"
      ? productsByBrand(preview.id).slice(0, 5)
      : preview.kind === "category"
      ? productsByCategory(preview.id).slice(0, 5)
      : featuredProducts().slice(0, 5);

  const previewTitle =
    preview.kind === "brand"
      ? brandById(preview.id).name
      : preview.kind === "category"
      ? categoryById(preview.id).name
      : "Featured Products";

  const previewLink =
    preview.kind === "brand"
      ? `/products?brand=${preview.id}`
      : preview.kind === "category"
      ? `/products?category=${preview.id}`
      : `/products?featured=1`;

  const previewTotal =
    preview.kind === "brand"
      ? productsByBrand(preview.id).length
      : preview.kind === "category"
      ? productsByCategory(preview.id).length
      : featuredProducts().length;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        solid
          ? "bg-background/90 backdrop-blur-lg border-border shadow-sm"
          : "bg-transparent border-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src={img("/images/sc-logo-full.png")}
            alt="Science Centre Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>

        <div className={`hidden lg:flex items-center gap-8 text-sm font-medium ${!solid ? "text-white" : "text-foreground"}`}>
          {NAV_LINKS.map((link, i) => {
            const href = hrefFor(link);
            const Inner = (
              <motion.span
                className="relative hover:text-primary transition-colors group cursor-pointer inline-flex items-center gap-1"
                initial={{ opacity: 0, y: -8 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              >
                {link.label}
                {link.hasMega && (
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      megaOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </motion.span>
            );
            if (link.hasMega) {
              return (
                <div
                  key={link.label}
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleClose}
                  className="py-2"
                >
                  <Link href={href}>{Inner}</Link>
                </div>
              );
            }
            return link.isPage ? (
              <Link key={link.label} href={href}>
                {Inner}
              </Link>
            ) : (
              <a key={link.label} href={href}>
                {Inner}
              </a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="flex items-center"
        >
          <Button
            asChild
            className="hidden lg:flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-none px-6"
          >
            <a href={isHome ? "#contact" : "/#contact"}>Request a Quote</a>
          </Button>
          <button
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.div
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-foreground mb-1.5 origin-center"
            />
            <motion.div
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 bg-foreground mb-1.5"
            />
            <motion.div
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-foreground origin-center"
            />
          </button>
        </motion.div>
      </div>

      {/* ─── Mega Menu (desktop) ─────────────────────────────── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            key="mega"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
            className="hidden lg:block absolute left-0 right-0 top-full bg-background border-b border-border shadow-2xl"
            data-testid="mega-menu"
          >
            <div className="container mx-auto px-6 md:px-12 py-8">
              {/* top stripe */}
              <div className="flex items-center justify-between mb-6 pb-5 border-b border-border">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Catalogue
                  </div>
                  <div className="font-[var(--app-font-heading)] text-2xl font-bold mt-1">
                    {products.length} products from {brands.length} world-class manufacturers
                  </div>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-foreground text-background px-5 h-11 text-xs font-bold uppercase tracking-[0.14em] hover:bg-foreground/90 transition-colors"
                  onClick={() => setMegaOpen(false)}
                >
                  View All Products
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-12 gap-8">
                {/* Brands column */}
                <div className="col-span-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                    By Brand
                  </div>
                  <div className="space-y-0.5">
                    {brands.map((b) => {
                      const isActive = preview.kind === "brand" && preview.id === b.id;
                      const count = productsByBrand(b.id).length;
                      return (
                        <Link
                          key={b.id}
                          href={`/products?brand=${b.id}`}
                          onMouseEnter={() => setPreview({ kind: "brand", id: b.id })}
                          onClick={() => setMegaOpen(false)}
                          className={`group flex items-center justify-between py-2 px-3 -mx-3 transition-colors ${
                            isActive ? "bg-muted" : "hover:bg-muted/60"
                          }`}
                          data-testid={`mega-brand-${b.id}`}
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span
                              className="w-2.5 h-2.5 flex-shrink-0"
                              style={{ background: b.accent }}
                            />
                            <span className="text-sm font-medium text-foreground truncate">
                              {b.short}
                            </span>
                          </span>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {count}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Categories column */}
                <div className="col-span-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                    By Category
                  </div>
                  <div className="space-y-0.5">
                    {categories.map((c) => {
                      const isActive = preview.kind === "category" && preview.id === c.id;
                      const count = productsByCategory(c.id).length;
                      return (
                        <Link
                          key={c.id}
                          href={`/products?category=${c.id}`}
                          onMouseEnter={() => setPreview({ kind: "category", id: c.id })}
                          onClick={() => setMegaOpen(false)}
                          className={`group flex items-center justify-between py-2 px-3 -mx-3 transition-colors ${
                            isActive ? "bg-muted" : "hover:bg-muted/60"
                          }`}
                          data-testid={`mega-cat-${c.id}`}
                        >
                          <span className="flex items-center gap-3 min-w-0 text-foreground">
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                              {c.icon}
                            </span>
                            <span className="text-sm font-medium truncate">{c.name}</span>
                          </span>
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {count}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href="/products?featured=1"
                    onMouseEnter={() => setPreview({ kind: "featured" })}
                    onClick={() => setMegaOpen(false)}
                    className="mt-4 flex items-center gap-2 py-2 px-3 -mx-3 hover:bg-muted/60 transition-colors border-t border-border pt-4"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Featured Products
                    </span>
                    <span className="text-[11px] text-muted-foreground tabular-nums ml-auto">
                      {featuredProducts().length}
                    </span>
                  </Link>
                </div>

                {/* Preview panel */}
                <div className="col-span-6 border-l border-border pl-8">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        {preview.kind === "featured"
                          ? "Highlights"
                          : preview.kind === "brand"
                          ? "Brand Preview"
                          : "Category Preview"}
                      </div>
                      <div className="font-[var(--app-font-heading)] text-lg font-bold mt-1 truncate">
                        {previewTitle}
                      </div>
                    </div>
                    <Link
                      href={previewLink}
                      onClick={() => setMegaOpen(false)}
                      className="text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      View all {previewTotal}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {previewProducts.map((p) => {
                      const b = brandById(p.brand);
                      const c = categoryById(p.category);
                      return (
                        <Link
                          key={p.id}
                          href={previewLink}
                          onClick={() => setMegaOpen(false)}
                          className="group flex items-start gap-3 p-3 border border-border hover:border-foreground/40 hover:bg-muted/40 transition-all"
                          data-testid={`mega-preview-${p.id}`}
                        >
                          <div
                            className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
                            style={{ background: b.accent }}
                          >
                            {b.short.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-0.5 flex items-center gap-1 truncate">
                              {c.icon}
                              <span className="truncate">{c.name}</span>
                            </div>
                            <div className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {p.name}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {preview.kind !== "featured" && (
                    <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                      {preview.kind === "brand"
                        ? brandById(preview.id).blurb
                        : `Filter the catalogue to show only ${categoryById(preview.id).name.toLowerCase()}.`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobile menu ─────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const href = hrefFor(link);
                const onClose = () => {
                  setMenuOpen(false);
                  setMobileProductsOpen(false);
                };
                if (link.hasMega) {
                  return (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-foreground hover:text-primary"
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            mobileProductsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-3 pb-3 border-l border-border ml-1 space-y-3"
                          >
                            <Link
                              href={href}
                              onClick={onClose}
                              className="block text-sm font-semibold text-foreground hover:text-primary py-1"
                            >
                              All products →
                            </Link>
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2 mt-2">
                                Brands
                              </div>
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                {brands.map((b) => (
                                  <Link
                                    key={b.id}
                                    href={`/products?brand=${b.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-2 text-xs text-foreground/80 hover:text-primary py-1"
                                  >
                                    <span
                                      className="w-2 h-2 flex-shrink-0"
                                      style={{ background: b.accent }}
                                    />
                                    {b.short}
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2 mt-3">
                                Categories
                              </div>
                              <div className="grid grid-cols-1 gap-y-1.5">
                                {categories.map((c) => (
                                  <Link
                                    key={c.id}
                                    href={`/products?category=${c.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-2 text-xs text-foreground/80 hover:text-primary py-1"
                                  >
                                    {c.icon}
                                    {c.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return link.isPage ? (
                  <Link
                    key={link.label}
                    href={href}
                    onClick={onClose}
                    className="block py-3 text-sm font-medium text-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={href}
                    onClick={onClose}
                    className="block py-3 text-sm font-medium text-foreground hover:text-primary"
                  >
                    {link.label}
                  </a>
                );
              })}
              <Button asChild className="w-full rounded-none bg-primary text-primary-foreground mt-4">
                <a href={isHome ? "#contact" : "/#contact"} onClick={() => setMenuOpen(false)}>
                  Request a Quote
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
