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
import { productById, brandById, categoryById, productsByBrand, type Product, type KitItem, type FeatureCard } from "@/lib/catalogue";

function Reveal({ children }: { children: React.ReactNode; delay?: number }) {
  return <div>{children}</div>;
}

/* ─── Cytek-style Related Card ─────────────────────────────────── */
function RelatedCard({ product }: { product: Product }) {
  const brand = brandById(product.brand);
  return (
    <Link href={`/products/${product.id}`}>
      <motion.div className="border border-border p-5 cursor-pointer group relative overflow-hidden h-full bg-background hover:border-primary/40 transition-colors"
        whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
        <div className="text-xs font-bold tracking-wide uppercase mb-2 px-2 py-0.5 inline-block"
          style={{ color: brand?.accent, background: (brand?.accent || "#000") + "18" }}>{brand?.short}</div>
        <h4 className="font-[var(--app-font-heading)] font-bold text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors">{product.name}</h4>
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 mt-3 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          View Product <ArrowRight className="h-3 w-3" />
        </div>
      </motion.div>
    </Link>
  );
}



/* ─── Cytek Premium Detail ─────────────────────────────────────── */

function ProductMedia({ product }: { product: Product }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!product.image || imageFailed) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <ImageIcon className="h-14 w-14 text-muted-foreground/30" />
        <span className="text-xs font-semibold uppercase tracking-wide">Product image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-contain p-4"
      onError={() => setImageFailed(true)}
    />
  );
}

