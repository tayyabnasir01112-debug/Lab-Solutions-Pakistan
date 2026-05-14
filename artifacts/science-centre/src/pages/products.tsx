import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Filter,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import {
  brands,
  categories,
  products,
  brandById,
  categoryById,
  type Product,
} from "@/lib/catalogue";

/* ─── Filter sidebar section ──────────────────────────────────── */

function FilterSection({
  title,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3 group"
      >
        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground">
          {title}
          {count !== undefined && (
            <span className="ml-2 text-muted-foreground font-normal normal-case tracking-normal text-xs">
              ({count})
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
  swatch,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
  swatch?: string;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center justify-between w-full text-left py-1.5 group"
      data-testid={`filter-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
    >
      <span className="flex items-center gap-3 min-w-0">
        <span
          className={`relative w-[18px] h-[18px] flex-shrink-0 border-2 transition-colors ${
            checked
              ? "bg-primary border-primary"
              : "bg-background border-border group-hover:border-foreground/40"
          }`}
        >
          {checked && (
            <svg
              className="absolute inset-0 m-auto"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6.5L4.5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          )}
        </span>
        {swatch && (
          <span
            className="w-3 h-3 flex-shrink-0"
            style={{ background: swatch }}
          />
        )}
        <span
          className={`text-sm truncate ${
            checked ? "text-foreground font-medium" : "text-foreground/80 group-hover:text-foreground"
          }`}
        >
          {label}
        </span>
      </span>
      <span className="text-xs text-muted-foreground tabular-nums ml-2 flex-shrink-0">
        {count}
      </span>
    </button>
  );
}

/* ─── Product card (visual, image-forward) ────────────────────── */

function ProductCard({ product, index }: { product: Product; index: number }) {
  const brand = brandById(product.brand);
  const category = categoryById(product.category);
  const initials = product.name
    .replace(/[®™©]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.25), ease: [0.16, 1, 0.3, 1] }}
      className="group bg-background border border-border hover:border-foreground/30 transition-all duration-300"
      data-testid={`product-card-${product.id}`}
    >
      {/* Visual area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white border-b border-border">
        {/* brand accent strip at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] z-10"
          style={{ background: brand.accent }}
        />
        {/* big brand monogram — shown only when no image */}
        {!product.image && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
            <div className="flex flex-col items-center gap-3">
              <div
                className="font-[var(--app-font-heading)] font-bold tracking-tight leading-none select-none"
                style={{
                  color: brand.accent,
                  opacity: 0.18,
                  fontSize: "clamp(70px, 12vw, 120px)",
                }}
              >
                {initials}
              </div>
            </div>
          </div>
        )}
        {/* actual product image */}
        {product.image && (
          <div className="absolute inset-0 flex items-center justify-center p-5 pt-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
              style={{
                filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.13)) drop-shadow(0 1px 4px rgba(0,0,0,0.07))",
              }}
            />
          </div>
        )}
        {/* subtle bottom vignette to ground the image */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.04), transparent)" }}
        />
        {/* top tags */}
        <div className="absolute top-4 left-3 right-3 flex items-start justify-between gap-2">
          <span
            className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
            style={{ background: brand.accent }}
          >
            {brand.short}
          </span>
          {product.featured && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] bg-foreground text-background flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>
        {/* hover overlay with view + inquire */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="rounded-none w-full text-xs uppercase tracking-[0.14em] font-semibold h-10 bg-background/90 backdrop-blur-sm">
              View Details
            </Button>
          </Link>
          <Link href="/#contact" className="flex-1">
            <Button className="rounded-none w-full bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.14em] font-semibold h-10">
              Inquire <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
      {/* card text */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.12em] mb-2">
          {category.icon}
          <span className="truncate">{category.name}</span>
        </div>
        <h3 className="font-[var(--app-font-heading)] text-[15px] font-semibold leading-snug text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Cytek Premium Card ──────────────────────────────────────── */

function CytekCard({ product, index }: { product: Product; index: number }) {
  const category = categoryById(product.category);
  const CYTEK_ACCENT = "#5E2A84";

  // Extract a key metric to display as a badge (e.g. "64 Channels", "40 Colors")
  const keyMetric = product.specs
    ? product.specs["Fluorescence Channels"]
      ? { label: "Channels", value: product.specs["Fluorescence Channels"] }
      : product.specs["Max Colors Demonstrated"]
        ? { label: "Colors", value: product.specs["Max Colors Demonstrated"].replace(" colors", "").replace(" demonstrated", "") }
        : product.specs["Launched"]
          ? { label: "Launched", value: product.specs["Launched"] }
          : null
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.25), ease: [0.16, 1, 0.3, 1] }}
      className="group bg-[#080810] border border-white/8 hover:border-[#5E2A84]/50 transition-all duration-400 overflow-hidden"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image area — dark, dramatic */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Layered dark gradient bg */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #12051f 60%, #0a0a14 100%)" }} />

        {/* Subtle dot-grid — tech feel */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle, rgba(94,42,132,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${CYTEK_ACCENT}, transparent)` }} />

        {/* Product image or branded placeholder */}
        {product.image ? (
          <div className="absolute inset-0 flex items-center justify-center p-5">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
              style={{ filter: "drop-shadow(0 8px 24px rgba(94,42,132,0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {/* Glowing ring */}
            <div className="w-16 h-16 rounded-full border border-[#5E2A84]/40 flex items-center justify-center"
              style={{ boxShadow: "0 0 40px rgba(94,42,132,0.25), inset 0 0 20px rgba(94,42,132,0.1)" }}>
              <div className="w-8 h-8 rounded-full border border-[#5E2A84]/60"
                style={{ boxShadow: "0 0 20px rgba(94,42,132,0.4)" }} />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">Cytek Biosciences</span>
          </div>
        )}

        {/* Top-left brand tag */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
            style={{ background: CYTEK_ACCENT }}>Cytek</span>
          {product.featured && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] bg-white/10 text-white/90 flex items-center gap-1 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />Featured
            </span>
          )}
        </div>

        {/* Key metric badge — top right */}
        {keyMetric && (
          <div className="absolute top-3 right-3 text-right">
            <div className="text-xl font-black text-white leading-none" style={{ textShadow: `0 0 20px ${CYTEK_ACCENT}` }}>
              {keyMetric.value}
            </div>
            <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40">{keyMetric.label}</div>
          </div>
        )}

        {/* Hover CTAs */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="rounded-none w-full text-xs uppercase tracking-[0.14em] font-semibold h-10 bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-white/10">
              View Details
            </Button>
          </Link>
          <Link href="/#contact" className="flex-1">
            <Button className="rounded-none w-full text-xs uppercase tracking-[0.14em] font-semibold h-10 text-white hover:opacity-90"
              style={{ background: CYTEK_ACCENT }}>
              Inquire <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Text area */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-[0.12em] mb-2">
          {category?.icon}
          <span className="truncate">{category?.name}</span>
        </div>
        <h3 className="font-[var(--app-font-heading)] text-[15px] font-semibold leading-snug text-white mb-1.5 line-clamp-2 cursor-pointer"
          style={{ transition: "color 0.2s" }}>
          <Link href={`/products/${product.id}`} className="hover:text-[#a855f7] transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-[13px] text-white/35 leading-relaxed line-clamp-2">{product.description}</p>
      </div>
    </motion.div>
  );
}

type SortKey = "featured" | "name" | "brand";

export default function Products() {
  const [splashDone] = useState(true);
  const [query, setQuery] = useState("");
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [activeCats, setActiveCats] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Parse ?brand= and ?category= URL params on mount so navbar mega-menu can deep-link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brandParam = params.get("brand");
    const catParam = params.get("category");
    const featuredParam = params.get("featured");
    if (brandParam) setActiveBrands(brandParam.split(",").filter(Boolean));
    if (catParam) setActiveCats(catParam.split(",").filter(Boolean));
    if (featuredParam === "1") setFeaturedOnly(true);
    window.scrollTo(0, 0);
  }, []);

  const toggleBrand = (id: string) =>
    setActiveBrands((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleCat = (id: string) =>
    setActiveCats((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const clearAll = () => {
    setActiveBrands([]);
    setActiveCats([]);
    setFeaturedOnly(false);
    setQuery("");
  };

  // Brand & category counts (respect search query but ignore other facet selections — typical ecommerce behavior)
  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (!q) return true;
      const b = brandById(p.brand).name.toLowerCase();
      const c = categoryById(p.category).name.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        b.includes(q) ||
        c.includes(q) ||
        (p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
      );
    });
  }, [query]);

  const brandCounts = useMemo(() => {
    const m = new Map<string, number>();
    brands.forEach((b) => m.set(b.id, 0));
    baseFiltered.forEach((p) => m.set(p.brand, (m.get(p.brand) || 0) + 1));
    return m;
  }, [baseFiltered]);

  const catCounts = useMemo(() => {
    const m = new Map<string, number>();
    categories.forEach((c) => m.set(c.id, 0));
    baseFiltered.forEach((p) => m.set(p.category, (m.get(p.category) || 0) + 1));
    return m;
  }, [baseFiltered]);

  const filtered = useMemo(() => {
    let list = baseFiltered;
    if (activeBrands.length) list = list.filter((p) => activeBrands.includes(p.brand));
    if (activeCats.length) list = list.filter((p) => activeCats.includes(p.category));
    if (featuredOnly) list = list.filter((p) => p.featured);

    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "brand")
      sorted.sort((a, b) => brandById(a.brand).short.localeCompare(brandById(b.brand).short));
    else
      sorted.sort((a, b) => {
        if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
        return a.name.localeCompare(b.name);
      });
    return sorted;
  }, [baseFiltered, activeBrands, activeCats, featuredOnly, sort]);

  const activeFilterCount =
    activeBrands.length + activeCats.length + (featuredOnly ? 1 : 0) + (query ? 1 : 0);

  /* ─── Sidebar (shared between desktop sticky + mobile drawer) ── */
  const Sidebar = (
    <div>
      {/* search */}
      <div className="pb-5 border-b border-border">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground mb-3">
          Search
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Product, brand, application..."
            className="rounded-none border-border pl-10 h-11 text-sm focus-visible:ring-0 focus-visible:border-foreground"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* featured toggle */}
      <div className="border-b border-border py-5">
        <CheckRow
          label="Featured products only"
          count={products.filter((p) => p.featured).length}
          checked={featuredOnly}
          onChange={() => setFeaturedOnly(!featuredOnly)}
        />
      </div>

      {/* brand filter */}
      <FilterSection
        title="Brand"
        count={activeBrands.length || undefined}
      >
        {brands.map((b) => (
          <CheckRow
            key={b.id}
            label={b.short}
            count={brandCounts.get(b.id) || 0}
            checked={activeBrands.includes(b.id)}
            onChange={() => toggleBrand(b.id)}
            swatch={b.accent}
          />
        ))}
      </FilterSection>

      {/* category filter */}
      <FilterSection
        title="Category"
        count={activeCats.length || undefined}
      >
        {categories.map((c) => (
          <CheckRow
            key={c.id}
            label={c.name}
            count={catCounts.get(c.id) || 0}
            checked={activeCats.includes(c.id)}
            onChange={() => toggleCat(c.id)}
          />
        ))}
      </FilterSection>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="mt-5 w-full text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground border border-border hover:border-foreground py-3 transition-colors"
          data-testid="button-clear-all"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <SiteNavbar visible={splashDone} />

      {/* Compact title bar */}
      <section className="pt-28 pb-6 border-b border-border bg-background">
        <div className="px-6 md:px-10 lg:px-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Products</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-[var(--app-font-heading)] text-4xl md:text-5xl font-bold tracking-tight leading-none">
                All Products
              </h1>
              <p className="text-muted-foreground mt-3 text-sm md:text-base max-w-2xl">
                {products.length} instruments, reagents and consumables from {brands.length} of the
                world's most trusted manufacturers.
              </p>
            </div>
          </div>

          {/* Quick-access category pills — always visible at top */}
          <div className="mt-7 -mx-1">
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Shop by Category
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((c) => {
                const active = activeCats.includes(c.id);
                const count = products.filter((p) => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCat(c.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-2 px-4 h-10 border text-sm font-medium transition-all ${
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground border-border hover:border-foreground"
                    }`}
                    data-testid={`quick-cat-${c.id}`}
                  >
                    {c.icon}
                    <span className="whitespace-nowrap">{c.name}</span>
                    <span className={`text-[11px] tabular-nums ${active ? "text-background/70" : "text-muted-foreground"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick-access brand pills */}
          <div className="mt-3 -mx-1">
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Shop by Brand
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {brands.map((b) => {
                const active = activeBrands.includes(b.id);
                const count = products.filter((p) => p.brand === b.id).length;
                return (
                  <button
                    key={b.id}
                    onClick={() => toggleBrand(b.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-2 px-4 h-10 border text-sm font-medium transition-all ${
                      active
                        ? "text-background border-transparent"
                        : "bg-background text-foreground border-border hover:border-foreground"
                    }`}
                    style={active ? { background: b.accent } : undefined}
                    data-testid={`quick-brand-${b.id}`}
                  >
                    <span
                      className="w-2.5 h-2.5"
                      style={{ background: active ? "rgba(255,255,255,0.9)" : b.accent }}
                    />
                    <span className="whitespace-nowrap">{b.short}</span>
                    <span className={`text-[11px] tabular-nums ${active ? "text-background/70" : "text-muted-foreground"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky toolbar */}
      <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-6 md:px-10 lg:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 h-10 border border-border hover:border-foreground text-sm font-semibold uppercase tracking-[0.12em]"
              data-testid="button-mobile-filters"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 min-w-[20px] text-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="text-sm">
              <span className="font-bold text-foreground tabular-nums" data-testid="text-result-count">
                {filtered.length}
              </span>
              <span className="text-muted-foreground"> of {products.length} products</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Sort
            </span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-none appearance-none bg-background border border-border pl-3 pr-9 h-10 text-sm font-medium focus:outline-none focus:border-foreground cursor-pointer"
                data-testid="select-sort"
              >
                <option value="featured">Featured first</option>
                <option value="name">Name (A-Z)</option>
                <option value="brand">Brand</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="px-6 md:px-10 lg:px-12 pb-3 flex flex-wrap items-center gap-2">
            {query && (
              <FilterChip label={`"${query}"`} onRemove={() => setQuery("")} />
            )}
            {featuredOnly && (
              <FilterChip label="Featured" onRemove={() => setFeaturedOnly(false)} />
            )}
            {activeBrands.map((id) => (
              <FilterChip
                key={id}
                label={brandById(id).short}
                onRemove={() => toggleBrand(id)}
              />
            ))}
            {activeCats.map((id) => (
              <FilterChip
                key={id}
                label={categoryById(id).name}
                onRemove={() => toggleCat(id)}
              />
            ))}
            <button
              onClick={clearAll}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground underline underline-offset-4 ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main split layout */}
      <main className="px-6 md:px-10 lg:px-12 py-8">
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-[160px]">{Sidebar}</div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="border border-border p-16 text-center">
                <h3 className="font-[var(--app-font-heading)] text-2xl font-bold mb-3">
                  No products match your filters
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Try removing a filter — or talk to us. We carry hundreds of additional SKUs
                  beyond what's listed online.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={clearAll}
                    className="rounded-none bg-foreground text-background hover:bg-foreground/90"
                  >
                    Clear all filters
                  </Button>
                  <Button asChild variant="outline" className="rounded-none border-border">
                    <Link href="/#contact">Talk to us</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    p.brand === "cytek"
                      ? <CytekCard key={p.id} product={p} index={i} />
                      : <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-foreground text-background mt-12">
        <div className="px-6 md:px-10 lg:px-12 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-background/60 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Authorized distributor
            </div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-4xl font-bold leading-tight">
              Don't see what you need?
            </h2>
            <p className="text-background/70 mt-4 max-w-md leading-relaxed">
              Our portfolio extends well beyond what's listed online. Send us your specs and our
              applications team will source the right configuration for your lab.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild className="rounded-none bg-background text-foreground hover:bg-background/90 px-8 h-12 text-sm uppercase tracking-[0.14em] font-semibold">
              <Link href="/#contact">
                Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none border-background/30 hover:bg-background/10 hover:text-background px-8 h-12 text-sm uppercase tracking-[0.14em] font-semibold text-background">
              <Link href="/#contact">Talk to Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-foreground/50 z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 w-[320px] max-w-[85vw] bg-background z-50 lg:hidden overflow-y-auto"
            >
              <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center justify-between">
                <span className="font-[var(--app-font-heading)] text-lg font-bold">Filters</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-muted"
                  data-testid="button-close-filters"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="px-5 pb-8">{Sidebar}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}

/* ─── Active filter chip ──────────────────────────────────────── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 bg-muted border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-primary"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
