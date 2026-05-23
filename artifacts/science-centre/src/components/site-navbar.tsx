import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Sparkles, X, Search } from "lucide-react";
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
function img(path: string) { return `${BASE}${path}`; }

const NAV_LINKS = [
  { label: "Solutions",  anchor: "solutions", isPage: false, hasMega: false },
  { label: "Products",   anchor: "products",  isPage: true,  href: "/products", hasMega: true },
  { label: "Partners",   anchor: "partners",  isPage: false, hasMega: false },
  { label: "About",      anchor: "about",     isPage: true,  href: "/about",    hasMega: false },
  { label: "Contact",    anchor: "contact",   isPage: false, hasMega: false },
] as const;

type ActivePanel = "brands" | "categories";

export function SiteNavbar({ visible = true, forceSolid = false }: { visible?: boolean; forceSolid?: boolean }) {
  const [scrolled, setScrolled]               = useState(false);
  const [menuOpen, setMenuOpen]               = useState(false);
  const [megaOpen, setMegaOpen]               = useState(false);
  const [activePanel, setActivePanel]         = useState<ActivePanel>("brands");
  const [activeBrand, setActiveBrand]         = useState(brands[0]?.id ?? "");
  const [activeCategory, setActiveCategory]   = useState(categories[0]?.id ?? "");
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [location] = useLocation();
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isHome   = location === "/";
  const isDarkPage = location === "/about";
  const solid    = forceSolid || scrolled || !isDarkPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => { setMegaOpen(false); setMenuOpen(false); }, [location]);

  // Close on outside click
  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        megaRef.current && !megaRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) { setMegaOpen(false); }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMegaOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [megaOpen]);

  function hrefFor(link: typeof NAV_LINKS[number]) {
    if (link.isPage && "href" in link) return link.href;
    return isHome ? `#${link.anchor}` : `/#${link.anchor}`;
  }

  // What to display in the right product panel
  const panelProducts = activePanel === "brands"
    ? productsByBrand(activeBrand)
    : productsByCategory(activeCategory);

  const panelBrand    = activePanel === "brands" ? brandById(activeBrand) : null;
  const panelCat      = activePanel === "categories" ? categoryById(activeCategory) : null;
  const panelTitle    = panelBrand?.name ?? panelCat?.name ?? "";
  const panelBlurb    = panelBrand?.blurb ?? (panelCat ? `Filter by ${panelCat.name.toLowerCase()}` : "");
  const panelLink     = activePanel === "brands"
    ? `/products?brand=${activeBrand}`
    : `/products?category=${activeCategory}`;

  const closeMega = useCallback(() => setMegaOpen(false), []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        solid ? "bg-background/95 backdrop-blur-lg border-border shadow-sm" : "bg-transparent border-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src={img("/images/sc-logo-full.png")} alt="Science Centre Logo" className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
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
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </motion.span>
            );

            if (link.hasMega) {
              return (
                <div key={link.label} ref={triggerRef} className="py-2">
                  <button
                    onClick={() => setMegaOpen(v => !v)}
                    className="focus:outline-none"
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                  >
                    {Inner}
                  </button>
                </div>
              );
            }
            return link.isPage
              ? <Link key={link.label} href={href}>{Inner}</Link>
              : <a key={link.label} href={href}>{Inner}</a>;
          })}
        </div>

        {/* CTA + hamburger */}
        <motion.div initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="flex items-center gap-3">
          <Button asChild className="hidden lg:flex bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-none px-6">
            <a href={isHome ? "#contact" : "/#contact"}>Request a Quote</a>
          </Button>
          <button className="lg:hidden p-2 text-foreground" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            <motion.div animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-foreground mb-1.5 origin-center" />
            <motion.div animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-5 h-0.5 bg-foreground mb-1.5" />
            <motion.div animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-foreground origin-center" />
          </button>
        </motion.div>
      </div>

      {/* ─── Mega Menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            key="mega"
            ref={megaRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-background border-b border-border shadow-2xl"
          >
            {/* Header bar */}
            <div className="border-b border-border bg-muted/30">
              <div className="container mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="text-xs text-muted-foreground">
                    <strong className="text-foreground">{products.length} products</strong> from {brands.length} manufacturers
                  </span>
                  {/* Panel toggle tabs */}
                  <div className="flex items-center gap-1 bg-background border border-border p-0.5">
                    <button
                      onClick={() => setActivePanel("brands")}
                      className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all ${
                        activePanel === "brands" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      By Brand
                    </button>
                    <button
                      onClick={() => setActivePanel("categories")}
                      className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all ${
                        activePanel === "categories" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      By Category
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/products" onClick={closeMega}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary hover:text-primary/80">
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button onClick={closeMega} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main content: left list + right products */}
            <div className="container mx-auto px-6 md:px-12 py-0">
              <div className="grid grid-cols-12 min-h-[340px]">

                {/* LEFT — Brand or Category list */}
                <div className="col-span-3 border-r border-border py-5 pr-6 overflow-y-auto max-h-[420px]">
                  {activePanel === "brands" ? (
                    <div className="space-y-0.5">
                      {brands.map(b => {
                        const count = productsByBrand(b.id).length;
                        const isActive = activeBrand === b.id;
                        return (
                          <button
                            key={b.id}
                            onMouseEnter={() => setActiveBrand(b.id)}
                            onClick={() => { setActiveBrand(b.id); }}
                            className={`w-full text-left flex items-center justify-between px-3 py-2.5 transition-all group ${
                              isActive ? "bg-primary/8 border-l-2 border-primary" : "hover:bg-muted/60 border-l-2 border-transparent"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="w-2.5 h-2.5 flex-shrink-0" style={{ background: b.accent }} />
                              <span className={`text-[13px] font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{b.name}</span>
                            </span>
                            <span className={`text-[11px] tabular-nums ${isActive ? "text-primary font-bold" : "text-muted-foreground"}`}>{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {categories.map(c => {
                        const count = productsByCategory(c.id).length;
                        const isActive = activeCategory === c.id;
                        return (
                          <button
                            key={c.id}
                            onMouseEnter={() => setActiveCategory(c.id)}
                            onClick={() => setActiveCategory(c.id)}
                            className={`w-full text-left flex items-center justify-between px-3 py-2.5 transition-all ${
                              isActive ? "bg-primary/8 border-l-2 border-primary" : "hover:bg-muted/60 border-l-2 border-transparent"
                            }`}
                          >
                            <span className="flex items-center gap-2.5 text-foreground">
                              <span className={`${isActive ? "text-primary" : "text-muted-foreground"}`}>{c.icon}</span>
                              <span className={`text-[13px] font-semibold ${isActive ? "text-primary" : ""}`}>{c.name}</span>
                            </span>
                            <span className={`text-[11px] tabular-nums ${isActive ? "text-primary font-bold" : "text-muted-foreground"}`}>{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* RIGHT — Products panel */}
                <div className="col-span-9 py-5 pl-8">
                  {/* Panel header */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                        {activePanel === "brands" ? "Brand" : "Category"}
                      </div>
                      <h3 className="font-[var(--app-font-heading)] text-lg font-black text-foreground">{panelTitle}</h3>
                      {panelBlurb && <p className="text-[12px] text-muted-foreground mt-0.5 max-w-sm">{panelBlurb}</p>}
                    </div>
                    <Link href={panelLink} onClick={closeMega}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary hover:text-primary/80 flex-shrink-0">
                      View all {panelProducts.length} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Product grid — 3 columns */}
                  <div className="grid grid-cols-3 gap-2">
                    {panelProducts.slice(0, 9).map(p => {
                      const b = brandById(p.brand);
                      const c = categoryById(p.category);
                      return (
                        <Link
                          key={p.id}
                          href={`/products/${p.id}`}
                          onClick={closeMega}
                          className="group flex items-start gap-3 p-3 border border-border hover:border-primary/40 hover:bg-primary/3 transition-all"
                        >
                          <div
                            className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white"
                            style={{ background: b.accent }}
                          >
                            {b.short.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-0.5 flex items-center gap-1">
                              {c.icon} <span className="truncate">{c.name}</span>
                            </div>
                            <div className="text-[12px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {p.name}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Featured row at bottom */}
                  {panelProducts.length === 0 && (
                    <div className="text-sm text-muted-foreground py-8 text-center">No products in this selection.</div>
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
                const onClose = () => { setMenuOpen(false); setMobileProductsOpen(false); };
                if (link.hasMega) {
                  return (
                    <div key={link.label}>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-foreground hover:text-primary"
                      >
                        {link.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileProductsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-3 pb-3 border-l-2 border-primary/20 ml-1 space-y-4"
                          >
                            <Link href="/products" onClick={onClose} className="block text-sm font-bold text-primary py-1 mt-2">
                              Browse All Products →
                            </Link>

                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">By Brand</div>
                              <div className="space-y-0.5">
                                {brands.map(b => (
                                  <Link key={b.id} href={`/products?brand=${b.id}`} onClick={onClose}
                                    className="flex items-center gap-2.5 text-[13px] text-foreground/80 hover:text-primary py-1.5 px-2 hover:bg-muted/50 transition-colors">
                                    <span className="w-2 h-2 flex-shrink-0" style={{ background: b.accent }} />
                                    <span className="font-medium">{b.name}</span>
                                    <span className="ml-auto text-[11px] text-muted-foreground">{productsByBrand(b.id).length}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">By Category</div>
                              <div className="grid grid-cols-2 gap-x-3">
                                {categories.map(c => (
                                  <Link key={c.id} href={`/products?category=${c.id}`} onClick={onClose}
                                    className="flex items-center gap-2 text-[12px] text-foreground/80 hover:text-primary py-1.5">
                                    {c.icon} <span>{c.name}</span>
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
                return link.isPage
                  ? <Link key={link.label} href={href} onClick={onClose} className="block py-3 text-sm font-medium text-foreground hover:text-primary">{link.label}</Link>
                  : <a key={link.label} href={href} onClick={onClose} className="block py-3 text-sm font-medium text-foreground hover:text-primary">{link.label}</a>;
              })}
              <Button asChild className="w-full rounded-none bg-primary text-primary-foreground mt-4">
                <a href={isHome ? "#contact" : "/#contact"} onClick={() => setMenuOpen(false)}>Request a Quote</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