function CytekProductDetail({ product }: { product: Product }) {
  const category = categoryById(product.category);
  const related = (product.relatedProducts || []).map(rid => productById(rid)).filter(Boolean) as Product[];
  const moreBrand = productsByBrand(product.brand).filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id)).slice(0, 3 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);

  // Tab state — Overview vs Performance Data
  const [tab, setTab] = useState<"overview" | "performance" | "kits">("overview");

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
                <div className="text-[13px] font-bold text-white/70 mb-4 tracking-wide flex items-center gap-2">
                  <span className="text-white/40">Science Centre Pakistan</span>
                  <span className="text-white/30">›</span>
                  <span className="text-white">Cytek Biosciences</span>
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
                  {product.brochure && (
                    <a href={product.brochure} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 text-[13px] font-bold tracking-wide text-white border-2 border-white hover:bg-white hover:text-[#2c5f5f] transition-colors duration-200">
                      <FileText className="h-4 w-4" /> PRODUCT BROCHURE
                    </a>
                  )}
                  {product.specSheet && (
                    <a href={product.specSheet} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 text-[13px] font-bold tracking-wide text-white border-2 border-white/40 hover:border-white hover:bg-white/10 transition-colors duration-200">
                      <FileText className="h-4 w-4" /> TECHNICAL SPECIFICATIONS
                    </a>
                  )}
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
            TAB NAVIGATION — distinct button style, not merged
        ════════════════════════════════════════════════════════ */}
        <div className="border-b border-[#e0e0e0] bg-white shadow-sm sticky top-0 z-20">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center gap-3 py-3">
            <button
              onClick={() => setTab("overview")}
              className={`px-5 py-2.5 text-[12px] font-bold tracking-[0.12em] uppercase rounded-sm transition-all duration-200 ${
                tab === "overview"
                  ? "bg-[#2c5f5f] text-white shadow-md"
                  : "bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0]"
              }`}>
              Overview
            </button>
            {product.gallery && product.gallery.length > 0 && (
              <button
                onClick={() => setTab("performance")}
                className={`px-5 py-2.5 text-[12px] font-bold tracking-[0.12em] uppercase rounded-sm transition-all duration-200 ${
                  tab === "performance"
                    ? "bg-[#2c5f5f] text-white shadow-md"
                    : "bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0]"
                }`}>
                Performance Data
              </button>
            )}
            {product.kits && product.kits.length > 0 && (
              <button
                onClick={() => setTab("kits")}
                className={`px-5 py-2.5 text-[12px] font-bold tracking-[0.12em] uppercase rounded-sm transition-all duration-200 ${
                  tab === "kits"
                    ? "bg-[#2c5f5f] text-white shadow-md"
                    : "bg-[#f0f0f0] text-[#555] hover:bg-[#e0e0e0]"
                }`}>
                Kits &amp; Options
              </button>
            )}
            <div className="ml-auto">
              <Link href="/products" className="flex items-center gap-1.5 text-[12px] font-bold text-[#707070] hover:text-[#2c5f5f] transition-colors py-2">
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
                        <div className="text-2xl md:text-3xl font-black text-[#2c5f5f] leading-none mb-1">{stat.value}</div>
                        <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#707070]">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Our Product section heading ─────────────────── */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-14 pb-4">
              <h2 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f]" style={{ fontSize: "34px" }}>
                Our Product
              </h2>
            </div>

            {/* ── High-level overview ─────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 pb-10">
              <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-start">
                <div>
                  <h3 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f] mb-5" style={{ fontSize: "24px" }}>
                    High Level Overview
                  </h3>
                  <p className="text-[#707070] text-[16px] leading-relaxed mb-4">{product.description}</p>
                  {product.subtitle && (
                    <p className="text-[#2c5f5f] text-[16px] font-semibold italic">{product.subtitle}</p>
                  )}
                </div>
                {/* Mobile: instrument image here */}
                <div className="lg:hidden flex justify-center">
                  {product.image && <img src={product.image} alt={product.name} className="max-h-64 object-contain" />}
                </div>
                {/* Specs quick-reference */}
                {product.specs && (
                  <div className="border border-[#e8e8e8] bg-[#fafafa]">
                    <div className="px-6 py-4 border-b border-[#e8e8e8] bg-[#2c5f5f]">
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

            {/* ── Feature cards — proper title + body ────────── */}
            {(product.featureCards || product.highlights) && (
              <div className="bg-[#fafafa] border-y border-[#e8e8e8]" style={{ padding: "72px 0 64px" }}>
                <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
                    {product.featureCards
                      ? product.featureCards.map((card, i) => (
                          <div key={i} className="group">
                            <div className="text-[#2c5f5f] mb-4 opacity-60">{cardIcons[i % cardIcons.length]}</div>
                            <h3 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f] mb-3 leading-snug" style={{ fontSize: "19px" }}>
                              {card.title}
                            </h3>
                            <p className="text-[#707070] text-[15px] leading-relaxed">{card.body}</p>
                          </div>
                        ))
                      : product.highlights!.slice(0, 6).map((h, i) => (
                          <div key={i} className="group">
                            <div className="text-[#2c5f5f] mb-4 opacity-60">{cardIcons[i % cardIcons.length]}</div>
                            <p className="text-[#707070] text-[15px] leading-relaxed">{h}</p>
                          </div>
                        ))
                    }
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
                      <h3 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f] mb-6" style={{ fontSize: "24px" }}>
                        Technology &amp; Features
                      </h3>
                      <div className="space-y-4">
                        {product.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-4 pb-4 border-b border-[#f0f0f0] last:border-0">
                            <div className="w-2 h-2 rounded-full bg-[#2c5f5f] flex-shrink-0 mt-2" />
                            <p className="text-[#707070] text-[15px] leading-relaxed">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.applications && product.applications.length > 0 && (
                    <div>
                      <h3 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f] mb-6" style={{ fontSize: "24px" }}>
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

            {/* ── CTA Banner — Science Centre brand identity ─── */}
            <div className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" }}>
              <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-0.5 bg-[#E99E2A]" />
                    <span className="text-[#E99E2A] text-[11px] font-black tracking-[0.3em] uppercase">Authorised Distributor · Pakistan</span>
                  </div>
                  <h2 className="font-[var(--app-font-heading)] font-bold text-white leading-tight mb-2" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
                    Interested in {product.name}?
                  </h2>
                  <p className="text-white/50 text-[14px]">Our specialists provide demos, quotes, and local installation support across Pakistan.</p>
                </div>
                <div className="flex gap-3 flex-shrink-0 flex-wrap">
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-black tracking-[0.15em] uppercase bg-[#E99E2A] text-[#0f2027] hover:bg-[#f5ab35] transition-colors">
                    REQUEST A QUOTE <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-black tracking-[0.15em] uppercase border-2 border-white/30 text-white hover:bg-white/10 transition-colors">
                    SCHEDULE A DEMO
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════
            KITS & OPTIONS TAB
        ════════════════════════════════════════════════════════ */}
        {tab === "kits" && product.kits && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <h2 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f] mb-2" style={{ fontSize: "34px" }}>Kits, Reagents &amp; Options</h2>
            <p className="text-[#707070] text-[16px] mb-10">Available kits, reagents, and instrument options for the {product.name}. Contact Science Centre Pakistan for pricing and availability.</p>
            <div className="grid md:grid-cols-2 gap-5">
              {product.kits.map((kit, i) => (
                <div key={i} className="border border-[#e0e0e0] bg-white p-6 hover:border-[#2c5f5f] hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f] text-[16px] leading-snug group-hover:text-[#1a4040] transition-colors">
                      {kit.name}
                    </h3>
                    {kit.catalogueNumber && (
                      <span className="flex-shrink-0 text-[11px] font-bold text-[#999] bg-[#f5f5f5] px-2.5 py-1 border border-[#e8e8e8] tracking-wide">
                        {kit.catalogueNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-[#707070] text-[14px] leading-relaxed mb-4">{kit.description}</p>
                  <a href="/#contact"
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#2c5f5f] hover:text-[#1a4040] transition-colors">
                    Enquire <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            PERFORMANCE DATA TAB
        ════════════════════════════════════════════════════════ */}
        {tab === "performance" && product.gallery && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <h2 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f] mb-2" style={{ fontSize: "34px" }}>Performance Data</h2>
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
              <h3 className="font-[var(--app-font-heading)] font-bold text-[#2c5f5f] mb-8" style={{ fontSize: "24px" }}>
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

/* ─── NgeneBio Clinical Detail Page ───────────────────────────── */

function NgeneBioProductDetail({ product }: { product: Product }) {
  const category = categoryById(product.category);
  const related = (product.relatedProducts || []).map(rid => productById(rid)).filter(Boolean) as Product[];
  const moreBrand = productsByBrand(product.brand).filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id)).slice(0, 3 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);
  const [tab, setTab] = useState<"overview" | "specs" | "applications">("overview");
  const RED = "#C8002D";
  const LIGHT_RED = "#fff1f2";

  const isInfection = product.category === "molecular" && (product.tags || []).some(t => ["tuberculosis","COVID-19","influenza","infection"].includes(t));
  const isSoftware = product.id === "ngene-analyser";

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    ...(product.specs ? [{ key: "specs" as const, label: "Specifications" }] : []),
    ...(product.applications?.length ? [{ key: "applications" as const, label: "Applications" }] : []),
  ];

  return (
    <div className="min-h-[100dvh] bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <main>

        {/* ═══ HERO — white with bold red left panel ════════════ */}
        <div className="pt-20 border-b border-[#e8e8e8]">
          {/* Top red band */}
          <div className="h-1.5 bg-[#C8002D]" />
          <div className="max-w-[1400px] mx-auto px-8 md:px-16">
            <div className="grid lg:grid-cols-[1fr_380px] gap-0 min-h-[420px]">

              {/* Left: content */}
              <div className="py-12 pr-0 lg:pr-16 border-r border-[#f0f0f0] flex flex-col justify-center">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[11px] text-[#aaa] mb-6">
                  <Link href="/" className="hover:text-[#C8002D] transition-colors">Home</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link href="/products" className="hover:text-[#C8002D] transition-colors">Products</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-[#888] truncate max-w-[180px]">{product.name}</span>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-3 py-1.5 text-[11px] font-black tracking-[0.18em] uppercase text-white bg-[#C8002D]">NgeneBio</span>
                  <span className="px-3 py-1.5 text-[11px] font-bold text-[#007a52] border border-[#007a52]/40 bg-[#007a52]/8 tracking-wide">✓ CE-IVD Certified</span>
                  {product.featured && <span className="px-3 py-1.5 text-[11px] font-bold text-[#b45309] border border-[#b45309]/30 bg-amber-50">★ Featured</span>}
                  {category && <span className="px-3 py-1.5 text-[11px] text-[#888] border border-[#e8e8e8] flex items-center gap-1.5">{category.icon} {category.name}</span>}
                </div>

                {/* Name */}
                <h1 className="font-[var(--app-font-heading)] font-black text-[#111] leading-tight tracking-tight mb-3"
                  style={{ fontSize: "clamp(28px,4vw,48px)" }}>
                  {product.name}
                </h1>

                {/* Subtitle */}
                {product.subtitle && (
                  <p className="text-[#C8002D] font-bold text-[14px] mb-4 tracking-wide">{product.subtitle}</p>
                )}

                <p className="text-[#555] text-[15px] leading-relaxed mb-8 max-w-lg">{product.description}</p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-7 py-3 text-[12px] font-black tracking-[0.15em] uppercase text-white bg-[#C8002D] hover:bg-[#a30024] transition-colors">
                    REQUEST A QUOTE <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-7 py-3 text-[12px] font-bold tracking-[0.1em] uppercase border-2 border-[#C8002D] text-[#C8002D] hover:bg-[#C8002D] hover:text-white transition-colors">
                    SPEAK TO A SPECIALIST
                  </a>
                  <Link href="/products">
                    <button className="inline-flex items-center gap-1.5 px-4 py-3 text-[12px] font-bold text-[#aaa] hover:text-[#C8002D] transition-colors">
                      <ArrowLeft className="h-3.5 w-3.5" /> All Products
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right: red info panel */}
              <div className="hidden lg:flex flex-col bg-[#C8002D] relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/10" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border border-white/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5" />

                <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                  {/* Product type label */}
                  <div>
                    <div className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 mb-6">
                      {isSoftware ? "Analysis Software" : isInfection ? "Infection Diagnostics" : "Precision Diagnostics"}
                    </div>

                    {/* Key specs from the specs object */}
                    {product.specs && (
                      <div className="space-y-4">
                        {Object.entries(product.specs).slice(0, 5).map(([k, v]) => (
                          <div key={k} className="border-b border-white/15 pb-4 last:border-0">
                            <div className="text-[9px] font-black tracking-[0.2em] uppercase text-white/40 mb-1">{k}</div>
                            <div className="text-white font-semibold text-[13px] leading-snug">{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom distributor badge */}
                  <div className="border border-white/20 p-4 bg-white/5">
                    <div className="text-[9px] font-black tracking-[0.2em] uppercase text-white/50 mb-1">Authorised Distributor</div>
                    <div className="text-white font-bold text-[13px]">Science Centre Pakistan</div>
                    <div className="text-white/40 text-[11px] mt-0.5">Local support · Installation · Training</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TAB NAV ══════════════════════════════════════════ */}
        <div className="bg-white border-b border-[#e8e8e8] sticky top-0 z-20 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center gap-3 py-3">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 text-[12px] font-bold tracking-[0.12em] uppercase transition-all duration-200 border ${
                  tab === t.key
                    ? "bg-[#C8002D] text-white border-[#C8002D] shadow"
                    : "bg-white text-[#666] border-[#ddd] hover:border-[#C8002D]/50 hover:text-[#C8002D]"
                }`}>
                {t.label}
              </button>
            ))}
            <div className="ml-auto">
              <Link href="/products" className="flex items-center gap-1.5 text-[12px] font-bold text-[#aaa] hover:text-[#C8002D] transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> All Products
              </Link>
            </div>
          </div>
        </div>

        {/* ═══ OVERVIEW TAB ═════════════════════════════════════ */}
        {tab === "overview" && (
          <>
            {/* Feature cards — numbered, white on light-red bg */}
            {product.featureCards && (
              <div className="py-16 bg-[#fff8f8] border-b border-[#f0e0e0]">
                <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-[#C8002D]" />
                    <h2 className="font-[var(--app-font-heading)] font-black text-[#111] text-[24px]">Key Capabilities</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {product.featureCards.map((card, i) => (
                      <div key={i} className="bg-white border border-[#e8e8e8] p-6 hover:border-[#C8002D]/40 hover:shadow-md transition-all duration-200 group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-9 h-9 bg-[#C8002D] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-black text-[13px]">{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <h3 className="font-[var(--app-font-heading)] font-bold text-[#111] text-[15px] leading-snug group-hover:text-[#C8002D] transition-colors">{card.title}</h3>
                        </div>
                        <p className="text-[#666] text-[14px] leading-relaxed pl-12">{card.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Features + Regulatory trust — two columns */}
            {product.features && (
              <div className="py-14 border-b border-[#eee]">
                <div className="max-w-[1400px] mx-auto px-8 md:px-16 grid lg:grid-cols-2 gap-12">
                  <div>
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-1.5 h-6 bg-[#C8002D]" />
                      <h2 className="font-[var(--app-font-heading)] font-bold text-[#111] text-[20px]">Technical Features</h2>
                    </div>
                    <ul className="space-y-0 border border-[#eee]">
                      {product.features.map((f, i) => (
                        <li key={i} className={`flex items-start gap-3 px-5 py-3.5 border-b border-[#f5f5f5] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                          <CheckCircle2 className="h-4 w-4 text-[#C8002D] flex-shrink-0 mt-0.5" />
                          <span className="text-[#444] text-[14px] leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-1.5 h-6 bg-[#C8002D]" />
                      <h2 className="font-[var(--app-font-heading)] font-bold text-[#111] text-[20px]">Regulatory & Certifications</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        { badge: "CE-IVD", label: "European Regulatory Clearance", body: "Certified for in vitro diagnostic use in the European Union — meeting the highest international clinical validation standards.", color: "#007a52" },
                        { badge: "MFDS", label: "Korean Ministry Approval", body: "Approved by Korea's Ministry of Food and Drug Safety — the first market to clear NgeneBio's precision diagnostic panels.", color: "#1d4ed8" },
                        { badge: "Illumina", label: "Platform Validated", body: "Validated on Illumina MiSeq, MiSeqDx, and MiniSeq — the standard NGS platforms deployed in clinical laboratories worldwide.", color: "#7c3aed" },
                        { badge: "NGeneAnalySys®", label: "Integrated Software Pipeline", body: "Automated ASCO/CAP/AMP-compliant bioinformatics pipeline — from sequencing data to formatted clinical report.", color: "#C8002D" },
                      ].map((item, i) => (
                        <div key={i} className="border border-[#eee] bg-white flex items-start gap-4 p-4 hover:border-[#C8002D]/30 transition-colors">
                          <div className="flex-shrink-0">
                            <span className="inline-block px-2.5 py-1.5 text-[10px] font-black tracking-wide text-white" style={{ backgroundColor: item.color }}>
                              {item.badge}
                            </span>
                          </div>
                          <div>
                            <div className="text-[12px] font-bold text-[#333] mb-0.5">{item.label}</div>
                            <p className="text-[#777] text-[12px] leading-relaxed">{item.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Banner — white + red */}
            <div className="border-t-4 border-[#C8002D] py-14 bg-[#fafafa]">
              <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-0.5 bg-[#C8002D]" />
                    <span className="text-[#C8002D] text-[10px] font-black tracking-[0.3em] uppercase">Authorised Distributor · Pakistan</span>
                  </div>
                  <h2 className="font-[var(--app-font-heading)] font-black text-[#111] leading-tight" style={{ fontSize: "clamp(20px,3vw,32px)" }}>
                    Bring NgeneBio to Your Laboratory
                  </h2>
                  <p className="text-[#666] text-[14px] mt-1">Local support, installation & training across Pakistan.</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-black tracking-[0.15em] uppercase bg-[#C8002D] text-white hover:bg-[#a30024] transition-colors">
                    REQUEST A QUOTE <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-bold tracking-[0.1em] uppercase border-2 border-[#C8002D] text-[#C8002D] hover:bg-[#C8002D] hover:text-white transition-colors">
                    SCHEDULE A DEMO
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ SPECS TAB ════════════════════════════════════════ */}
        {tab === "specs" && product.specs && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-[#C8002D]" />
              <h2 className="font-[var(--app-font-heading)] font-bold text-[#111] text-[22px]">Full Specifications</h2>
            </div>
            <div className="border border-[#e8e8e8] overflow-hidden max-w-3xl">
              {Object.entries(product.specs).map(([k, v], i) => (
                <div key={k} className={`flex flex-col sm:flex-row sm:items-start gap-3 px-6 py-4 border-b border-[#f0f0f0] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                  <span className="text-[11px] font-black text-[#C8002D] uppercase tracking-wide sm:w-56 flex-shrink-0 mt-0.5">{k}</span>
                  <span className="text-[14px] text-[#333] leading-relaxed">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ APPLICATIONS TAB ════════════════════════════════ */}
        {tab === "applications" && product.applications && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-[#C8002D]" />
              <h2 className="font-[var(--app-font-heading)] font-bold text-[#111] text-[22px]">Clinical Applications</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {product.applications.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white border border-[#e8e8e8] hover:border-[#C8002D]/40 hover:bg-[#fff8f8] transition-all group">
                  <div className="w-6 h-6 bg-[#C8002D] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-[14px] text-[#444] leading-relaxed">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ RELATED PRODUCTS ════════════════════════════════ */}
        {allRelated.length > 0 && (
          <div className="bg-[#fff8f8] border-t border-[#f0e0e0] py-14">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-[#C8002D]" />
                <h3 className="font-[var(--app-font-heading)] font-bold text-[#111] text-[20px]">Related Products</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allRelated.map(p => {
                  const cat = categoryById(p.category);
                  return (
                    <Link key={p.id} href={`/products/${p.id}`}>
                      <div className="group border border-[#e8e8e8] bg-white p-5 hover:border-[#C8002D]/50 hover:shadow-md transition-all cursor-pointer">
                        <div className="h-1 bg-[#C8002D] -mx-5 -mt-5 mb-5" />
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2 py-0.5 text-[9px] font-black tracking-[0.15em] uppercase text-white bg-[#C8002D]">NgeneBio</span>
                          <span className="px-2 py-0.5 text-[9px] font-bold text-[#007a52] border border-[#007a52]/30">CE-IVD</span>
                        </div>
                        <h4 className="font-[var(--app-font-heading)] font-bold text-[14px] text-[#111] group-hover:text-[#C8002D] transition-colors mb-2 leading-snug">{p.name}</h4>
                        <p className="text-[12px] text-[#888] line-clamp-2 leading-relaxed">{p.description}</p>
                        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#C8002D] opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>
      <SiteFooter />
    </div>
  );
}

/* ─── Sugentech POCT Detail Page ──────────────────────────────── */

function SugentechProductDetail({ product }: { product: Product }) {
  const category = categoryById(product.category);
  const related = (product.relatedProducts || []).map(rid => productById(rid)).filter(Boolean) as Product[];
  const moreBrand = productsByBrand(product.brand).filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id)).slice(0, 3 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);
  const [tab, setTab] = useState<"overview" | "specs" | "applications" | "kits">("overview");
  const BLUE = "#0057A8";
  const LIGHT = "#f0f6ff";

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    ...(product.specs ? [{ key: "specs" as const, label: "Specifications" }] : []),
    ...(product.applications?.length ? [{ key: "applications" as const, label: "Applications" }] : []),
    ...(product.kits?.length ? [{ key: "kits" as const, label: "Kits & Reagents" }] : []),
  ];

  return (
    <div className="min-h-[100dvh] bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="border-b border-[#dce8f5]" style={{ background: "linear-gradient(135deg, #f0f6ff 0%, #e8f1fb 50%, #f8fbff 100%)" }}>
          <div className="h-1.5 bg-[#0057A8]" />
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-16 pb-14">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] text-[#aaa] mb-8">
              <Link href="/" className="hover:text-[#0057A8] transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/products" className="hover:text-[#0057A8] transition-colors">Products</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#0057A8] font-semibold truncate max-w-[200px]">{product.name}</span>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] xl:grid-cols-[minmax(0,1fr)_minmax(340px,460px)_300px] gap-8 xl:gap-10 items-center">
              <div>
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-3 py-1.5 text-[11px] font-black tracking-[0.15em] uppercase text-white bg-[#0057A8]">Sugentech</span>
                  <span className="px-3 py-1.5 text-[11px] font-bold text-[#007a52] border border-[#007a52]/40 bg-white tracking-wide">✓ CE-IVD</span>
                  {product.featured && <span className="px-3 py-1.5 text-[11px] font-bold text-amber-600 border border-amber-300 bg-amber-50">★ Featured</span>}
                  {category && <span className="px-3 py-1.5 text-[11px] text-[#777] border border-[#dce8f5] bg-white flex items-center gap-1.5">{category.icon} {category.name}</span>}
                </div>

                <h1 className="font-[var(--app-font-heading)] font-black text-[#0a1628] leading-tight tracking-tight mb-3"
                  style={{ fontSize: "clamp(26px,4vw,48px)" }}>
                  {product.name}
                </h1>
                {product.subtitle && (
                  <p className="text-[#0057A8] font-bold text-[14px] mb-4 tracking-wide">{product.subtitle}</p>
                )}
                <p className="text-[#555] text-[15px] leading-relaxed mb-8 max-w-lg">{product.description}</p>

                <div className="flex flex-wrap gap-3">
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-7 py-3 text-[12px] font-black tracking-[0.15em] uppercase text-white bg-[#0057A8] hover:bg-[#004080] transition-colors">
                    REQUEST A QUOTE <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-7 py-3 text-[12px] font-bold tracking-[0.1em] uppercase border-2 border-[#0057A8] text-[#0057A8] hover:bg-[#0057A8] hover:text-white transition-colors">
                    SPEAK TO A SPECIALIST
                  </a>
                  <Link href="/products">
                    <button className="inline-flex items-center gap-1.5 px-4 py-3 text-[12px] font-bold text-[#aaa] hover:text-[#0057A8] transition-colors">
                      <ArrowLeft className="h-3.5 w-3.5" /> All Products
                    </button>
                  </Link>
                </div>
              </div>

              {/* Product visual */}
              <div className="order-first lg:order-none">
                <div className="relative min-h-[260px] sm:min-h-[320px] flex items-center justify-center overflow-hidden bg-white/70 border border-[#dce8f5] shadow-sm">
                  <div className="absolute inset-0 opacity-[0.08]"
                    style={{ backgroundImage: "radial-gradient(circle at 25% 45%, #0057A8 1px, transparent 1px), radial-gradient(circle at 75% 55%, #0057A8 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
                  <div className="absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#0057A8]/10 blur-2xl" />
                  <div className="absolute -right-10 bottom-4 h-32 w-32 rounded-full bg-[#00a6a6]/10 blur-2xl" />
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="relative z-10 max-h-[280px] sm:max-h-[340px] w-full object-contain px-6 py-8"
                      style={{ filter: "drop-shadow(0 18px 35px rgba(0,87,168,0.18))" }}
                    />
                  ) : (
                    <div className="relative z-10 flex flex-col items-center gap-3 text-center text-[#0057A8]/50">
                      <ImageIcon className="h-14 w-14" />
                      <span className="text-[10px] font-black tracking-[0.22em] uppercase">Product image unavailable</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick specs panel */}
              {product.specs && (
                <div className="hidden xl:block bg-white border border-[#dce8f5] shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-[#0057A8]">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">Key Specifications</span>
                  </div>
                  <div className="divide-y divide-[#edf3fa]">
                    {Object.entries(product.specs).slice(0, 7).map(([k, v]) => (
                      <div key={k} className="px-5 py-3">
                        <div className="text-[9px] font-black tracking-[0.18em] uppercase text-[#0057A8]/50 mb-0.5">{k}</div>
                        <div className="text-[13px] text-[#222] font-medium leading-snug">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div className="bg-white border-b border-[#dce8f5] sticky top-0 z-20 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center gap-3 py-3">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-200 border ${
                  tab === t.key
                    ? "bg-[#0057A8] text-white border-[#0057A8]"
                    : "bg-white text-[#555] border-[#dce8f5] hover:border-[#0057A8]/50 hover:text-[#0057A8]"
                }`}>
                {t.label}
              </button>
            ))}
            <div className="ml-auto">
              <Link href="/products" className="flex items-center gap-1.5 text-[12px] font-bold text-[#aaa] hover:text-[#0057A8] transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> All Products
              </Link>
            </div>
          </div>
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════ */}
        {tab === "overview" && (
          <>
            {product.featureCards && (
              <div className="py-16 bg-white border-b border-[#edf3fa]">
                <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-1.5 h-7 bg-[#0057A8]" />
                    <h2 className="font-[var(--app-font-heading)] font-black text-[#0a1628] text-[22px]">Key Features</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {product.featureCards.map((card, i) => (
                      <div key={i} className="border border-[#dce8f5] bg-[#f8fbff] p-6 hover:border-[#0057A8]/40 hover:bg-[#f0f6ff] hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-sm bg-[#0057A8] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-black text-[12px]">{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <h3 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[15px] leading-snug group-hover:text-[#0057A8] transition-colors">{card.title}</h3>
                        </div>
                        <p className="text-[#555] text-[13px] leading-relaxed pl-11">{card.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {product.features && (
              <div className="py-14 border-b border-[#edf3fa]" style={{ background: "linear-gradient(180deg, #f8fbff 0%, #fff 100%)" }}>
                <div className="max-w-[1400px] mx-auto px-8 md:px-16 grid lg:grid-cols-2 gap-12">
                  <div>
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-1.5 h-6 bg-[#0057A8]" />
                      <h2 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[20px]">Technical Features</h2>
                    </div>
                    <ul className="border border-[#dce8f5] divide-y divide-[#edf3fa] overflow-hidden">
                      {product.features.map((f, i) => (
                        <li key={i} className={`flex items-start gap-3 px-5 py-3.5 ${i % 2 === 0 ? "bg-white" : "bg-[#f8fbff]"}`}>
                          <CheckCircle2 className="h-4 w-4 text-[#0057A8] flex-shrink-0 mt-0.5" />
                          <span className="text-[#444] text-[13px] leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-1.5 h-6 bg-[#0057A8]" />
                      <h2 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[20px]">Certifications</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        { badge: "CE-IVD", label: "European IVD Certification", body: "Certified for in vitro diagnostic use across the European Union — meeting stringent clinical validation and performance requirements.", color: "#007a52" },
                        { badge: "KMFDS", label: "Korean Ministry of Food & Drug Safety", body: "Approved by Korea's Ministry of Food and Drug Safety — the originating regulatory market for all Sugentech products.", color: "#0057A8" },
                        { badge: "POCT", label: "Point-of-Care Ready", body: "Designed for use at the patient's side — results within minutes, no specialist laboratory infrastructure required.", color: "#6d28d9" },
                        { badge: "LIS/HIS", label: "Hospital System Integration", body: "Compatible with Laboratory and Hospital Information Systems — results flow directly into digital patient records.", color: "#0369a1" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 border border-[#dce8f5] bg-white hover:border-[#0057A8]/30 transition-colors">
                          <span className="px-2.5 py-1 text-[9px] font-black tracking-wide text-white flex-shrink-0" style={{ backgroundColor: item.color }}>{item.badge}</span>
                          <div>
                            <div className="text-[12px] font-bold text-[#333] mb-0.5">{item.label}</div>
                            <p className="text-[#777] text-[12px] leading-relaxed">{item.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="py-14 bg-[#0057A8] relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
              <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div>
                  <div className="text-white/50 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Science Centre Pakistan · Sugentech Distributor</div>
                  <h2 className="font-[var(--app-font-heading)] font-black text-white leading-tight" style={{ fontSize: "clamp(20px,3vw,32px)" }}>
                    Bring POCT Diagnostics to Your Facility
                  </h2>
                  <p className="text-white/60 text-[13px] mt-1">Local installation, training, and after-sales support across Pakistan.</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <a href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-black tracking-[0.15em] uppercase bg-white text-[#0057A8] hover:bg-[#edf3fa] transition-colors">
                    REQUEST A QUOTE <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ SPECS ═════════════════════════════════════════════ */}
        {tab === "specs" && product.specs && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-[#0057A8]" />
              <h2 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[22px]">Full Specifications</h2>
            </div>
            <div className="border border-[#dce8f5] overflow-hidden max-w-3xl">
              {Object.entries(product.specs).map(([k, v], i) => (
                <div key={k} className={`flex flex-col sm:flex-row sm:items-start gap-3 px-6 py-4 border-b border-[#edf3fa] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#f8fbff]"}`}>
                  <span className="text-[11px] font-black text-[#0057A8] uppercase tracking-wide sm:w-52 flex-shrink-0 mt-0.5">{k}</span>
                  <span className="text-[14px] text-[#333] leading-relaxed">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ APPLICATIONS ══════════════════════════════════════ */}
        {tab === "applications" && product.applications && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-[#0057A8]" />
              <h2 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[22px]">Clinical Applications</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {product.applications.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-4 border border-[#dce8f5] bg-[#f8fbff] hover:border-[#0057A8]/40 hover:bg-[#f0f6ff] transition-all group">
                  <div className="w-5 h-5 bg-[#0057A8] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-[13px] text-[#444] leading-relaxed">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ KITS & REAGENTS ═══════════════════════════════════ */}
        {tab === "kits" && product.kits && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-6 bg-[#0057A8]" />
              <h2 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[22px]">Kits, Reagents &amp; Options</h2>
            </div>
            <p className="text-[#777] text-[14px] mb-8 pl-5">Compatible kits and reagents for the {product.name}. Contact Science Centre Pakistan for availability and pricing.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {product.kits.map((kit, i) => (
                <div key={i} className="border border-[#dce8f5] bg-white p-5 hover:border-[#0057A8]/40 hover:shadow-sm transition-all group">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[15px] leading-snug group-hover:text-[#0057A8] transition-colors">{kit.name}</h3>
                    {kit.catalogueNumber && (
                      <span className="flex-shrink-0 text-[10px] font-bold text-[#0057A8] bg-[#f0f6ff] border border-[#dce8f5] px-2 py-1 font-mono">{kit.catalogueNumber}</span>
                    )}
                  </div>
                  <p className="text-[#666] text-[13px] leading-relaxed mb-3">{kit.description}</p>
                  <a href="/#contact" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0057A8] hover:text-[#004080] transition-colors">
                    Enquire <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related ───────────────────────────────────────────── */}
        {allRelated.length > 0 && (
          <div className="bg-[#f0f6ff] border-t border-[#dce8f5] py-14">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-[#0057A8]" />
                <h3 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[20px]">Related Products</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allRelated.map(p => (
                  <Link key={p.id} href={`/products/${p.id}`}>
                    <div className="group border border-[#dce8f5] bg-white p-5 hover:border-[#0057A8]/50 hover:shadow-md transition-all cursor-pointer">
                      <div className="h-0.5 bg-[#0057A8] -mx-5 -mt-5 mb-5" />
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2 py-0.5 text-[9px] font-black tracking-[0.15em] uppercase text-white bg-[#0057A8]">Sugentech</span>
                        <span className="px-2 py-0.5 text-[9px] font-bold text-[#007a52] border border-[#007a52]/30 bg-white">CE-IVD</span>
                      </div>
                      <h4 className="font-[var(--app-font-heading)] font-bold text-[14px] text-[#0a1628] group-hover:text-[#0057A8] transition-colors mb-2 leading-snug">{p.name}</h4>
                      <p className="text-[12px] text-[#888] line-clamp-2 leading-relaxed">{p.description}</p>
                      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#0057A8] opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

/* ─── INESA-REX Detail Page ────────────────────────────────────── */

function RexProductDetail({ product }: { product: Product }) {
  const category = categoryById(product.category);
  const related = (product.relatedProducts || []).map(rid => productById(rid)).filter(Boolean) as Product[];
  const moreBrand = productsByBrand(product.brand).filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id)).slice(0, 3 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);
  const [tab, setTab] = useState<"overview" | "specs" | "applications">("overview");

  const BLUE = "#276FB7";
  const ORANGE = "#F68B27";

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    ...(product.specs && Object.keys(product.specs).length ? [{ key: "specs" as const, label: "Specifications" }] : []),
    ...(product.applications?.length ? [{ key: "applications" as const, label: "Applications" }] : []),
  ];

  return (
    <div className="min-h-[100dvh] bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <main>

        {/* ── Hero ───────────────────────────────────────────── */}
        <div className="bg-[#f5f8fc] border-b border-[#dce8f5] pt-24 pb-10">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] text-[#aaa] mb-6">
              <Link href="/" className="hover:text-[#276FB7] transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/products" className="hover:text-[#276FB7] transition-colors">Products</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#276FB7] font-semibold truncate max-w-[240px]">{product.name}</span>
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
              {/* Left: info */}
              <div>
                {/* Category + brand */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1.5 text-[11px] font-black tracking-[0.15em] uppercase text-white" style={{ background: BLUE }}>INESA-REX</span>
                  {category && <span className="px-3 py-1.5 text-[11px] text-[#777] border border-[#dce8f5] bg-white flex items-center gap-1.5">{category.icon} {category.name}</span>}
                  {product.featured && <span className="px-3 py-1.5 text-[11px] font-bold text-amber-600 border border-amber-300 bg-amber-50">★ Featured</span>}
                </div>

                <h1 className="font-[var(--app-font-heading)] font-black text-[#0a1628] leading-tight tracking-tight mb-3"
                  style={{ fontSize: "clamp(24px,4vw,44px)" }}>
                  {product.name}
                </h1>

                {product.subtitle && (
                  <p className="font-semibold mb-4 text-[14px]" style={{ color: BLUE }}>{product.subtitle}</p>
                )}

                <p className="text-[#555] text-[15px] leading-relaxed mb-6 max-w-xl">{product.description}</p>

                <div className="flex flex-wrap gap-3">
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-7 py-3 text-[12px] font-black tracking-[0.14em] uppercase text-white transition-colors"
                    style={{ background: BLUE }}>
                    REQUEST A QUOTE <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="/#contact"
                    className="inline-flex items-center gap-2 px-7 py-3 text-[12px] font-bold tracking-[0.1em] uppercase border-2 text-[#276FB7] transition-colors"
                    style={{ borderColor: BLUE }}>
                    ENQUIRE
                  </a>
                  <Link href="/products">
                    <button className="inline-flex items-center gap-1.5 px-4 py-3 text-[12px] font-bold text-[#aaa] hover:text-[#276FB7] transition-colors">
                      <ArrowLeft className="h-3.5 w-3.5" /> All Products
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right: product image */}
              <div className="bg-white border border-[#dce8f5] flex items-center justify-center p-8 min-h-[260px]">
                {product.image ? (
                  <img src={product.image} alt={product.name}
                    className="max-h-64 max-w-full object-contain"
                    style={{ filter: "drop-shadow(0 6px 20px rgba(39,111,183,0.15))" }} />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: BLUE + "15" }}>
                      <Settings2 className="h-9 w-9" style={{ color: BLUE }} />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: BLUE + "60" }}>INESA-REX</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Nav ───────────────────────────────────────── */}
        <div className="bg-white border-b border-[#dce8f5] sticky top-0 z-20 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center gap-3 py-3">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-200 border ${
                  tab === t.key
                    ? "text-white border-[#276FB7]"
                    : "bg-white text-[#555] border-[#dce8f5] hover:border-[#276FB7]/50 hover:text-[#276FB7]"
                }`}
                style={tab === t.key ? { background: BLUE } : {}}>
                {t.label}
              </button>
            ))}
            <div className="ml-auto">
              <Link href="/products" className="flex items-center gap-1.5 text-[12px] font-bold text-[#aaa] hover:text-[#276FB7] transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> All Products
              </Link>
            </div>
          </div>
        </div>

        {/* ══ OVERVIEW ════════════════════════════════════════ */}
        {tab === "overview" && (
          <>
            {/* Features list */}
            {product.features && product.features.length > 0 && (
              <div className="py-12 border-b border-[#edf3fa]">
                <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-1.5 h-7" style={{ background: BLUE }} />
                    <h2 className="font-[var(--app-font-heading)] font-black text-[#0a1628] text-[22px]">Features</h2>
                  </div>
                  <ul className="border border-[#dce8f5] divide-y divide-[#edf3fa] overflow-hidden max-w-4xl">
                    {product.features.map((f, i) => (
                      <li key={i} className={`flex items-start gap-3 px-6 py-4 ${i % 2 === 0 ? "bg-white" : "bg-[#f8fbff]"}`}>
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
                        <span className="text-[#444] text-[14px] leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Specs preview in overview — full table, NOT truncated */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="py-12 border-b border-[#edf3fa] bg-[#f8fbff]">
                <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-7" style={{ background: ORANGE }} />
                      <h2 className="font-[var(--app-font-heading)] font-black text-[#0a1628] text-[22px]">Specifications</h2>
                    </div>
                    <button onClick={() => setTab("specs")}
                      className="text-[12px] font-bold uppercase tracking-wide inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                      style={{ color: BLUE }}>
                      View full specs <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {/* REX-style spec table: orange header row, alternating rows */}
                  <div className="border border-[#dce8f5] overflow-hidden max-w-4xl">
                    {/* Orange header row matching REX site */}
                    <div className="grid grid-cols-2 px-5 py-3 text-white font-bold text-[13px]"
                      style={{ background: ORANGE }}>
                      <span>Parameter</span>
                      <span>{product.specs["Model"] || product.name}</span>
                    </div>
                    {Object.entries(product.specs).map(([k, v], i) => (
                      <div key={k} className={`grid grid-cols-2 border-b border-[#edf3fa] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#f8fbff]"}`}>
                        <div className="px-5 py-3 text-[13px] font-semibold text-[#444] border-r border-[#edf3fa]">{k}</div>
                        <div className="px-5 py-3 text-[13px] text-[#222]">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Applications */}
            {product.applications && product.applications.length > 0 && (
              <div className="py-12 border-b border-[#edf3fa]">
                <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-1.5 h-7" style={{ background: BLUE }} />
                    <h2 className="font-[var(--app-font-heading)] font-black text-[#0a1628] text-[22px]">Applications</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
                    {product.applications.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 border border-[#dce8f5] bg-white hover:border-[#276FB7]/40 transition-colors">
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: BLUE }}>
                          <ArrowRight className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-[13px] text-[#444] leading-relaxed">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Banner */}
            <div className="py-14" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1a4a8a 100%)` }}>
              <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="text-white/50 text-[10px] font-black tracking-[0.3em] uppercase mb-1">Science Centre Pakistan · INESA-REX Distributor</div>
                  <h2 className="font-[var(--app-font-heading)] font-black text-white leading-tight" style={{ fontSize: "clamp(20px,3vw,30px)" }}>
                    Interested in {product.name}?
                  </h2>
                  <p className="text-white/60 text-[13px] mt-1">Local support, calibration, and after-sales service across Pakistan.</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <a href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 text-[12px] font-black tracking-[0.15em] uppercase bg-white text-[#276FB7] hover:bg-[#edf3fa] transition-colors">
                    REQUEST A QUOTE <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ SPECS TAB — complete table exactly like REX site ══ */}
        {tab === "specs" && product.specs && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-7" style={{ background: ORANGE }} />
              <h2 className="font-[var(--app-font-heading)] font-black text-[#0a1628] text-[22px]">Full Specifications</h2>
            </div>
            <div className="border border-[#dce8f5] overflow-hidden max-w-4xl">
              {/* Orange model header row — matches REX site exactly */}
              <div className="grid grid-cols-2 px-5 py-3.5 font-bold text-[14px] text-white"
                style={{ background: ORANGE }}>
                <span>Model</span>
                <span>{product.specs["Model"] || product.name}</span>
              </div>
              {Object.entries(product.specs).map(([k, v], i) => (
                <div key={k} className={`grid grid-cols-2 border-b border-[#edf3fa] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#f8fbff]"}`}>
                  <div className="px-5 py-3.5 text-[13px] font-semibold text-[#333] border-r border-[#edf3fa] leading-snug">{k}</div>
                  <div className="px-5 py-3.5 text-[13px] text-[#222] leading-snug">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ APPLICATIONS TAB ════════════════════════════════ */}
        {tab === "applications" && product.applications && (
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-14">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-7" style={{ background: BLUE }} />
              <h2 className="font-[var(--app-font-heading)] font-black text-[#0a1628] text-[22px]">Applications</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {product.applications.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-4 border border-[#dce8f5] bg-white hover:border-[#276FB7]/40 hover:bg-[#f8fbff] transition-all">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: BLUE }}>
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-[14px] text-[#444] leading-relaxed">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related Products ─────────────────────────────── */}
        {allRelated.length > 0 && (
          <div className="bg-[#f8fbff] border-t border-[#dce8f5] py-14">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6" style={{ background: BLUE }} />
                <h3 className="font-[var(--app-font-heading)] font-bold text-[#0a1628] text-[20px]">Related Products</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allRelated.map(p => (
                  <Link key={p.id} href={`/products/${p.id}`}>
                    <div className="group border border-[#dce8f5] bg-white p-5 hover:border-[#276FB7]/50 hover:shadow-md transition-all cursor-pointer">
                      <div className="h-0.5 -mx-5 -mt-5 mb-5" style={{ background: BLUE }} />
                      <span className="px-2 py-0.5 text-[9px] font-black tracking-[0.15em] uppercase text-white mb-3 inline-block" style={{ background: BLUE }}>REX</span>
                      <h4 className="font-[var(--app-font-heading)] font-bold text-[14px] text-[#0a1628] group-hover:text-[#276FB7] transition-colors mb-2 leading-snug">{p.name}</h4>
                      {p.subtitle && <p className="text-[11px] font-semibold mb-2" style={{ color: BLUE + "90" }}>{p.subtitle}</p>}
                      <p className="text-[12px] text-[#888] line-clamp-2 leading-relaxed">{p.description}</p>
                      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: BLUE }}>
                        View Details <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
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

  // Route NgeneBio products to clinical diagnostic detail page
  if (product.brand === "ngene") {
    return <NgeneBioProductDetail product={product} />;
  }

  if (product.brand === "sugentech") {
    return <SugentechProductDetail product={product} />;
  }

  if (product.brand === "rex") {
    return <RexProductDetail product={product} />;
  }

  const brand = brandById(product.brand);
  const category = categoryById(product.category);
  const related = (product.relatedProducts || []).map(rid => productById(rid)).filter(Boolean) as Product[];
  const moreBrand = productsByBrand(product.brand).filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id)).slice(0, 3 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);
  const specEntries = product.specs ? Object.entries(product.specs).filter(([, value]) => Boolean(value)) : [];
  const preferredQuickSpecKeys = ["Output", "Operating parameters", "Resistivity", "Dimensions"];
  const quickSpecs = [
    ...preferredQuickSpecKeys
      .map(key => specEntries.find(([specKey]) => specKey === key))
      .filter(Boolean),
    ...specEntries.filter(([key]) => !preferredQuickSpecKeys.includes(key))
  ].slice(0, 4) as [string, string][];
  const documentUrl = product.brochure || product.specSheet;
  const hasApplicationDetailSection = product.detailSections?.some(section => section.title.trim().toLowerCase() === "application");
  const displayedApplications = hasApplicationDetailSection ? [] : (product.applications || []);

  return (
    <div className="min-h-[100dvh] bg-background">
      <SiteNavbar />
      <main className="pb-20">
        <div className="border-b border-border bg-gradient-to-b from-muted/40 via-background to-background">
          <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 flex-wrap">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
            <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] gap-10 xl:gap-14 items-start min-w-0">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 mb-5">
                  {brand && <span className="px-3 py-1.5 text-xs font-bold text-white rounded-sm" style={{ background: brand.accent }}>{brand.short}</span>}
                  {category && <span className="px-3 py-1.5 text-xs text-muted-foreground border border-border flex items-center gap-1.5 rounded-sm">{category.icon}{category.name}</span>}
                  {product.featured && <span className="px-3 py-1.5 text-xs font-bold text-amber-600 border border-amber-200 bg-amber-50 rounded-sm">★ Featured</span>}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-[var(--app-font-heading)] font-black text-foreground leading-tight tracking-tight mb-6 max-w-4xl break-words [overflow-wrap:anywhere] min-w-0">{product.name}</h1>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-7 max-w-3xl break-words [overflow-wrap:anywhere] min-w-0">{product.description}</p>
                {quickSpecs.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3 mb-7">
                    {quickSpecs.map(([k, v]) => (
                      <a key={k} href="#technical-profile" className="group border border-border bg-background/80 p-4 hover:border-primary/40 hover:bg-background transition-colors min-w-0">
                        <div className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground mb-2">{k}</div>
                        <div className="text-sm font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-colors break-words [overflow-wrap:anywhere]">{v}</div>
                      </a>
                    ))}
                  </div>
                )}
                {product.highlights && (
                  <div className="grid sm:grid-cols-2 gap-x-5 gap-y-3 mb-2">
                    {product.highlights.slice(0, 4).map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-muted-foreground text-sm leading-relaxed break-words [overflow-wrap:anywhere] min-w-0">{h}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid sm:flex gap-3 mt-8">
                  <Button asChild size="lg" className="rounded-none w-full sm:w-auto"><a href="/#contact">Request a Quote <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
                  <Button asChild variant="outline" size="lg" className="rounded-none w-full sm:w-auto"><Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> All Products</Link></Button>
                </div>
              </div>
              <div className="border border-border bg-background p-5 md:p-6 shadow-sm min-w-0 w-full">
                <div className="aspect-[4/3] bg-muted/50 border border-border/60 flex items-center justify-center mb-5 overflow-hidden">
                  <ProductMedia product={product} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {product.catalogueNumber && (
                    <div className="border border-border p-3">
                      <div className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground mb-1">Catalogue</div>
                      <div className="font-mono text-foreground">{product.catalogueNumber}</div>
                    </div>
                  )}
                  {product.subcategory && (
                    <div className="border border-border p-3">
                      <div className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground mb-1">Family</div>
                      <div className="font-semibold text-foreground leading-snug break-words">{product.subcategory}</div>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                  {documentUrl && (
                    <Button asChild className="rounded-none w-full">
                      <a href={documentUrl} target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" /> Download Brochure</a>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="rounded-none w-full">
                    <a href="/#contact">Discuss This System <ArrowRight className="ml-2 h-4 w-4" /></a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {specEntries.length > 0 && (
          <section id="technical-profile" className="container mx-auto px-6 md:px-12 py-12 border-b border-border scroll-mt-28 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-primary mb-2">Technical profile</div>
                <h2 className="text-2xl md:text-3xl font-[var(--app-font-heading)] font-black text-foreground">Specifications at a glance</h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mt-2 max-w-2xl">The full product specification set is grouped here so the page stays balanced while every important property remains easy to scan.</p>
              </div>
              {documentUrl && (
                <Button asChild variant="outline" className="rounded-none">
                  <a href={documentUrl} target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" /> Download Brochure</a>
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 min-w-0">
              {specEntries.map(([k, v]) => (
                <div key={k} className="border border-border bg-background p-4 hover:border-primary/40 hover:shadow-sm transition-all min-w-0">
                  <div className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground mb-2">{k}</div>
                  <div className="text-sm md:text-[15px] font-semibold text-foreground leading-relaxed break-words [overflow-wrap:anywhere]">{v}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        {product.detailSections && product.detailSections.length > 0 && (
          <div className="container mx-auto px-6 md:px-12 py-14 border-b border-border">
            <div className="grid lg:grid-cols-2 gap-5">
              {product.detailSections.map((section, i) => (
                <section key={`${section.title}-${i}`} className="border border-border bg-background p-6 md:p-7">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  {section.body && (
                    <p className="text-muted-foreground text-base leading-relaxed break-words">{section.body}</p>
                  )}
                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-3 mt-5">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        )}
        {(product.features || displayedApplications.length > 0) && (
          <div className="container mx-auto px-6 md:px-12 py-14 grid lg:grid-cols-2 gap-12">
            {product.features && <div><h2 className="text-xl font-bold mb-5">Features &amp; Benefits</h2><ul className="space-y-3">{product.features.map((f,i) => <li key={i} className="flex gap-3 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{f}</li>)}</ul></div>}
            {displayedApplications.length > 0 && <div><h2 className="text-xl font-bold mb-5">Applications</h2><ul className="space-y-3">{displayedApplications.map((a,i) => <li key={i} className="flex gap-3 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{a}</li>)}</ul></div>}
          </div>
        )}
        {allRelated.length > 0 && (
          <div className="container mx-auto px-6 md:px-12 pt-4">
            <h3 className="text-xl font-bold mb-6">Related Products</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {allRelated.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
