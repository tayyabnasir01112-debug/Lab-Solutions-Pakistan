import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
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

const productSlideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.72, ease: [0.76, 0, 0.24, 1] },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.72, ease: [0.76, 0, 0.24, 1] },
  }),
};

function ProductSlideDeck({
  sections,
  names,
  accent = "hsl(var(--primary))",
  resetKey,
}: {
  sections: React.ReactNode[];
  names: string[];
  accent?: string;
  resetKey?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const cooldown = useRef(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  useEffect(() => {
    cooldown.current = false;
    setDirection(-1);
    setCurrent(0);
    slideRefs.current.forEach(slide => slide?.scrollTo({ top: 0, behavior: "instant" }));
  }, [resetKey]);

  const goTo = (index: number) => {
    if (cooldown.current || index === current || index < 0 || index >= sections.length) return;
    cooldown.current = true;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setTimeout(() => {
      cooldown.current = false;
    }, 820);
  };

  useEffect(() => {
    const active = slideRefs.current[current];
    if (active) active.scrollTo({ top: 0, behavior: "instant" });
  }, [current]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const active = slideRefs.current[current];
      if (!active || Math.abs(e.deltaY) < 20) return;

      const canScrollDown = active.scrollTop + active.clientHeight < active.scrollHeight - 8;
      const canScrollUp = active.scrollTop > 8;
      if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) return;

      e.preventDefault();
      if (cooldown.current) return;
      goTo(e.deltaY > 0 ? current + 1 : current - 1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(current + 1);
      }
      if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(current - 1);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [current, sections.length]);

  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 65) return;
      goTo(diff > 0 ? current + 1 : current - 1);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [current, sections.length]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background">
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={productSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          ref={node => {
            slideRefs.current[current] = node;
          }}
          className="absolute inset-0 w-full overflow-y-auto overscroll-contain"
          style={{ height: "100dvh" }}
        >
          {sections[current]}
        </motion.div>
      </AnimatePresence>

      {sections.length > 1 && (
        <>
          <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
            {names.map((name, i) => (
              <button key={name} onClick={() => goTo(i)} className="group flex items-center justify-end gap-2" title={name}>
                <span className="whitespace-nowrap border border-border bg-background/95 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground opacity-0 shadow-sm transition-all duration-200 group-hover:opacity-100">
                  {name}
                </span>
                <motion.div
                  className="rounded-full"
                  animate={{
                    width: i === current ? 10 : 5,
                    height: i === current ? 10 : 5,
                    backgroundColor: i === current ? accent : "hsl(var(--border))",
                    boxShadow: i === current ? `0 0 8px ${accent}` : "none",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-40 h-[2px] bg-border/50">
            <motion.div
              className="h-full"
              style={{ backgroundColor: accent }}
              animate={{ width: `${(current / (sections.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="fixed bottom-4 left-6 z-40 hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.span
                key={current}
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {String(current + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")} - {names[current]}
              </motion.span>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
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

function SpecGrid({ specs, accent, limit }: { specs?: Record<string, string>; accent: string; limit?: number }) {
  const entries = Object.entries(specs || {}).filter(([, value]) => Boolean(value)).slice(0, limit);
  if (!entries.length) return null;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(([key, value]) => (
        <div key={key} className="border border-border bg-background p-4">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: accent }}>{key}</div>
          <div className="text-sm font-semibold leading-relaxed text-foreground break-words">{value}</div>
        </div>
      ))}
    </div>
  );
}

function FeatureBullets({ items, accent }: { items?: string[]; accent: string }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: accent }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function RelatedSlideContent({ products, accent }: { products: Product[]; accent: string }) {
  return (
    <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
      <div className="mb-8">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>More from this brand</div>
        <h2 className="text-3xl md:text-4xl font-[var(--app-font-heading)] font-black text-foreground">Related products</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {products.map(product => <RelatedCard key={product.id} product={product} />)}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild className="rounded-none" style={{ backgroundColor: accent }}>
          <a href="/#contact">Request a Quote <ArrowRight className="ml-2 h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" className="rounded-none">
          <Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> All Products</Link>
        </Button>
      </div>
    </div>
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

  const cytekSlides = [
    (
      <section key="hero" className="min-h-[100dvh] flex items-center overflow-hidden bg-[#203c3c] text-white relative">
        {product.heroBg && <img src={product.heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="container relative z-10 mx-auto grid items-center gap-10 px-6 pt-28 pb-16 md:px-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-4 text-[12px] font-bold text-white/65">Science Centre Pakistan / Cytek Biosciences</div>
            <h1 className="font-[var(--app-font-heading)] text-4xl font-black leading-none md:text-6xl">{product.name}</h1>
            {product.subtitle && <p className="mt-6 max-w-xl text-2xl font-light leading-snug text-white/90">{product.subtitle}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {product.brochure && <a href={product.brochure} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-white px-7 py-3 text-[12px] font-black uppercase tracking-wide hover:bg-white hover:text-[#203c3c]"><FileText className="h-4 w-4" /> Product Brochure</a>}
              <a href="/#contact" className="inline-flex items-center gap-2 px-7 py-3 text-[12px] font-black uppercase tracking-wide text-[#E99E2A]">Request More Information <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            {product.image && <img src={product.image} alt={product.name} className="max-h-[520px] w-full object-contain drop-shadow-2xl" />}
          </div>
        </div>
      </section>
    ),
    (
      <section key="performance" className="min-h-[100dvh] bg-white">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8 max-w-3xl">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#2c5f5f]">Full spectrum profiling</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#111]">Performance at a glance</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {displayStats.map(stat => (
              <div key={stat.label} className="border border-[#d8e5e5] bg-[#f7fbfb] p-6">
                <div className="text-[11px] font-black uppercase tracking-wide text-[#2c5f5f]">{stat.label}</div>
                <div className="mt-3 text-2xl font-black text-[#111]">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <SpecGrid specs={product.specs} accent="#2c5f5f" limit={9} />
          </div>
        </div>
      </section>
    ),
    product.featureCards?.length && (
      <section key="features" className="min-h-[100dvh] bg-[#f4f8f8]">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#2c5f5f]">Technology</div>
              <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#111]">Technology &amp; features</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {product.featureCards.map((card, index) => (
              <div key={card.title} className="border border-[#d8e5e5] bg-white p-6">
                <div className="mb-4 text-[#2c5f5f]">{cardIcons[index % cardIcons.length]}</div>
                <h3 className="font-[var(--app-font-heading)] text-xl font-black text-[#111]">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    product.kits?.length && (
      <section key="kits" className="min-h-[100dvh] bg-white">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#2c5f5f]">Configurations</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#111]">Kits &amp; options</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {product.kits.map((kit, index) => (
              <div key={index} className="border border-border p-5">
                <div className="font-bold text-foreground">{kit.name}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{kit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    allRelated.length > 0 && (
      <section key="related" className="min-h-[100dvh] bg-[#f4f8f8]">
        <RelatedSlideContent products={allRelated} accent="#2c5f5f" />
      </section>
    ),
  ].filter(Boolean) as React.ReactNode[];
  const cytekSlideNames = [
    "Overview",
    "Performance",
    ...(product.featureCards?.length ? ["Technology"] : []),
    ...(product.kits?.length ? ["Options"] : []),
    ...(allRelated.length ? ["Related"] : []),
  ];

  return (
    <div className="h-[100dvh] overflow-hidden bg-white text-[#333]">
      <SiteNavbar forceSolid />
      <ProductSlideDeck sections={cytekSlides} names={cytekSlideNames} accent="#2c5f5f" resetKey={product.id} />
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-white text-[#333]">
      {/* Teal navbar to match Cytek brand */}
      <SiteNavbar forceSolid />

      <main className="product-scroll-snap">
        {/* ═══════════════════════════════════════════════════════
            HERO — full bleed, background image, instrument photo
        ════════════════════════════════════════════════════════ */}
        <div className="product-slide-section relative min-h-[100dvh] flex items-center overflow-hidden"
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
                {allRelated.map(p => <RelatedCard key={p.id} product={p} />)}
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

  const ngeneSlides = [
    (
      <section key="hero" className="min-h-[100dvh] bg-white">
        <div className="h-1.5 bg-[#C8002D]" />
        <div className="container mx-auto grid min-h-[calc(100dvh-6px)] items-center gap-10 px-6 pb-16 pt-28 md:px-12 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="bg-[#C8002D] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white">NgeneBio</span>
              <span className="border border-[#007a52]/40 px-3 py-1.5 text-[11px] font-bold text-[#007a52]">CE-IVD Certified</span>
              {category && <span className="border border-border px-3 py-1.5 text-[11px] text-muted-foreground">{category.name}</span>}
            </div>
            <h1 className="font-[var(--app-font-heading)] text-4xl md:text-6xl font-black leading-tight text-[#111]">{product.name}</h1>
            {product.subtitle && <p className="mt-5 text-sm font-bold tracking-wide text-[#C8002D]">{product.subtitle}</p>}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#contact" className="inline-flex items-center gap-2 bg-[#C8002D] px-7 py-3 text-[12px] font-black uppercase tracking-[0.15em] text-white">Request a Quote <ArrowRight className="h-4 w-4" /></a>
              <Link href="/products" className="inline-flex items-center gap-2 border border-border px-7 py-3 text-[12px] font-bold uppercase tracking-[0.1em]"><ArrowLeft className="h-4 w-4" /> All Products</Link>
            </div>
          </div>
          <div className="bg-[#C8002D] p-8 text-white">
            <div className="mb-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/50">Precision diagnostics</div>
            <div className="space-y-5">
              {Object.entries(product.specs || {}).slice(0, 5).map(([key, value]) => (
                <div key={key} className="border-b border-white/15 pb-4">
                  <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">{key}</div>
                  <div className="text-sm font-bold leading-relaxed">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    product.featureCards?.length && (
      <section key="capabilities" className="min-h-[100dvh] bg-[#fff7f8]">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#C8002D]">Clinical workflow</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#111]">Key capabilities</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {product.featureCards.map(card => (
              <div key={card.title} className="border border-[#ffd5dc] bg-white p-6">
                <h3 className="font-[var(--app-font-heading)] text-lg font-black text-[#111]">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    product.specs && (
      <section key="specs" className="min-h-[100dvh] bg-white">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#C8002D]">Assay profile</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#111]">Specifications</h2>
          </div>
          <SpecGrid specs={product.specs} accent="#C8002D" />
        </div>
      </section>
    ),
    (product.applications?.length || allRelated.length) && (
      <section key="applications" className="min-h-[100dvh] bg-[#fff7f8]">
        <div className="container mx-auto grid gap-10 px-6 md:px-12 pt-28 pb-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#C8002D]">Use cases</div>
            <h2 className="mb-6 font-[var(--app-font-heading)] text-3xl font-black text-[#111]">Applications</h2>
            <FeatureBullets items={product.applications} accent="#C8002D" />
          </div>
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#C8002D]">Related</div>
            <h2 className="mb-6 font-[var(--app-font-heading)] text-3xl font-black text-[#111]">Panels &amp; software</h2>
            <div className="grid gap-4">{allRelated.map(p => <RelatedCard key={p.id} product={p} />)}</div>
          </div>
        </div>
      </section>
    ),
  ].filter(Boolean) as React.ReactNode[];

  return (
    <div className="h-[100dvh] overflow-hidden bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <ProductSlideDeck sections={ngeneSlides} names={["Overview", ...(product.featureCards?.length ? ["Capabilities"] : []), ...(product.specs ? ["Specs"] : []), ...((product.applications?.length || allRelated.length) ? ["Applications"] : [])]} accent="#C8002D" resetKey={product.id} />
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <main className="product-scroll-snap">

        {/* ═══ HERO — white with bold red left panel ════════════ */}
        <div className="product-slide-section pt-20 border-b border-[#e8e8e8]">
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

  const sugSlides = [
    (
      <section key="hero" className="min-h-[100dvh] bg-[#eaf4ff]">
        <div className="h-1.5 bg-[#0057A8]" />
        <div className="container mx-auto grid min-h-[calc(100dvh-6px)] items-center gap-8 px-6 pb-16 pt-28 md:px-12 xl:grid-cols-[0.9fr_1fr_280px]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="bg-[#0057A8] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-white">Sugentech</span>
              <span className="border border-[#007a52]/40 bg-white px-3 py-1.5 text-[11px] font-bold text-[#007a52]">CE-IVD</span>
              {category && <span className="border border-[#dce8f5] bg-white px-3 py-1.5 text-[11px] text-muted-foreground">{category.name}</span>}
            </div>
            <h1 className="font-[var(--app-font-heading)] text-4xl md:text-6xl font-black leading-tight text-[#0a1628]">{product.name}</h1>
            {product.subtitle && <p className="mt-4 text-sm font-bold tracking-wide text-[#0057A8]">{product.subtitle}</p>}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#4d5d70]">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#contact" className="inline-flex items-center gap-2 bg-[#0057A8] px-7 py-3 text-[12px] font-black uppercase tracking-[0.15em] text-white">Request a Quote <ArrowRight className="h-4 w-4" /></a>
              <a href="/#contact" className="inline-flex items-center gap-2 border-2 border-[#0057A8] px-7 py-3 text-[12px] font-bold uppercase tracking-[0.1em] text-[#0057A8]">Speak to a Specialist</a>
            </div>
          </div>
          <div className="flex min-h-[300px] items-center justify-center">
            {product.image ? <img src={product.image} alt={product.name} className="max-h-[430px] w-full object-contain drop-shadow-xl" /> : <ProductMedia product={product} />}
          </div>
          <div className="hidden xl:block border border-[#dce8f5] bg-white">
            <div className="bg-[#0057A8] px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">Key specifications</div>
            <div className="divide-y divide-[#edf3fa]">{Object.entries(product.specs || {}).slice(0, 6).map(([k, v]) => <div key={k} className="p-4"><div className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#0057A8]/60">{k}</div><div className="text-sm font-semibold leading-snug">{v}</div></div>)}</div>
          </div>
        </div>
      </section>
    ),
    (
      <section key="features" className="min-h-[100dvh] bg-white">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#0057A8]">POCT workflow</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#0a1628]">Features &amp; certifications</h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <FeatureBullets items={product.features} accent="#0057A8" />
            <div className="grid gap-3">
              {["CE-IVD", "KMFDS", "POCT", "LIS/HIS"].map(label => (
                <div key={label} className="border border-[#dce8f5] bg-[#f8fbff] p-4">
                  <span className="bg-[#0057A8] px-2.5 py-1 text-[9px] font-black text-white">{label}</span>
                  <p className="mt-3 text-sm text-muted-foreground">Validated for clinical point-of-care workflows with Science Centre Pakistan support.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    product.specs && (
      <section key="specs" className="min-h-[100dvh] bg-[#f0f6ff]">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#0057A8]">Technical profile</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#0a1628]">Specifications</h2>
          </div>
          <SpecGrid specs={product.specs} accent="#0057A8" />
        </div>
      </section>
    ),
    (product.applications?.length || product.kits?.length) && (
      <section key="clinical" className="min-h-[100dvh] bg-white">
        <div className="container mx-auto grid gap-10 px-6 md:px-12 pt-28 pb-14 lg:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#0057A8]">Clinical use</div>
            <h2 className="mb-6 font-[var(--app-font-heading)] text-3xl font-black text-[#0a1628]">Applications</h2>
            <FeatureBullets items={product.applications} accent="#0057A8" />
          </div>
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#0057A8]">Compatible menu</div>
            <h2 className="mb-6 font-[var(--app-font-heading)] text-3xl font-black text-[#0a1628]">Kits &amp; reagents</h2>
            <div className="grid gap-4">{product.kits?.map((kit, i) => <div key={i} className="border border-[#dce8f5] p-4"><div className="font-bold">{kit.name}</div><p className="mt-2 text-sm text-muted-foreground">{kit.description}</p></div>)}</div>
          </div>
        </div>
      </section>
    ),
    allRelated.length > 0 && <section key="related" className="min-h-[100dvh] bg-[#f0f6ff]"><RelatedSlideContent products={allRelated} accent="#0057A8" /></section>,
  ].filter(Boolean) as React.ReactNode[];

  return (
    <div className="h-[100dvh] overflow-hidden bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <ProductSlideDeck sections={sugSlides} names={["Overview", "Features", ...(product.specs ? ["Specs"] : []), ...((product.applications?.length || product.kits?.length) ? ["Clinical"] : []), ...(allRelated.length ? ["Related"] : [])]} accent="#0057A8" resetKey={product.id} />
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <main className="product-scroll-snap">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="product-slide-section border-b border-[#dce8f5]" style={{ background: "linear-gradient(135deg, #f0f6ff 0%, #e8f1fb 50%, #f8fbff 100%)" }}>
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

            <div className="grid lg:grid-cols-[minmax(430px,1fr)_minmax(360px,520px)] xl:grid-cols-[minmax(430px,1fr)_minmax(360px,460px)_280px] gap-8 items-center">
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
                <div className="relative min-h-[260px] sm:min-h-[330px] flex items-center justify-center overflow-visible">
                  <div className="absolute inset-x-0 top-1/2 h-28 -translate-y-1/2 border-y border-white/60 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
                  <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-[#0057A8]/10" />
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="relative z-10 max-h-[285px] sm:max-h-[350px] w-full object-contain px-2 py-6"
                      style={{ filter: "drop-shadow(0 22px 30px rgba(30,68,110,0.20))" }}
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

  const rexSlides = [
    (
      <section key="hero" className="min-h-[100dvh] bg-[#f5f8fc]">
        <div className="container mx-auto grid min-h-[100dvh] items-center gap-10 px-6 pb-16 pt-28 md:px-12 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-white" style={{ background: BLUE }}>INESA-REX</span>
              {category && <span className="border border-[#dce8f5] bg-white px-3 py-1.5 text-[11px] text-muted-foreground">{category.name}</span>}
              {product.featured && <span className="border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-600">Featured</span>}
            </div>
            <h1 className="font-[var(--app-font-heading)] text-4xl md:text-6xl font-black leading-tight text-[#0a1628]">{product.name}</h1>
            {product.subtitle && <p className="mt-4 text-sm font-bold" style={{ color: BLUE }}>{product.subtitle}</p>}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/#contact" className="inline-flex items-center gap-2 px-7 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-white" style={{ background: BLUE }}>Request a Quote <ArrowRight className="h-4 w-4" /></a>
              <Link href="/products" className="inline-flex items-center gap-2 border border-border bg-white px-7 py-3 text-[12px] font-bold uppercase tracking-[0.1em]"><ArrowLeft className="h-4 w-4" /> All Products</Link>
            </div>
          </div>
          <div className="border border-[#dce8f5] bg-white p-8 min-h-[320px] flex items-center justify-center">
            {product.image ? <img src={product.image} alt={product.name} className="max-h-[420px] w-full object-contain" /> : <ProductMedia product={product} />}
          </div>
        </div>
      </section>
    ),
    (
      <section key="features" className="min-h-[100dvh] bg-white">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: BLUE }}>Laboratory measurement</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#0a1628]">Features</h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <FeatureBullets items={product.features} accent={BLUE} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {Object.entries(product.specs || {}).slice(0, 4).map(([key, value]) => (
                <div key={key} className="border border-[#dce8f5] bg-[#f5f8fc] p-5">
                  <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: BLUE }}>{key}</div>
                  <div className="text-lg font-black text-[#0a1628]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    product.specs && (
      <section key="specs" className="min-h-[100dvh] bg-[#f5f8fc]">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: BLUE }}>Instrument data</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl md:text-5xl font-black text-[#0a1628]">Specifications</h2>
          </div>
          <SpecGrid specs={product.specs} accent={BLUE} />
        </div>
      </section>
    ),
    (product.applications?.length || allRelated.length) && (
      <section key="applications" className="min-h-[100dvh] bg-white">
        <div className="container mx-auto grid gap-10 px-6 md:px-12 pt-28 pb-14 lg:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: BLUE }}>Lab workflows</div>
            <h2 className="mb-6 font-[var(--app-font-heading)] text-3xl font-black text-[#0a1628]">Applications</h2>
            <FeatureBullets items={product.applications} accent={ORANGE} />
          </div>
          <div>
            <div className="mb-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: BLUE }}>More instruments</div>
            <h2 className="mb-6 font-[var(--app-font-heading)] text-3xl font-black text-[#0a1628]">Related products</h2>
            <div className="grid gap-4">{allRelated.map(p => <RelatedCard key={p.id} product={p} />)}</div>
          </div>
        </div>
      </section>
    ),
  ].filter(Boolean) as React.ReactNode[];

  return (
    <div className="h-[100dvh] overflow-hidden bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <ProductSlideDeck sections={rexSlides} names={["Overview", "Features", ...(product.specs ? ["Specs"] : []), ...((product.applications?.length || allRelated.length) ? ["Applications"] : [])]} accent={BLUE} resetKey={product.id} />
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-white text-[#111]">
      <SiteNavbar forceSolid />
      <main className="product-scroll-snap">

        {/* ── Hero ───────────────────────────────────────────── */}
        <div className="product-slide-section bg-[#f5f8fc] border-b border-[#dce8f5] pt-24 pb-10">
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

function AdaptiveProductDetail({ product }: { product: Product }) {
  const brand = brandById(product.brand);
  const category = categoryById(product.category);
  const brandAccent = brand?.accent || "hsl(var(--primary))";
  const related = (product.relatedProducts || []).map(rid => productById(rid)).filter(Boolean) as Product[];
  const moreBrand = productsByBrand(product.brand).filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id)).slice(0, 4 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);
  const specEntries = product.specs ? Object.entries(product.specs).filter(([, value]) => Boolean(value)) : [];
  const packageEntries = product.packaging?.map(item => [
    item.name,
    [item.catalogueNumber, item.units, item.format].filter(Boolean).join(" / ")
  ] as [string, string]) || [];
  const packagingSummary =
    product.packaging?.length ? uniqueStrings(product.packaging.map(item => item.units)).join(", ") :
    product.specs?.Packaging ||
    product.specs?.Quantity ||
    product.specs?.Specification ||
    product.specs?.["Pack size"];
  const preferredQuickSpecKeys =
    product.brand === "merck" ? ["Output", "Operating parameters", "Resistivity", "Dimensions"] :
    product.brand === "luminex" ? ["Technology", "Portfolio area", "Catalogue approach", "Throughput"] :
    product.brand === "onelambda" ? ["HLA loci", "Specificities", "Detection method", "Sample type"] :
    product.brand === "ngene" ? ["Quantity", "Sample Types", "Regulatory Approvals", "Sequencing Platform", "Analysis Software"] :
    product.brand === "sugentech" ? ["Sample Type", "Test Time", "Storage Temperature", "Measurement Method"] :
    product.brand === "rex" ? ["Measurement Range", "Resolution", "Accuracy", "Power Supply"] :
    product.brand === "hkm" ? ["Code", "Specification", "Official category", "Product family"] :
    product.brand === "biolegend" ? ["Portfolio group", "Catalogue approach", "Source", "Application"] :
    ["Output", "Operating parameters", "Technology", "Dimensions"];
  const quickSpecs = [
    product.catalogueNumber && ["Catalogue", product.catalogueNumber],
    packagingSummary && ["Pack / size", packagingSummary],
    ...preferredQuickSpecKeys.map(key => specEntries.find(([specKey]) => specKey === key)).filter(Boolean),
    ...specEntries.filter(([key]) => !preferredQuickSpecKeys.includes(key))
  ].filter(Boolean).slice(0, 4) as [string, string][];
  const documentUrl = product.brochure || product.specSheet;
  const hasApplicationDetailSection = product.detailSections?.some(section => section.title.trim().toLowerCase() === "application");
  const displayedApplications = hasApplicationDetailSection ? [] : (product.applications || []);
  const detailSections = product.detailSections || [];
  const longDetailSections = detailSections.filter(section => (section.body?.length || 0) > 760 || (section.items?.length || 0) > 6);
  const compactDetailSections = detailSections.filter(section => !longDetailSections.includes(section));
  const specChunks = chunkArray(specEntries, 9);
  const packageChunks = chunkArray(packageEntries, 8);
  const featureCardChunks = chunkArray(product.featureCards || [], 6);
  const featureChunks = chunkArray(uniqueStrings([...(product.highlights || []), ...(product.features || [])]), 8);
  const applicationChunks = chunkArray(displayedApplications, 6);
  const productSlides: React.ReactNode[] = [];
  const productSlideNames: string[] = [];
  const addSlide = (name: string, node: React.ReactNode) => {
    productSlideNames.push(name);
    productSlides.push(node);
  };
  const tone =
    product.brand === "merck" ? { bg: "bg-[#f4f8fb]", media: "bg-white/95 border-[#d7e5f2]", image: "aspect-[5/4]", grid: "lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.85fr)]", specLabel: "Water system properties", specTitle: "Purification specifications", detailLabel: "Merck source detail", detailTitle: "Description & applications", featureLabel: "Operational notes", featureTitle: "Features, benefits & uses" } :
    product.brand === "luminex" ? { bg: "bg-[#f3fbff]", media: "bg-white/95 border-[#cfe6e6]", image: "aspect-[16/10]", grid: "lg:grid-cols-[minmax(0,0.82fr)_minmax(460px,1fr)]", specLabel: "Multiplex platform", specTitle: "Platform profile", detailLabel: "xMAP workflow", detailTitle: "Technology & instrument detail", featureLabel: "Assay development", featureTitle: "Features & applications" } :
    product.brand === "onelambda" ? { bg: "bg-[#fff8f8]", media: "bg-white border-[#f0d6d8]", image: "aspect-[3/2]", grid: "lg:grid-cols-[minmax(0,1.05fr)_minmax(390px,0.85fr)]", specLabel: "Transplant assay profile", specTitle: "Assay specifications", detailLabel: "Clinical lab use", detailTitle: "Transplant diagnostics detail", featureLabel: "HLA workflow", featureTitle: "Features & clinical applications" } :
    product.brand === "ngene" ? { bg: "bg-[#fff7f9]", media: "bg-white border-[#f1ccd6]", image: "aspect-[4/3]", grid: "lg:grid-cols-[minmax(0,0.95fr)_minmax(430px,0.88fr)]", specLabel: "Precision diagnostics profile", specTitle: "Panel specifications", detailLabel: "Clinical workflow", detailTitle: "Diagnostic panel detail", featureLabel: "Clinical utility", featureTitle: "Capabilities & applications" } :
    product.brand === "sugentech" ? { bg: "bg-[#f4f9ff]", media: "bg-white border-[#cfe0f0]", image: "aspect-[4/3]", grid: "lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.85fr)]", specLabel: "Rapid diagnostics profile", specTitle: "Device and kit specifications", detailLabel: "Workflow detail", detailTitle: "Clinical use profile", featureLabel: "Assay notes", featureTitle: "Features & applications" } :
    product.brand === "cytek" ? { bg: "bg-[#eff8f8]", media: "bg-white border-[#cfe6e6]", image: "aspect-[4/3]", grid: "lg:grid-cols-[minmax(0,0.9fr)_minmax(450px,0.95fr)]", specLabel: "Flow cytometry system", specTitle: "Instrument specifications", detailLabel: "Platform detail", detailTitle: "Technology and workflow", featureLabel: "System capabilities", featureTitle: "Features & applications" } :
    product.brand === "rex" ? { bg: "bg-[#f5f9ff]", media: "bg-white border-[#d7e5f2]", image: "aspect-[4/3]", grid: "lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.86fr)]", specLabel: "Laboratory instrument profile", specTitle: "Meter specifications", detailLabel: "Measurement workflow", detailTitle: "Instrument detail", featureLabel: "Measurement notes", featureTitle: "Features & applications" } :
    product.brand === "hkm" ? { bg: "bg-[#f8fff7]", media: "bg-white border-[#d9ead5]", image: "aspect-square", grid: "lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)]", specLabel: "Catalogue profile", specTitle: "Media specifications", detailLabel: "Preparation & principle", detailTitle: "Culture media detail", featureLabel: "Lab use", featureTitle: "Features & applications" } :
    product.brand === "biolegend" ? { bg: "bg-[#fff7fb]", media: "bg-white border-[#f1cfe1]", image: "aspect-[4/3]", grid: "lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.72fr)]", specLabel: "Research reagent family", specTitle: "Representative catalogue profile", detailLabel: "Sourcing scope", detailTitle: "Family detail & source reference", featureLabel: "Variant sourcing", featureTitle: "Features & application scope" } :
    { bg: "bg-gradient-to-b from-muted/40 via-background to-background", media: "bg-background border-border", image: "aspect-[4/3]", grid: "lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]", specLabel: "Technical profile", specTitle: "Specifications at a glance", detailLabel: "Product detail", detailTitle: "Description & use cases", featureLabel: "Performance notes", featureTitle: "Features & applications" };

  addSlide("Overview",
    <section key="overview" className={`min-h-[100dvh] border-b border-border ${tone.bg}`}>
      <div className="container mx-auto px-6 md:px-12 pt-28 pb-16">
        <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="max-w-[240px] truncate font-medium text-foreground">{product.name}</span>
        </nav>
        <div className={`grid ${tone.grid} items-center gap-10 xl:gap-14`}>
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap gap-2">
              {brand && <span className="rounded-sm px-3 py-1.5 text-xs font-bold text-white" style={{ background: brand.accent }}>{brand.short}</span>}
              {category && <span className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground">{category.icon}{category.name}</span>}
              {product.featured && <span className="rounded-sm border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600">Featured</span>}
            </div>
            <h1 className="mb-5 max-w-4xl break-words font-[var(--app-font-heading)] text-3xl font-black leading-[1.02] tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-4xl md:text-[52px]">{product.name}</h1>
            {product.subtitle && <p className="mb-4 text-base font-bold leading-relaxed md:text-xl" style={{ color: brandAccent }}>{product.subtitle}</p>}
            <p className="mb-6 max-w-3xl break-words text-base leading-relaxed text-muted-foreground [overflow-wrap:anywhere] md:text-[17px]">{product.description}</p>
            {quickSpecs.length > 0 && (
              <div className="mb-7 grid gap-3 sm:grid-cols-2">
                {quickSpecs.map(([k, v]) => (
                  <div key={k} className="min-w-0 border border-border bg-background/85 p-4">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{k}</div>
                    <div className="line-clamp-3 break-words text-sm font-semibold leading-snug text-foreground [overflow-wrap:anywhere]">{v}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 grid gap-3 sm:flex">
              <Button asChild size="lg" className="w-full rounded-none sm:w-auto"><a href="/#contact">Request a Quote <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
              <Button asChild variant="outline" size="lg" className="w-full rounded-none sm:w-auto"><Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> All Products</Link></Button>
            </div>
          </div>
          <div className={`min-w-0 border p-5 shadow-sm md:p-6 ${tone.media}`}>
            <div className={`mb-5 flex ${tone.image} items-center justify-center overflow-hidden border border-border/60 bg-gradient-to-br from-background via-muted/20 to-background`}>
              <ProductMedia product={product} />
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              {product.catalogueNumber && (
                <div className="border border-border p-3">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Catalogue</div>
                  <div className="font-mono text-foreground">{product.catalogueNumber}</div>
                </div>
              )}
              {product.subcategory && (
                <div className="border border-border p-3">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Family</div>
                  <div className="break-words font-semibold leading-snug text-foreground">{product.subcategory}</div>
                </div>
              )}
              {packagingSummary && (
                <div className="border border-border p-3 sm:col-span-2">
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Pack / size</div>
                  <div className="break-words font-semibold leading-snug text-foreground">{packagingSummary}</div>
                </div>
              )}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {documentUrl && (
                <Button asChild className="w-full rounded-none">
                  <a href={documentUrl} target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" /> Download Brochure</a>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full rounded-none">
                <a href="/#contact">Discuss Product <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  specChunks.forEach((chunk, index) => addSlide(index ? `Specs ${index + 1}` : "Specifications",
    <section key={`specs-${index}`} className="min-h-[100dvh] border-b border-border bg-background">
      <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: brandAccent }}>{tone.specLabel}</div>
            <h2 className="font-[var(--app-font-heading)] text-2xl font-black text-foreground md:text-4xl">{index ? `${tone.specTitle} ${index + 1}` : tone.specTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">Important product properties are split into scan-friendly chapters so pack sizes, output, compatibility and operating details stay readable.</p>
          </div>
          {documentUrl && (
            <Button asChild variant="outline" className="rounded-none">
              <a href={documentUrl} target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" /> Download Brochure</a>
            </Button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chunk.map(([k, v]) => (
            <div key={k} className="min-w-0 border border-border bg-background p-5 transition-all hover:border-primary/40 hover:shadow-sm">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{k}</div>
              <div className="break-words text-sm font-semibold leading-relaxed text-foreground [overflow-wrap:anywhere] md:text-[15px]">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ));

  packageChunks.forEach((chunk, index) => addSlide(index ? `Packs ${index + 1}` : "Pack Sizes",
    <section key={`packaging-${index}`} className="min-h-[100dvh] border-b border-border bg-muted/20">
      <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
        <div className="mb-8 max-w-3xl">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: brandAccent }}>Ordering information</div>
          <h2 className="font-[var(--app-font-heading)] text-2xl font-black text-foreground md:text-4xl">Available pack sizes and catalogue variants</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">Pack information is surfaced separately because it is one of the first things procurement teams need when comparing product options.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {chunk.map(([name, value]) => (
            <div key={name} className="border border-border bg-background p-5">
              <Package className="mb-5 h-6 w-6" style={{ color: brandAccent }} />
              <h3 className="font-[var(--app-font-heading)] text-lg font-black text-foreground">{name}</h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ));

  if (compactDetailSections.length) {
    addSlide("Details",
      <section key="details" className="min-h-[100dvh] border-b border-border bg-muted/20">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: brandAccent }}>{tone.detailLabel}</div>
            <h2 className="font-[var(--app-font-heading)] text-2xl font-black text-foreground md:text-4xl">{tone.detailTitle}</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {compactDetailSections.map((section, i) => (
              <section key={`${section.title}-${i}`} className="min-w-0 border border-border bg-background p-6 md:p-7">
                <h2 className="mb-4 break-words text-2xl font-bold">{section.title}</h2>
                {section.body && <p className="break-words text-base leading-relaxed text-muted-foreground">{section.body}</p>}
                {section.items && section.items.length > 0 && <FeatureBullets items={section.items} accent={brandAccent} />}
              </section>
            ))}
          </div>
        </div>
      </section>
    );
  }

  longDetailSections.forEach((section, index) => addSlide(section.title.length > 16 ? `Detail ${index + 1}` : section.title,
    <section key={`detail-long-${section.title}-${index}`} className="min-h-[100dvh] border-b border-border bg-background">
      <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
        <div className="grid gap-8 lg:grid-cols-[0.68fr_1fr]">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: brandAccent }}>{tone.detailLabel}</div>
            <h2 className="font-[var(--app-font-heading)] text-3xl font-black leading-tight text-foreground md:text-5xl">{section.title}</h2>
          </div>
          <div className="border border-border bg-muted/20 p-6 md:p-8">
            {section.body && <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{section.body}</p>}
            {section.items && section.items.length > 0 && <div className="mt-6"><FeatureBullets items={section.items} accent={brandAccent} /></div>}
          </div>
        </div>
      </div>
    </section>
  ));

  featureCardChunks.forEach((chunk, index) => addSlide(index ? `Capabilities ${index + 1}` : "Capabilities",
    <section key={`feature-cards-${index}`} className="min-h-[100dvh] border-b border-border bg-muted/20">
      <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
        <div className="mb-8 max-w-3xl">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: brandAccent }}>{tone.featureLabel}</div>
          <h2 className="font-[var(--app-font-heading)] text-2xl font-black text-foreground md:text-4xl">Product capabilities</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chunk.map((card, cardIndex) => (
            <div key={card.title} className="border border-border bg-background p-5 md:p-6">
              <div className="mb-4 flex h-9 w-9 items-center justify-center border text-sm font-black" style={{ borderColor: `${brandAccent}55`, color: brandAccent }}>
                {cardIndex + 1}
              </div>
              <h3 className="font-[var(--app-font-heading)] text-xl font-black text-foreground">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ));

  const maxFeatureApplicationSlides = Math.max(featureChunks.length, applicationChunks.length);
  for (let i = 0; i < maxFeatureApplicationSlides; i += 1) {
    addSlide(i ? `Use Cases ${i + 1}` : "Use Cases",
      <section key={`features-${i}`} className="min-h-[100dvh] border-b border-border bg-background">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: brandAccent }}>{tone.featureLabel}</div>
            <h2 className="font-[var(--app-font-heading)] text-2xl font-black text-foreground md:text-4xl">{tone.featureTitle}</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {featureChunks[i]?.length ? (
              <div className="border border-border bg-muted/20 p-6 md:p-7">
                <h3 className="mb-5 text-xl font-bold">Features &amp; Benefits</h3>
                <FeatureBullets items={featureChunks[i]} accent={brandAccent} />
              </div>
            ) : <div className="hidden lg:block" />}
            {applicationChunks[i]?.length ? (
              <div className="border border-border bg-muted/20 p-6 md:p-7">
                <h3 className="mb-5 text-xl font-bold">Applications</h3>
                <FeatureBullets items={applicationChunks[i]} accent={brandAccent} />
              </div>
            ) : <div className="hidden lg:block" />}
          </div>
        </div>
      </section>
    );
  }

  if (allRelated.length) {
    addSlide("Related",
      <section key="related" className="min-h-[100dvh] border-b border-border bg-muted/20">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: brandAccent }}>Continue browsing</div>
              <h3 className="font-[var(--app-font-heading)] text-2xl font-black md:text-4xl">Related products</h3>
            </div>
            <Button asChild variant="outline" className="rounded-none"><Link href="/products">All Products <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {allRelated.map(p => <RelatedCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    );
  }

  addSlide("Contact",
    <section key="footer" className="min-h-[100dvh] bg-foreground text-background">
      <SiteFooter />
    </section>
  );

  return (
    <div className="h-[100dvh] bg-background overflow-hidden">
      <SiteNavbar forceSolid />
      <ProductSlideDeck sections={productSlides} names={productSlideNames} accent={brandAccent} resetKey={product.id} />
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

  return <AdaptiveProductDetail product={product} />;

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
  const preferredQuickSpecKeys =
    product.brand === "merck" ? ["Output", "Operating parameters", "Resistivity", "Dimensions"] :
    product.brand === "luminex" ? ["Technology", "Portfolio area", "Catalogue approach", "Throughput"] :
    product.brand === "onelambda" ? ["HLA loci", "Specificities", "Detection method", "Sample type"] :
    product.brand === "hkm" ? ["Code", "Specification", "Official category", "Product family"] :
    product.brand === "biolegend" ? ["Portfolio group", "Catalogue approach", "Source", "Application"] :
    ["Output", "Operating parameters", "Technology", "Dimensions"];
  const quickSpecs = [
    ...preferredQuickSpecKeys
      .map(key => specEntries.find(([specKey]) => specKey === key))
      .filter(Boolean),
    ...specEntries.filter(([key]) => !preferredQuickSpecKeys.includes(key))
  ].slice(0, 4) as [string, string][];
  const documentUrl = product.brochure || product.specSheet;
  const hasApplicationDetailSection = product.detailSections?.some(section => section.title.trim().toLowerCase() === "application");
  const displayedApplications = hasApplicationDetailSection ? [] : (product.applications || []);
  const brandAccent = brand?.accent || "hsl(var(--primary))";
  const fallbackTone =
    product.brand === "merck" ? {
      overview: "bg-[#f6fbff]",
      grid: "lg:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.8fr)] items-start",
      media: "bg-white border-[#d7e5f2]",
      image: "aspect-[4/3]",
      technicalLabel: "Water system properties",
      technicalTitle: "Purification specifications",
      detailLabel: "Merck source detail",
      detailTitle: "Description & applications",
      featureLabel: "Operational notes",
      featureTitle: "Features, benefits & uses",
      detailGrid: "lg:grid-cols-2",
    } :
    product.brand === "luminex" ? {
      overview: "bg-[#f4fbfb]",
      grid: "lg:grid-cols-[minmax(0,0.85fr)_minmax(440px,1.05fr)] items-center",
      media: "bg-white border-[#cfe6e6]",
      image: "aspect-[16/10]",
      technicalLabel: "Multiplex platform",
      technicalTitle: "Platform profile",
      detailLabel: "xMAP workflow",
      detailTitle: "Technology & instrument detail",
      featureLabel: "Assay development",
      featureTitle: "Features & applications",
      detailGrid: "lg:grid-cols-[0.9fr_1.1fr]",
    } :
    product.brand === "onelambda" ? {
      overview: "bg-[#fbf8ff]",
      grid: "lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.85fr)] items-start",
      media: "bg-white border-[#e2d8f4]",
      image: "aspect-[3/2]",
      technicalLabel: "Transplant assay profile",
      technicalTitle: "Assay specifications",
      detailLabel: "Clinical lab use",
      detailTitle: "Transplant diagnostics detail",
      featureLabel: "HLA workflow",
      featureTitle: "Features & clinical applications",
      detailGrid: "lg:grid-cols-[1.1fr_0.9fr]",
    } :
    product.brand === "hkm" ? {
      overview: "bg-[#f8fff7]",
      grid: "lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)] items-start",
      media: "bg-white border-[#d9ead5]",
      image: "aspect-square",
      technicalLabel: "Catalogue profile",
      technicalTitle: "Media specifications",
      detailLabel: "Preparation & principle",
      detailTitle: "Culture media detail",
      featureLabel: "Lab use",
      featureTitle: "Features & applications",
      detailGrid: "lg:grid-cols-1",
    } :
    product.brand === "biolegend" ? {
      overview: "bg-[#fff7fb]",
      grid: "lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.72fr)] items-start",
      media: "bg-white border-[#f1cfe1]",
      image: "aspect-[4/3]",
      technicalLabel: "Research reagent family",
      technicalTitle: "Representative catalogue profile",
      detailLabel: "Sourcing scope",
      detailTitle: "Family detail & source reference",
      featureLabel: "Variant sourcing",
      featureTitle: "Features & application scope",
      detailGrid: "lg:grid-cols-2",
    } :
    {
      overview: "bg-gradient-to-b from-muted/40 via-background to-background",
      grid: "lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] items-start",
      media: "bg-background border-border",
      image: "aspect-[4/3]",
      technicalLabel: "Technical profile",
      technicalTitle: "Specifications at a glance",
      detailLabel: "Product detail",
      detailTitle: "Description & use cases",
      featureLabel: "Performance notes",
      featureTitle: "Features & applications",
      detailGrid: "lg:grid-cols-2",
    };
  const productSlides = [
    (
      <section key="overview" className={`min-h-[100dvh] border-b border-border ${fallbackTone.overview}`}>
          <div className="container mx-auto px-6 md:px-12 pt-28 pb-24">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 flex-wrap">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
              <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
            </nav>
            <div className={`grid ${fallbackTone.grid} gap-10 xl:gap-14 min-w-0`}>
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 mb-5">
                  {brand && <span className="px-3 py-1.5 text-xs font-bold text-white rounded-sm" style={{ background: brand.accent }}>{brand.short}</span>}
                  {category && <span className="px-3 py-1.5 text-xs text-muted-foreground border border-border flex items-center gap-1.5 rounded-sm">{category.icon}{category.name}</span>}
                  {product.featured && <span className="px-3 py-1.5 text-xs font-bold text-amber-600 border border-amber-200 bg-amber-50 rounded-sm">★ Featured</span>}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-[44px] font-[var(--app-font-heading)] font-black text-foreground leading-[1.04] tracking-tight mb-5 max-w-4xl break-words [overflow-wrap:anywhere] min-w-0">{product.name}</h1>
                <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-3xl break-words [overflow-wrap:anywhere] min-w-0">{product.description}</p>
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
                <div className="grid sm:flex gap-3 mt-8">
                  <Button asChild size="lg" className="rounded-none w-full sm:w-auto"><a href="/#contact">Request a Quote <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
                  <Button asChild variant="outline" size="lg" className="rounded-none w-full sm:w-auto"><Link href="/products"><ArrowLeft className="mr-2 h-4 w-4" /> All Products</Link></Button>
                </div>
              </div>
              <div className={`border ${fallbackTone.media} p-5 md:p-6 shadow-sm min-w-0 w-full`}>
                <div className={`${fallbackTone.image} bg-muted/50 border border-border/60 flex items-center justify-center mb-5 overflow-hidden`}>
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
      </section>
    ),
    specEntries.length > 0 && (
      <section key="technical-profile" id="technical-profile" className="min-h-[100dvh] border-b border-border bg-background">
        <div className="container mx-auto px-6 md:px-12 pt-28 pb-14 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: brandAccent }}>{fallbackTone.technicalLabel}</div>
                <h2 className="text-2xl md:text-3xl font-[var(--app-font-heading)] font-black text-foreground">{fallbackTone.technicalTitle}</h2>
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
          </div>
      </section>
    ),
    product.detailSections && product.detailSections.length > 0 && (
      <section key="details" className="min-h-[100dvh] border-b border-border bg-muted/20">
          <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: brandAccent }}>{fallbackTone.detailLabel}</div>
              <h2 className="text-2xl md:text-3xl font-[var(--app-font-heading)] font-black text-foreground">{fallbackTone.detailTitle}</h2>
            </div>
            <div className={`grid ${fallbackTone.detailGrid} gap-5`}>
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
      </section>
    ),
    (product.highlights || product.features || displayedApplications.length > 0) && (
      <section key="features" className="min-h-[100dvh] border-b border-border bg-background">
          <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: brandAccent }}>{fallbackTone.featureLabel}</div>
              <h2 className="text-2xl md:text-3xl font-[var(--app-font-heading)] font-black text-foreground">{fallbackTone.featureTitle}</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              {(product.highlights || product.features) && <div><h3 className="text-xl font-bold mb-5">Features &amp; Benefits</h3><ul className="space-y-3">{[...(product.highlights || []), ...(product.features || [])].map((f,i) => <li key={i} className="flex gap-3 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{f}</li>)}</ul></div>}
              {displayedApplications.length > 0 && <div><h3 className="text-xl font-bold mb-5">Applications</h3><ul className="space-y-3">{displayedApplications.map((a,i) => <li key={i} className="flex gap-3 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{a}</li>)}</ul></div>}
            </div>
          </div>
      </section>
    ),
    allRelated.length > 0 && (
      <section key="related" className="min-h-[100dvh] border-b border-border bg-muted/20">
          <div className="container mx-auto px-6 md:px-12 pt-28 pb-14">
            <h3 className="text-xl font-bold mb-6">Related Products</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {allRelated.map(p => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
      </section>
    ),
    (
      <section key="footer" className="min-h-[100dvh] bg-foreground text-background">
        <SiteFooter />
      </section>
    ),
  ].filter(Boolean) as React.ReactNode[];

  const productSlideNames = [
    "Overview",
    specEntries.length > 0 && "Specifications",
    product.detailSections && product.detailSections.length > 0 && "Details",
    (product.highlights || product.features || displayedApplications.length > 0) && "Features",
    allRelated.length > 0 && "Related",
    "Contact",
  ].filter(Boolean) as string[];

  return (
    <div className="h-[100dvh] bg-background overflow-hidden">
      <SiteNavbar forceSolid />
      <ProductSlideDeck sections={productSlides} names={productSlideNames} accent={brandAccent} resetKey={product.id} />
    </div>
  );
}
