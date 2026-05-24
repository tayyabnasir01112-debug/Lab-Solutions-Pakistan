import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, ChevronRight, ExternalLink, X, Globe, Building2 } from "lucide-react";
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
  { label: "Solutions", anchor: "solutions", isPage: false, hasMega: false },
  { label: "Products",  anchor: "products",  isPage: true,  href: "/products", hasMega: true },
  { label: "Partners",  anchor: "partners",  isPage: false, hasMega: false },
  { label: "About",     anchor: "about",     isPage: true,  href: "/about",    hasMega: false },
  { label: "Contact",   anchor: "contact",   isPage: false, hasMega: false },
] as const;

// Get unique categories for a brand, sorted by product count
function brandCategories(brandId: string) {
  const prods = productsByBrand(brandId);
  const catCount: Record<string, number> = {};
  prods.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1; });
  return Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .map(([catId, count]) => ({ cat: categoryById(catId), count, products: prods.filter(p => p.category === catId) }))
    .filter(x => x.cat);
}

export function SiteNavbar({ visible = true, forceSolid = false }: { visible?: boolean; forceSolid?: boolean }) {
  const [scrolled, setScrolled]             = useState(false);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [megaOpen, setMegaOpen]             = useState(false);
  const [activeBrand, setActiveBrand]       = useState(brands[0]?.id ?? "");
  const [expandedCat, setExpandedCat]       = useState<string | null>(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [location]                          = useLocation();
  const megaRef   = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isHome    = location === "/";
  const isDarkPage = location === "/about";
  const solid     = forceSolid || scrolled || !isDarkPage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMegaOpen(false); setMenuOpen(false); }, [location]);

  // Lock page scroll when mega menu is open
  useEffect(() => {
    if (megaOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [megaOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        megaRef.current && !megaRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMegaOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [megaOpen]);

  // Reset expanded cat when brand changes
  useEffect(() => { setExpandedCat(null); }, [activeBrand]);

  function hrefFor(link: typeof NAV_LINKS[number]) {
    if (link.isPage && "href" in link) return link.href;
    return isHome ? `#${link.anchor}` : `/#${link.anchor}`;
  }

  const closeMega = useCallback(() => setMegaOpen(false), []);
  const currentBrand   = brandById(activeBrand);
  const brandCats      = brandCategories(activeBrand);
  const brandProdCount = productsByBrand(activeBrand).length;

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
                className="relative hover:text-primary transition-colors group cursor-pointer inline-flex items-center gap-1.5"
                initial={{ opacity: 0, y: -8 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              >
                {link.label}
                {link.hasMega && (
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </motion.span>
            );

            if (link.hasMega) {
              return (
                <button
                  key={link.label}
                  ref={triggerRef}
                  onClick={() => setMegaOpen(v => !v)}
                  className="py-2 focus:outline-none"
                  aria-expanded={megaOpen}
                >
                  {Inner}
                </button>
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
          <button className="lg:hidden p-2" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            <motion.div animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-foreground mb-1.5 origin-center" />
            <motion.div animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-5 h-0.5 bg-foreground mb-1.5" />
            <motion.div animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="w-5 h-0.5 bg-foreground origin-center" />
          </button>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MEGA MENU
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            key="mega"
            ref={megaRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-background border-b border-border shadow-2xl" onWheel={e => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="border-b border-border/60 bg-muted/20">
              <div className="container mx-auto px-6 md:px-12 h-11 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground font-bold">{products.length}</strong> products across{" "}
                  <strong className="text-foreground font-bold">{brands.length}</strong> world-class manufacturers
                </span>
                <div className="flex items-center gap-4">
                  <Link href="/products" onClick={closeMega}
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary hover:text-primary/80 inline-flex items-center gap-1">
                    Browse All <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button onClick={closeMega} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close menu">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Body: brand list (left) + brand detail panel (right) */}
            <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-12" style={{ height: "430px" }}>

                {/* ── LEFT: Brand list ────────────────────────── */}
                <div className="col-span-3 border-r border-border py-3 pr-3 overflow-y-auto h-full" style={{ overscrollBehavior: "contain" }} onWheel={e => e.stopPropagation()}>
                  <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground px-3 mb-3">Manufacturers</div>
                  <div className="space-y-0.5">
                    {brands.map(b => {
                      const count = productsByBrand(b.id).length;
                      const isActive = activeBrand === b.id;
                      return (
                        <button
                          key={b.id}
                          onMouseEnter={() => setActiveBrand(b.id)}
                          onClick={() => setActiveBrand(b.id)}
                          className={`w-full text-left flex items-center gap-3 px-3 py-3 transition-all rounded-sm group relative ${
                            isActive
                              ? "bg-foreground text-background"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="brandActive"
                              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                              style={{ background: b.accent }}
                              transition={{ type: "spring", stiffness: 500, damping: 40 }}
                            />
                          )}

                          {/* Brand colour swatch / logo */}
                          <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center overflow-hidden"
                            style={{ background: isActive ? "rgba(255,255,255,0.15)" : b.accent + "15", border: `1px solid ${b.accent}30` }}>
                            {b.logo ? (
                              <img src={b.logo} alt={b.short} className="w-full h-full object-contain p-1"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <span className="text-[9px] font-black" style={{ color: isActive ? "#fff" : b.accent }}>
                                {b.short.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className={`text-[13px] font-semibold leading-tight truncate ${isActive ? "text-background" : "text-foreground"}`}>
                              {b.short}
                            </div>
                            <div className={`text-[10px] tabular-nums mt-0.5 ${isActive ? "text-background/60" : "text-muted-foreground"}`}>
                              {count} {count === 1 ? "product" : "products"}
                            </div>
                          </div>

                          <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${isActive ? "text-background/60 translate-x-0.5" : "text-muted-foreground/40"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── RIGHT: Brand detail panel ───────────────── */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBrand}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="col-span-9 overflow-y-auto h-full py-4 pl-6 pr-2 flex flex-col" style={{ overscrollBehavior: "contain" }} onWheel={e => e.stopPropagation()}
                  >
                    {/* Brand intro card */}
                    <div className="flex items-start gap-5 mb-4 pb-4 border-b border-border flex-shrink-0">
                      {/* Logo zone */}
                      <div className="flex-shrink-0 w-36 h-16 flex items-center justify-center rounded-sm border border-border overflow-hidden"
                        style={{ background: currentBrand.accent + "08" }}>
                        {currentBrand.logo ? (
                          <img src={currentBrand.logo} alt={currentBrand.name}
                            className="max-w-full max-h-full object-contain p-3"
                            onError={(e) => {
                              const el = e.target as HTMLImageElement;
                              el.style.display = "none";
                              el.parentElement!.innerHTML = `<span style="font-size:22px;font-weight:900;color:${currentBrand.accent};letter-spacing:-1px;padding:12px">${currentBrand.short}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-2xl font-black tracking-tight px-4" style={{ color: currentBrand.accent }}>
                            {currentBrand.short}
                          </span>
                        )}
                      </div>

                      {/* Brand info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-[var(--app-font-heading)] font-black text-[15px] text-foreground leading-tight">
                            {currentBrand.name}
                          </h3>
                        </div>
                        <p className="text-[12px] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                          {currentBrand.longBlurb || currentBrand.blurb}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          {currentBrand.founded && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              Est. {currentBrand.founded}
                            </span>
                          )}
                          {currentBrand.hq && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Globe className="h-3 w-3" />
                              {currentBrand.hq}
                            </span>
                          )}
                          <Link href={`/products?brand=${activeBrand}`} onClick={closeMega}
                            className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] px-3 py-1.5 text-white transition-colors flex-shrink-0"
                            style={{ background: currentBrand.accent }}>
                            All {brandProdCount} Products <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Categories with expandable product lists */}
                    <div className="flex-1 min-h-0">
                      <div className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-3">
                        Product Categories
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {brandCats.map(({ cat, count, products: catProds }) => {
                          const isExpanded = expandedCat === cat.id;
                          return (
                            <div key={cat.id} className="border border-border overflow-hidden">
                              {/* Category header — click to expand */}
                              <button
                                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                                className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-all group ${
                                  isExpanded ? "bg-foreground text-background" : "hover:bg-muted/60"
                                }`}
                              >
                                <span className={`text-base transition-colors ${isExpanded ? "text-background/70" : "text-muted-foreground"}`}>
                                  {cat.icon}
                                </span>
                                <span className={`flex-1 text-[13px] font-semibold text-left ${isExpanded ? "text-background" : "text-foreground"}`}>
                                  {cat.name}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                                  isExpanded ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                                }`}>
                                  {count}
                                </span>
                                <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90 text-background/60" : "text-muted-foreground/40"}`} />
                              </button>

                              {/* Expanded product list */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden border-t border-border"
                                  >
                                    <div className="divide-y divide-border/50 bg-muted/20">
                                      {catProds.slice(0, 5).map(p => (
                                        <Link
                                          key={p.id}
                                          href={`/products/${p.id}`}
                                          onClick={closeMega}
                                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-background transition-colors group"
                                        >
                                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: currentBrand.accent }} />
                                          <span className="text-[12px] text-foreground/80 group-hover:text-primary transition-colors leading-snug flex-1 line-clamp-1">
                                            {p.name}
                                          </span>
                                          <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/30 group-hover:text-primary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                      ))}
                                      {catProds.length > 5 && (
                                        <Link
                                          href={`/products?brand=${activeBrand}&category=${cat.id}`}
                                          onClick={closeMega}
                                          className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-primary hover:bg-background transition-colors"
                                        >
                                          +{catProds.length - 5} more <ArrowRight className="h-3 w-3" />
                                        </Link>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
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
                                    className="flex items-center gap-2.5 text-[13px] text-foreground/80 hover:text-primary py-1.5 px-2 hover:bg-muted/50 transition-colors rounded-sm">
                                    <span className="w-2 h-2 flex-shrink-0 rounded-full" style={{ background: b.accent }} />
                                    <span className="font-medium flex-1">{b.short}</span>
                                    <span className="text-[11px] text-muted-foreground">{productsByBrand(b.id).length}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">By Category</div>
                              <div className="grid grid-cols-2 gap-x-3">
                                {categories.map(c => (
                                  <Link key={c.id} href={`/products?category=${c.id}`} onClick={onClose}
                                    className="flex items-center gap-2 text-[12px] text-foreground/80 hover:text-primary py-1.5 rounded-sm">
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
