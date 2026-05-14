import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ChevronRight,
  FlaskConical, Tag, FileText, Layers, ImageIcon, Package,
  Zap, Activity, Settings2, Target
} from "lucide-react";
import { productById, brandById, categoryById, productsByBrand, type Product } from "@/lib/catalogue";

function Reveal({ children }: { children: React.ReactNode; delay?: number }) {
  return <div>{children}</div>;
}

/* ─── Cytek-style Related Card ─────────────────────────────────── */
function CytekRelatedCard({ product }: { product: Product }) {
  const cat = categoryById(product.category);
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group border border-[#e8e8e8] hover:border-[#508484] transition-colors duration-300 bg-white overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="aspect-[4/3] bg-[#f8f8f8] flex items-center justify-center p-6 overflow-hidden">
          {product.image
            ? <img src={product.image} alt={product.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
            : <div className="w-16 h-16 rounded-full border-2 border-[#508484]/30 flex items-center justify-center"><Settings2 className="h-6 w-6 text-[#508484]/40" /></div>
          }
        </div>
        {/* Text */}
        <div className="px-5 py-4 border-t border-[#f0f0f0]">
          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#508484] mb-2">{cat?.name}</div>
          <h4 className="font-[var(--app-font-heading)] font-bold text-[15px] leading-snug text-[#333] group-hover:text-[#508484] transition-colors mb-1">{product.name}</h4>
          <p className="text-[#707070] text-[13px] line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-1 mt-3 text-[#E99E2A] text-[12px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Learn More <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Cytek Premium Detail ─────────────────────────────────────── */

function CytekProductDetail({ product }: { product: Product }) {
  const category = categoryById(product.category);
  const related = (product.relatedProducts || []).map(rid => productById(rid)).filter(Boolean) as Product[];
  const moreBrand = productsByBrand(product.brand).filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id)).slice(0, 3 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);

  // Tab state — Overview vs Performance Data
  const [tab, setTab] = useState<"overview" | "performance">("overview");

  // Key stats extracted from specs
  const stats: { label: string; value: string }[] = [];
  if (product.specs) {
    const s = product.specs;
    if (s["Fluorescence Channels"]) stats.push({ label: "Fluorescence Channels", value: s["Fluorescence Channels"] });
    if (s["Laser Lines"]) {
      const m = s["Laser Lines"].match(/Up to (\d+)/)?.[1] || s["Laser Lines"].match(/^(\d+)/)?.[1];
      if (m) stats.push({ label: "Laser Lines", value: `Up to ${m}` });
    }
    if (s["Max Colors Demonstrated"]) stats.push({ label: "Colors Demonstrated", value: s["Max Colors Demonstrated"] });
    if (s["Imaging Channels"]) stats.push({ label: "Imaging Channels", value: s["Imaging Channels"] });
    if (s["Footprint"]) stats.push({ label: "Form Factor", value: s["Footprint"] });
    if (s["Regulatory Status"]) stats.push({ label: "Regulatory", value: "Clinically Cleared" });
    if (s["Launched"]) stats.push({ label: "Launched", value: s["Launched"] });
    if (s["Award"]) stats.push({ label: "Recognition", value: "2025 Award Winner" });
  }
  const displayStats = stats.slice(0, 4);

  // Feature card icons (mapping index to icon)
  const cardIcons = [<Zap className="h-8 w-8" />, <Activity className="h-8 w-8" />, <Target className="h-8 w-8" />, <FlaskConical className="h-8 w-8" />, <Settings2 className="h-8 w-8" />, <Layers className="h-8 w-8" />];

  return (
    <div className="min-h-[100dvh] bg-white text-[#333]">
      {/* Teal navbar to match Cytek brand */}
      <SiteNavbar forceSolid />

      <main>
        {/* ═══════════════════════════════════════════════════════
            HERO — full bleed, background image, instrument photo
        ════════════════════════════════════════════════════════ */}
        <div className="relative min-h-[580px] flex items-center overflow-hidden"
          style={{
            backgroundImage: product.heroBg ? `url(${product.heroBg})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: product.heroBg ? undefined : "#2a4a4a",
          }}>
          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.2) 100%)" }} />

          <div className="relative z-10 w-full">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-28 pb-16 grid lg:grid-cols-2 gap-0 items-center">
              {/* Left: text */}
              <div className="pr-0 lg:pr-12">
                {/* Breadcrumb */}
                <div className="text-[13px] font-bold text-white mb-4 tracking-wide">
                  PRODUCTS &amp; SERVICES
                </div>

                {/* Product name — 60px like Cytek */}
                <h1 className="font-[var(--app-font-heading)] font-bold text-white leading-none mb-5"
                  style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "-0.5px" }}>
                  {product.name}
                </h1>

                {/* Subtitle — 28px, light weight */}
                {product.subtitle && (
                  <p className="text-white font-light mb-8 max-w-lg leading-snug"
                    style={{ fontSize: "clamp(18px,2.2vw,28px)" }}>
                    {product.subtitle}
                  </p>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <a href="/#contact"
                    className="inline-flex items-center px-7 py-3.5 text-[13px] font-bold tracking-wide text-white border-2 border-white hover:bg-white hover:text-[#508484] transition-colors duration-200">
                    PRODUCT BROCHURE
                  </a>
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-[13px] font-bold tracking-wide"
                    style={{ color: "#E99E2A" }}>
                    REQUEST MORE INFORMATION <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Right: large instrument image */}
              <div className="hidden lg:flex items-end justify-center relative" style={{ minHeight: "380px" }}>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative z-10 object-contain"
                    style={{
                      maxHeight: "500px",
                      maxWidth: "100%",
                      filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.5))",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            TAB NAVIGATION — OVERVIEW | PERFORMANCE DATA
        ════════════════════════════════════════════════════════ */}
        <div className="border-b border-[#e0e0e0] sticky top-0 z-20 bg-white shadow-sm">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center gap-0">
            <button
              onClick={() => setTab("overview")}
              className={`py-4 px-6 text-[13px] font-bold tracking-[0.12em] uppercase border-b-[3px] transition-colors duration-200 ${tab === "overview" ? "border-[#508484] text-[#508484]" : "border-transparent text-[#707070] hover:text-[#508484]"}`}>
              Overview
            </button>
            {product.gallery && product.gallery.length > 0 && (
              <button
                onClick={() => setTab("performance")}
                className={`py-4 px-6 text-[13px] font-bold tracking-[0.12em] uppercase border-b-[3px] transition-colors duration-200 ${tab === "performance" ? "border-[#508484] text-[#508484]" : "border-transparent text-[#707070] hover:text-[#508484]"}`}>
                Performance Data
              </button>
            )}
            {/* Spacer then back link */}
            <div className="ml-auto">
              <Link href="/products" className="flex items-center gap-1.5 text-[12px] font-bold text-[#707070] hover:text-[#508484] transition-colors py-4">
                <ArrowLeft className="h-3.5 w-3.5" /> All Products
              </Link>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            OVERVIEW TAB
        ════════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <>
            {/* ── Key Stats bar ──────────────────────────────── */}
            {displayStats.length > 0 && (
              <div className="bg-[#f8f8f8] border-b border-[#e8e8e8]">
                <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                  <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(displayStats.length, 4)} divide-x divide-[#e8e8e8]`}>
                    {displayStats.map((stat, i) => (
                      <div key={i} className="px-8 py-6 text-center">
                        <div className="text-2xl md:text-3xl font-black text-[#508484] leading-none mb-1">{stat.value}</div>
                        <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#707070]">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Our Product section heading ─────────────────── */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-14 pb-4">
              <h2 className="font-[var(--app-font-heading)] font-bold text-[#508484]" style={{ fontSize: "34px" }}>
                Our Product
              </h2>
            </div>

            {/* ── High-level overview ─────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 pb-10">
              <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-start">
                <div>
                  <h3 className="font-[var(--app-font-heading)] font-bold text-[#508484] mb-5" style={{ fontSize: "24px" }}>
                    High Level Overview
                  </h3>
                  <p className="text-[#707070] text-[16px] leading-relaxed mb-4">{product.description}</p>
                  {product.subtitle && (
                    <p className="text-[#508484] text-[16px] font-semibold italic">{product.subtitle}</p>
                  )}
                </div>
                {/* Mobile: instrument image here */}
                <div className="lg:hidden flex justify-center">
                  {product.image && <img src={product.image} alt={product.name} className="max-h-64 object-contain" />}
                </div>
                {/* Specs quick-reference */}
                {product.specs && (
                  <div className="border border-[#e8e8e8] bg-[#fafafa]">
                    <div className="px-6 py-4 border-b border-[#e8e8e8] bg-[#508484]">
                      <span className="text-white font-bold text-[13px] tracking-[0.1em] uppercase">Specifications</span>
                    </div>
                    <div className="divide-y divide-[#eee]">
                      {Object.entries(product.specs).slice(0, 8).map(([k, v]) => (
                        <div key={k} className="px-6 py-3 flex justify-between gap-4">
                          <span className="text-[#707070] text-[13px] font-semibold flex-shrink-0">{k}</span>
                          <span className="text-[#333] text-[13px] text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Feature cards — 3-column like Cytek ────────── */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="bg-[#fafafa] border-y border-[#e8e8e8]" style={{ padding: "80px 0 64px" }}>
                <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {product.highlights.slice(0, 6).map((h, i) => (
                      <div key={i} className="group">
                        <div className="text-[#508484] mb-4 opacity-70">{cardIcons[i % cardIcons.length]}</div>
                        <h3 className="font-[var(--app-font-heading)] font-bold text-[#508484] mb-3" style={{ fontSize: "20px" }}>
                          {h.split("—")[0].split(" — ")[0].split(":")[0].slice(0, 50)}
                        </h3>
                        <p className="text-[#707070] text-[15px] leading-relaxed">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Technology section ──────────────────────────── */}
            {(product.features || product.applications) && (
              <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
                <div className="grid lg:grid-cols-2 gap-16">
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="font-[var(--app-font-heading)] font-bold text-[#508484] mb-6" style={{ fontSize: "24px" }}>
                        Technology &amp; Features
                      </h3>
                      <div className="space-y-4">
                        {product.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-4 pb-4 border-b border-[#f0f0f0] last:border-0">
                            <div className="w-2 h-2 rounded-full bg-[#508484] flex-shrink-0 mt-2" />
                            <p className="text-[#707070] text-[15px] leading-relaxed">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.applications && product.applications.length > 0 && (
                    <div>
                      <h3 className="font-[var(--app-font-heading)] font-bold text-[#508484] mb-6" style={{ fontSize: "24px" }}>
                        Applications
                      </h3>
                      <div className="space-y-4">
                        {product.applications.map((a, i) => (
                          <div key={i} className="flex items-start gap-4 pb-4 border-b border-[#f0f0f0] last:border-0">
                            <div className="w-2 h-2 rounded-full bg-[#E99E2A] flex-shrink-0 mt-2" />
                            <p className="text-[#707070] text-[15px] leading-relaxed">{a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── CTA Banner ──────────────────────────────────── */}
            <div className="bg-[#508484] py-16">
              <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <p className="text-white/70 text-[13px] font-bold tracking-[0.15em] uppercase mb-2">Cytek Biosciences — Distributed by Science Centre Pakistan</p>
                  <h2 className="font-[var(--app-font-heading)] font-bold text-white leading-tight" style={{ fontSize: "clamp(24px,3vw,36px)" }}>
                    Ready to discuss {product.name}?
                  </h2>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[13px] font-bold tracking-wide bg-white text-[#508484] hover:bg-[#f0f0f0] transition-colors">
                    REQUEST A QUOTE <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[13px] font-bold tracking-wide border-2 border-white text-white hover:bg-white/10 transition-colors">
                    SCHEDULE A DEMO
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════
            PERFORMANCE DATA TAB
        ════════════════════════════════════════════════════════ */}
        {tab === "performance" && product.gallery && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <h2 className="font-[var(--app-font-heading)] font-bold text-[#508484] mb-2" style={{ fontSize: "34px" }}>Performance Data</h2>
            <p className="text-[#707070] text-[16px] mb-10">Real-world instrument performance from Cytek Biosciences.</p>
            <div className="space-y-12">
              {product.gallery.map((src, i) => (
                <div key={i} className="border border-[#e8e8e8] overflow-hidden">
                  <img
                    src={src}
                    alt={`${product.name} performance data ${i + 1}`}
                    className="w-full object-contain bg-white"
                    style={{ maxHeight: "550px" }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            RELATED INSTRUMENTS (always visible)
        ════════════════════════════════════════════════════════ */}
        {allRelated.length > 0 && (
          <div className="bg-[#fafafa] border-t border-[#e8e8e8] py-14">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16">
              <h3 className="font-[var(--app-font-heading)] font-bold text-[#508484] mb-8" style={{ fontSize: "24px" }}>
                Related Instruments
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allRelated.map(p => <CytekRelatedCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  // CRITICAL: reset body overflow from homepage fullpage scroll
  useEffect(() => {
    document.body.style.overflow = "";
    document.body.style.height = "";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {};
  }, [id]);

  const product = productById(id);
  if (!product) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <SiteNavbar />
        <main className="container mx-auto px-6 md:px-12 py-40 text-center">
          <h1 className="text-4xl font-bold mb-4">Product not found</h1>
          <Link href="/products"><Button variant="outline" className="rounded-none">← Back to Products</Button></Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Route Cytek products to premium dark detail page
  if (product.brand === "cytek") {
    return <CytekProductDetail product={product} />;
  }

  const brand = brandById(product.brand);
  const category = categoryById(product.category);
  const related = (product.relatedProducts || []).map(rid => productById(rid)).filter(Boolean) as Product[];
  const moreBrand = productsByBrand(product.brand).filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id)).slice(0, 3 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);

  return (
    <div className="min-h-[100dvh] bg-background">
      <SiteNavbar />
      <main className="pt-28 pb-24">

        {/* Breadcrumb */}
        <div className="container mx-auto px-6 md:px-12 mb-10">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            {product.subcategory && <><span>{product.subcategory}</span><ChevronRight className="h-3 w-3 flex-shrink-0" /></>}
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="container mx-auto px-6 md:px-12 mb-16">
          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* Product image */}
            <div className="lg:col-span-4">
              <Reveal>
                <div className="border border-border relative overflow-hidden bg-muted/20 group"
                  style={{ aspectRatio: "1 / 1" }}>
                  {/* Brand accent top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 z-10"
                    style={{ backgroundColor: brand?.accent || "hsl(var(--primary))" }} />
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-10" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground/30">
                      <ImageIcon className="h-20 w-20" strokeWidth={0.8} />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-muted-foreground/50">Product Image</p>
                        <p className="text-xs text-muted-foreground/30 mt-1">Coming soon</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Brand strip */}
                <div className="mt-3 flex items-center gap-3 p-4 border border-border">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: brand?.accent }} />
                  <div>
                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Manufactured by</div>
                    <div className="text-sm font-bold text-foreground mt-0.5">{brand?.name}</div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Product info */}
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5"
                    style={{ color: brand?.accent, background: (brand?.accent || "#000") + "15", border: `1px solid ${brand?.accent || "#000"}25` }}>
                    {brand?.short}
                  </span>
                  {category && (
                    <span className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 flex items-center gap-1.5">
                      {category.icon} {category.name}
                    </span>
                  )}
                  {product.featured && <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5">★ Featured</span>}
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="text-3xl md:text-4xl font-[var(--app-font-heading)] font-black text-foreground leading-tight tracking-tight mb-6">
                  {product.name}
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-muted-foreground text-base font-light leading-relaxed mb-8">{product.description}</p>
              </Reveal>

              {product.highlights && product.highlights.length > 0 && (
                <Reveal delay={0.15}>
                  <div className="space-y-2.5 mb-8">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="rounded-none bg-primary text-white hover:bg-primary/90 px-8 group">
                    <a href="/#contact">
                      Request a Quote <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-none px-6">
                    <a href="/#contact">Talk to a Specialist</a>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="rounded-none px-6 text-muted-foreground">
                    <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> All Products</Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Quick spec sidebar */}
            <div className="lg:col-span-3">
              <Reveal delay={0.1}>
                <div className="border border-border p-6 sticky top-28">
                  <div className="h-0.5 -mt-6 -mx-6 mb-6"
                    style={{ backgroundColor: brand?.accent || "hsl(var(--primary))", width: "calc(100% + 3rem)" }} />

                  {product.catalogueNumber && (
                    <div className="flex items-start gap-2 mb-5 pb-5 border-b border-border">
                      <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-0.5">Catalogue No.</div>
                        <div className="font-mono font-bold text-foreground text-sm">{product.catalogueNumber}</div>
                      </div>
                    </div>
                  )}

                  {product.specs && (
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-3">Key Specs</div>
                      {Object.entries(product.specs).slice(0, 6).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2 text-xs py-2.5 border-b border-border/50 last:border-0">
                          <span className="text-muted-foreground font-medium">{k}</span>
                          <span className="text-foreground font-semibold text-right">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {product.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-border">
                      {product.tags.slice(0, 6).map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-muted text-muted-foreground uppercase tracking-wide">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ── Packaging Table (vhbio.com style) ─────────────── */}
        {product.packaging && product.packaging.length > 0 && (
          <div className="border-t border-b border-border bg-muted/20 py-14">
            <div className="container mx-auto px-6 md:px-12">
              <Reveal>
                <div className="flex items-center gap-2 mb-8">
                  <Package className="h-4 w-4 text-primary" />
                  <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Packaging & Ordering Information</h2>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="border border-border bg-background overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="text-left px-6 py-4 text-xs font-bold tracking-[0.1em] uppercase text-muted-foreground">Product</th>
                        <th className="text-left px-6 py-4 text-xs font-bold tracking-[0.1em] uppercase text-muted-foreground w-28">Units</th>
                        <th className="text-left px-6 py-4 text-xs font-bold tracking-[0.1em] uppercase text-muted-foreground w-40 hidden md:table-cell">Format</th>
                        <th className="text-right px-6 py-4 w-32"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.packaging.map((pkg, i) => (
                        <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-5">
                            <div className="font-semibold text-foreground">{pkg.name}</div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">{pkg.catalogueNumber}</div>
                          </td>
                          <td className="px-6 py-5 text-muted-foreground">{pkg.units}</td>
                          <td className="px-6 py-5 text-muted-foreground hidden md:table-cell">{pkg.format || "—"}</td>
                          <td className="px-6 py-5 text-right">
                            <a href="/#contact" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/70 transition-colors">
                              Enquire <ArrowRight className="h-3 w-3" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-border bg-muted/30">
                        <td colSpan={4} className="px-6 py-3 text-xs text-muted-foreground">
                          Showing {product.packaging.length} Product{product.packaging.length !== 1 ? "s" : ""}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Reveal>
            </div>
          </div>
        )}

        {/* ── Features / Applications / Specs ───────────────── */}
        {(product.features || product.applications || product.specs) && (
          <div className="border-t border-border">
            <div className="container mx-auto px-6 md:px-12 py-16 grid lg:grid-cols-3 gap-16">
              {product.features && product.features.length > 0 && (
                <Reveal>
                  <div className="flex items-center gap-2 mb-6">
                    <Layers className="h-4 w-4 text-primary" />
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Features</h2>
                  </div>
                  <ul className="space-y-3">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <span className="text-foreground leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
              {product.applications && product.applications.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="flex items-center gap-2 mb-6">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Applications</h2>
                  </div>
                  <ul className="space-y-3">
                    {product.applications.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <span className="text-foreground leading-relaxed">{a}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <Reveal delay={0.15}>
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="h-4 w-4 text-primary" />
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Full Specifications</h2>
                  </div>
                  <div>
                    {Object.entries(product.specs).map(([k, v], i, arr) => (
                      <div key={k} className={`flex justify-between gap-4 text-sm py-3 ${i < arr.length - 1 ? "border-b border-border/50" : ""}`}>
                        <span className="text-muted-foreground font-medium">{k}</span>
                        <span className="text-foreground font-semibold text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        )}

        {/* ── CTA ───────────────────────────────────────────── */}
        <div className="bg-foreground py-14">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">Get in Touch</div>
              <h3 className="text-2xl md:text-3xl font-[var(--app-font-heading)] font-black text-white leading-tight">
                Interested in {product.name.split(" ").slice(0, 4).join(" ")}?
              </h3>
              <p className="text-white/50 text-sm font-light mt-2 max-w-md">
                Our technical specialists are ready to discuss your requirements and provide a quotation.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-none bg-primary text-white hover:bg-primary/90 px-8 flex-shrink-0 font-bold">
              <a href="/#contact">Request a Quote <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </div>

        {/* ── Related Products ───────────────────────────────── */}
        {allRelated.length > 0 && (
          <div className="container mx-auto px-6 md:px-12 pt-16">
            <Reveal>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2">You May Also Need</div>
                  <h3 className="text-2xl font-[var(--app-font-heading)] font-black text-foreground">Related Products</h3>
                </div>
                <Link href="/products">
                  <Button variant="outline" className="rounded-none text-sm">Browse All <ArrowRight className="ml-2 h-3.5 w-3.5" /></Button>
                </Link>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {allRelated.map((p, i) => (
                <Reveal key={p.id} delay={0.05 * i}><RelatedCard product={p} /></Reveal>
              ))}
            </div>
          </div>
        )}

      </main>
      <SiteFooter />
    </div>
  );
}
