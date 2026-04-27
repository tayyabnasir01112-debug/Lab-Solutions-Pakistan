import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Microscope,
  Dna,
  Activity,
  HeartPulse,
  Syringe,
  TestTube,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function img(path: string) {
  return `${BASE}${path}`;
}

/* ─── Shared animation variants ──────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

/* ─── Scroll-reveal wrapper ───────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const initial =
    direction === "up"
      ? { opacity: 0, y: 40 }
      : direction === "left"
      ? { opacity: 0, x: -40 }
      : direction === "right"
      ? { opacity: 0, x: 40 }
      : { opacity: 0 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Intro Splash ────────────────────────────────────────────── */
function IntroSplash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-primary/8"
            style={{ left: `${(i + 1) * (100 / 7)}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Logo group */}
      <motion.div
        className="flex flex-col items-center gap-6 relative z-10"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* Glow halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10 blur-3xl"
          initial={{ scale: 0 }}
          animate={{ scale: 2.5, opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
        />

        <img
          src={img("/images/sc-logo.png")}
          alt="Science Centre"
          className="h-24 w-auto object-contain drop-shadow-lg"
        />

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase font-medium">
            Pakistan
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2.0, delay: 0.3, ease: "linear" }}
      />
    </motion.div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────── */

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center pt-24 pb-12 overflow-hidden bg-background">
      {/* Parallax bg image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/20 z-10" />
        <motion.img
          src={img("/images/sc-hero.png")}
          alt="Advanced Multiplex Analyzer"
          style={{ y: imgY }}
          className="w-full h-[115%] object-cover object-right absolute top-0 left-0"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6 rounded-none"
            variants={fadeUp}
            custom={0.05}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Flagship Product: LABScan3D™
          </motion.div>

          {/* H1 line 1 */}
          <div className="overflow-hidden">
            <motion.h1
              className="text-5xl md:text-7xl font-[var(--app-font-heading)] font-bold text-foreground leading-[1.1] tracking-tight"
              variants={fadeUp}
              custom={0.15}
              initial="hidden"
              animate={visible ? "visible" : "hidden"}
            >
              The Most Advanced
            </motion.h1>
          </div>

          {/* H1 line 2 gradient */}
          <div className="overflow-hidden mb-6">
            <motion.div
              className="text-5xl md:text-7xl font-[var(--app-font-heading)] font-bold leading-[1.1] tracking-tight"
              variants={fadeUp}
              custom={0.25}
              initial="hidden"
              animate={visible ? "visible" : "hidden"}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Multiplex Analyzer.
              </span>
            </motion.div>
          </div>

          {/* Subtext */}
          <motion.p
            className="text-xl text-muted-foreground font-light mb-8 max-w-2xl leading-relaxed"
            variants={fadeUp}
            custom={0.35}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
          >
            500 Unique Bead Regions. Built for Breakthrough Science.
            <br />
            Pakistan&apos;s premier B2B distributor of advanced laboratory equipment, analytical
            instruments, and molecular biology tools.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4"
            variants={fadeUp}
            custom={0.45}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
          >
            <Button
              asChild
              size="lg"
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base group"
            >
              <a href="#products">
                Explore LABScan3D™
                <motion.span
                  className="inline-flex ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none h-14 px-8 text-base border-border hover:bg-muted"
            >
              <a href="#solutions">View All Solutions</a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-primary to-transparent"
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Partners ────────────────────────────────────────────────── */
const partnerBrands = [
  {
    name: "Luminex",
    sub: "Bio-Rad Company",
    color: "#0077C8",
    bg: "from-blue-600/10 to-blue-500/5",
    border: "border-blue-500/20",
    initial: "LX",
    weight: "font-black",
  },
  {
    name: "Merck",
    sub: "Sigma-Aldrich",
    color: "#E8262A",
    bg: "from-red-600/10 to-red-500/5",
    border: "border-red-500/20",
    initial: "M",
    weight: "font-black",
  },
  {
    name: "One Lambda",
    sub: "Thermo Fisher Scientific",
    color: "#F37021",
    bg: "from-orange-500/10 to-orange-400/5",
    border: "border-orange-500/20",
    initial: "OL",
    weight: "font-bold",
  },
  {
    name: "cytognos",
    sub: "Flow Cytometry",
    color: "#CC0000",
    bg: "from-red-700/10 to-red-600/5",
    border: "border-red-600/20",
    initial: "●",
    weight: "font-bold",
  },
  {
    name: "DWK Life Sciences",
    sub: "Lab Glassware",
    color: "#005BAC",
    bg: "from-blue-700/10 to-blue-600/5",
    border: "border-blue-600/20",
    initial: "DWK",
    weight: "font-bold",
  },
  {
    name: "KERN",
    sub: "Precision Instruments",
    color: "#003087",
    bg: "from-indigo-700/10 to-indigo-600/5",
    border: "border-indigo-600/20",
    initial: "K",
    weight: "font-black",
  },
  {
    name: "CNW",
    sub: "Chromatography",
    color: "#2E7D32",
    bg: "from-green-700/10 to-green-600/5",
    border: "border-green-600/20",
    initial: "CNW",
    weight: "font-bold",
  },
  {
    name: "Meso Scale",
    sub: "Diagnostics",
    color: "#7B2D8B",
    bg: "from-purple-700/10 to-purple-600/5",
    border: "border-purple-600/20",
    initial: "MSD",
    weight: "font-bold",
  },
];

function Partners() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [paused, setPaused] = useState(false);

  // Two rows — row 2 is a different order for visual variety
  const row1 = partnerBrands;
  const row2 = [...partnerBrands.slice(4), ...partnerBrands.slice(0, 4)];

  const BrandPill = ({ brand }: { brand: typeof partnerBrands[0] }) => (
    <div
      className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border mx-2 group cursor-default transition-all duration-300 hover:scale-105"
      style={{
        borderColor: brand.color + "30",
        background: brand.color + "08",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="text-[11px] font-black tracking-[0.14em] px-2 py-0.5"
        style={{ color: brand.color, background: brand.color + "18" }}
      >
        {brand.initial}
      </div>
      <div>
        <div className="text-sm font-[var(--app-font-heading)] font-bold text-foreground leading-none mb-0.5 whitespace-nowrap">
          {brand.name}
        </div>
        <div className="text-[10px] text-muted-foreground font-medium tracking-wide whitespace-nowrap">
          {brand.sub}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={ref} id="partners" className="py-16 border-y border-border overflow-hidden">
      {/* Header — compact, inline */}
      <div className="container mx-auto px-6 md:px-12 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="w-6 h-px bg-primary" />
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
              Trusted Partnerships
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-xs font-medium tracking-wide"
          >
            Official distributor of 8+ globally recognized scientific brands across Pakistan
          </motion.p>
        </div>
      </div>

      {/* Marquee rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-3"
      >
        {/* Row 1 — scrolls left */}
        <div className="relative flex overflow-hidden">
          {/* Edge fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--background), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--background), transparent)" }} />

          <div
            className="flex"
            style={{
              animation: paused ? "none" : "marquee-left 28s linear infinite",
              willChange: "transform",
            }}
          >
            {[...row1, ...row1, ...row1].map((brand, i) => (
              <BrandPill key={i} brand={brand} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="relative flex overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--background), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--background), transparent)" }} />

          <div
            className="flex"
            style={{
              animation: paused ? "none" : "marquee-right 34s linear infinite",
              willChange: "transform",
            }}
          >
            {[...row2, ...row2, ...row2].map((brand, i) => (
              <BrandPill key={i} brand={brand} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

/* ─── Solutions ───────────────────────────────────────────────── */
const solutions = [
  {
    icon: <HeartPulse className="h-5 w-5" />,
    title: "Transplant Diagnostics",
    short: "Kidney, Liver, Bone-Marrow, Heart, Lungs",
    desc: "End-to-end HLA typing, antibody screening, and crossmatch workflows for solid organ and stem-cell transplant programs.",
    image: "/images/sc-diagnostics.png",
    accent: "#0F4C81",
  },
  {
    icon: <Dna className="h-5 w-5" />,
    title: "Life Sciences",
    short: "Genomics, Proteomics, Cell Analysis",
    desc: "Research-grade reagents, antibodies and instruments powering tier-1 academic and pharmaceutical discovery labs.",
    image: "/images/sc-hero.png",
    accent: "#2EA3F2",
  },
  {
    icon: <Microscope className="h-5 w-5" />,
    title: "Molecular Biology",
    short: "DNA / RNA extraction, qPCR, NGS",
    desc: "Real-time PCR systems, NGS panels, and sample-to-answer molecular workflows for clinical and research applications.",
    image: "/images/sc-instruments.png",
    accent: "#5E2A84",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Immunology",
    short: "Immunoassay & Flow Cytometry",
    desc: "Full-spectrum cytometers, multiplex bead assays, and validated antibody panels for high-parameter immune profiling.",
    image: "/images/sc-diagnostics.png",
    accent: "#00A19A",
  },
  {
    icon: <TestTube className="h-5 w-5" />,
    title: "Analytical / Chromatography",
    short: "Precision separation & analysis",
    desc: "Chromatography columns, spectrophotometers, and analytical chemistry reagents — sourced from market leaders.",
    image: "/images/sc-instruments.png",
    accent: "#D71920",
  },
  {
    icon: <Syringe className="h-5 w-5" />,
    title: "Labware & Consumables",
    short: "Critical-grade equipment",
    desc: "Centrifuges, incubators, biosafety cabinets, filters and plasticware — engineered for repeatable everyday performance.",
    image: "/images/sc-hero.png",
    accent: "#7A8B99",
  },
];

function Solutions() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="solutions" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="grid md:grid-cols-12 gap-8 mb-14 md:mb-20">
          <div className="md:col-span-6">
            <Reveal>
              <div className="text-xs font-bold tracking-[0.18em] text-primary uppercase mb-4">
                Focus Areas
              </div>
              <h3 className="text-3xl md:text-5xl font-[var(--app-font-heading)] font-bold text-foreground leading-[1.05] tracking-tight">
                Comprehensive Solutions <br className="hidden md:block" />
                for Clinical Precision.
              </h3>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:pl-12 flex md:items-end">
            <Reveal delay={0.1}>
              <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed max-w-md">
                Across six clinical and research focus areas, we partner with the world's most
                trusted manufacturers to deliver end-to-end laboratory solutions.
              </p>
            </Reveal>
          </div>
        </div>

        {/* ngenebio-style: single image behind all panels, colored overlay on hover */}
        <div className="relative flex h-[520px] md:h-[600px] w-full overflow-hidden">

          {/* Single shared background image */}
          <img
            src={img("/images/sc-hero.png")}
            alt="Lab background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark tint over whole image */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Panels on top */}
          {solutions.map((s, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                animate={{ flex: isActive ? 4 : 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden cursor-pointer"
                style={{ minWidth: 0 }}
              >
                {/* Colored overlay - only on hover */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ backgroundColor: s.accent + "e0" }}
                />

                {/* Thin right border between panels */}
                {i < solutions.length - 1 && (
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20 z-10" />
                )}

                {/* Collapsed: just title at bottom */}
                <motion.div
                  className="absolute inset-0 flex items-end p-6"
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="text-white font-[var(--app-font-heading)] font-bold text-base md:text-lg leading-snug drop-shadow-md">
                    {s.title}
                  </h4>
                </motion.div>

                {/* Expanded content */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-between p-8 md:p-10 z-10"
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: isActive ? 0.15 : 0 }}
                >
                  {/* Top icon */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-sm bg-white/20 text-white">
                    {s.icon}
                  </div>

                  {/* Bottom: title + desc + arrow */}
                  <div>
                    <h4 className="font-[var(--app-font-heading)] text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight mb-4">
                      {s.title}
                    </h4>
                    <p className="text-white/85 text-sm md:text-[15px] font-light leading-relaxed mb-8 max-w-xs">
                      {s.desc}
                    </p>
                    <div className="w-12 h-12 rounded-full border border-dashed border-white/70 flex items-center justify-center text-white hover:bg-white/15 transition-all duration-300">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ─── Products ────────────────────────────────────────────────── */
const products = [
  {
    name: "LABScan3D™",
    brand: "Luminex",
    category: "Multiplex Analysis",
    accent: "#0077C8",
    desc: "The world's most advanced multiplex analyzer with 500 unique bead regions — delivering up to 500 analytes per sample simultaneously.",
    specs: ["500 bead regions", "High-throughput", "Automated workflow", "FDA-cleared"],
  },
  {
    name: "Guava® easyCyte™",
    brand: "Merck",
    category: "Flow Cytometry",
    accent: "#E8262A",
    desc: "Benchtop flow cytometers providing powerful multi-parameter cellular analysis with industry-leading sensitivity and reproducibility.",
    specs: ["3 lasers / 14 parameters", "Benchtop design", "Capillary-based", "GxP compliant"],
  },
  {
    name: "Guava® Muse®",
    brand: "Merck",
    category: "Cell Analysis",
    accent: "#7B2D8B",
    desc: "Compact cell analyzer offering highly accurate and precise cell counts and viability using fluorescence-based detection technology.",
    specs: ["Cell viability", "Rapid results", "Compact footprint", "Pre-optimized kits"],
  },
  {
    name: "Amnis® ImageStream® X Mk II",
    brand: "Merck",
    category: "Imaging Flow Cytometry",
    accent: "#2E7D32",
    desc: "Combines the statistical power of flow cytometry with the resolution of microscopy — capturing up to 12 images per cell in real time.",
    specs: ["12-channel imaging", "60× magnification", "IDEAS® software", "10,000 cells/sec"],
  },
  {
    name: "Amnis® CellStream®",
    brand: "Merck",
    category: "Flow Cytometry",
    accent: "#F37021",
    desc: "A compact flow cytometer with unprecedented sensitivity and dynamic range, ideal for challenging samples and rare cell populations.",
    specs: ["4 lasers / 16 parameters", "High sensitivity", "Rare cell detection", "Low sample volume"],
  },
  {
    name: "MAGPIX®",
    brand: "Luminex",
    category: "Multiplex Immunoassay",
    accent: "#005BAC",
    desc: "The most affordable and compact multiplexing platform — delivering lab-quality results for up to 50 analytes from a single sample.",
    specs: ["50-plex capability", "CLIA-waived", "Compact design", "Cloud connectivity"],
  },
];

function FeaturedProducts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const DURATION = 4000;

  const startTimer = () => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        setCurrent(c => (c + 1) % products.length);
      }
    }, 30);
  };

  useEffect(() => {
    if (hovered !== null) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current, hovered]);

  const go = (i: number) => { setCurrent(i); };
  const prev = () => go((current - 1 + products.length) % products.length);
  const next = () => go((current + 1) % products.length);

  const p = products[current];

  return (
    <section ref={ref} id="products" className="py-24 bg-background border-t border-border overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.div className="text-xs font-bold tracking-[0.18em] text-primary uppercase mb-3"
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              Featured Instruments
            </motion.div>
            <motion.h3 className="text-3xl md:text-5xl font-[var(--app-font-heading)] font-bold text-foreground tracking-tight leading-tight"
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.05 }}>
              Institutional Confidence<br className="hidden md:block" /> in Every Instrument.
            </motion.h3>
          </div>
          <motion.div className="flex gap-3"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.15 }}>
            <Button asChild className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-6">
              <Link href="/products">Browse All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none border-border px-6">
              <a href="#contact">Request Quote</a>
            </Button>
          </motion.div>
        </div>

        {/* Main Slideshow */}
        <motion.div className="relative w-full h-[420px] md:h-[520px] overflow-hidden"
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>

          {/* Background layer */}
          <AnimatePresence mode="sync">
            <motion.div key={"bg-" + current}
              className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              style={{ background: `linear-gradient(135deg, ${p.accent}22 0%, ${p.accent}08 50%, transparent 100%)` }}
            />
          </AnimatePresence>

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

          {/* Border */}
          <div className="absolute inset-0 border border-border" />

          {/* Left: main content */}
          <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.div key={"tag-" + current} className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <span className="text-xs font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm"
                    style={{ color: p.accent, background: p.accent + "20", border: `1px solid ${p.accent}40` }}>
                    {p.brand}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium tracking-wide hidden md:block">
                    {p.category}
                  </span>
                </motion.div>
              </AnimatePresence>
              {/* Counter */}
              <div className="text-muted-foreground text-xs font-bold tracking-[0.2em]">
                <span className="text-foreground">{String(current + 1).padStart(2, "0")}</span>
                <span className="mx-2">/</span>
                {String(products.length).padStart(2, "0")}
              </div>
            </div>

            {/* Center: big instrument name */}
            <AnimatePresence mode="wait">
              <motion.div key={"name-" + current}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                <div className="text-muted-foreground text-xs font-bold tracking-[0.25em] uppercase mb-4">
                  Focus Instrument
                </div>
                <h2 className="font-[var(--app-font-heading)] font-black text-foreground leading-none tracking-tight"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
                  {p.name}
                </h2>
                <p className="text-muted-foreground text-base md:text-lg font-light mt-5 max-w-xl leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Bottom: progress + nav */}
            <div className="flex items-center justify-between gap-6">
              {/* Progress bar */}
              <div className="flex-1 h-px bg-border relative overflow-hidden max-w-xs">
                <motion.div className="absolute left-0 top-0 h-full"
                  style={{ width: `${progress}%`, backgroundColor: p.accent }}
                  transition={{ duration: 0 }} />
              </div>
              {/* Dot nav */}
              <div className="flex items-center gap-2">
                {products.map((_, i) => (
                  <button key={i} onClick={() => go(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === current ? "24px" : "6px",
                      height: "6px",
                      backgroundColor: i === current ? p.accent : "var(--border)",
                    }} />
                ))}
              </div>
              {/* Arrows */}
              <div className="flex gap-2">
                {[{ fn: prev, label: "←" }, { fn: next, label: "→" }].map(({ fn, label }) => (
                  <button key={label} onClick={fn}
                    className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200 text-sm font-bold">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: specs panel (desktop only) */}
          <AnimatePresence mode="wait">
            <motion.div key={"specs-" + current}
              className="absolute right-0 top-0 bottom-0 w-64 hidden lg:flex flex-col justify-center p-8 border-l border-border"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-5">
                Key Specs
              </div>
              <div className="space-y-3">
                {p.specs.map((spec, i) => (
                  <motion.div key={i} className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.accent }} />
                    <span className="text-sm text-foreground font-medium">{spec}</span>
                  </motion.div>
                ))}
              </div>
              <a href="#contact"
                className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
                style={{ color: p.accent }}>
                Request Quote <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Thumbnail strip with hover popup */}
        <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
          {products.map((prod, i) => {
            const isActive = i === current;
            const isHov = hovered === i;
            return (
              <div key={i} className="relative"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <motion.button
                  onClick={() => go(i)}
                  className="w-full p-3 md:p-4 text-left border transition-all duration-300 relative overflow-hidden"
                  style={{
                    borderColor: isActive ? prod.accent : "var(--border)",
                    background: isActive ? prod.accent + "12" : "transparent",
                  }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div layoutId="active-thumb"
                      className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: prod.accent }} />
                  )}
                  <div className="text-[10px] font-bold tracking-wide uppercase mb-1"
                    style={{ color: isActive ? prod.accent : "var(--muted-foreground)" }}>
                    {prod.brand}
                  </div>
                  <div className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                    {prod.name}
                  </div>
                </motion.button>

                {/* Hover popup */}
                <AnimatePresence>
                  {isHov && (
                    <motion.div
                      className="absolute bottom-full left-1/2 mb-3 w-64 z-50 pointer-events-none"
                      style={{ x: "-50%" }}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                      {/* Arrow */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-3 h-3 rotate-45 border-r border-b border-border"
                        style={{ backgroundColor: "var(--background)" }} />
                      {/* Card */}
                      <div className="bg-background border border-border p-5 shadow-2xl">
                        {/* Top accent bar */}
                        <div className="h-0.5 w-full mb-4 rounded-full" style={{ backgroundColor: prod.accent }} />
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold tracking-[0.18em] uppercase px-2 py-1 rounded-sm"
                            style={{ color: prod.accent, background: prod.accent + "18" }}>
                            {prod.brand}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">{prod.category}</span>
                        </div>
                        <div className="font-[var(--app-font-heading)] font-bold text-foreground text-sm mb-2 leading-snug">
                          {prod.name}
                        </div>
                        <p className="text-muted-foreground text-xs font-light leading-relaxed mb-4">
                          {prod.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {prod.specs.slice(0, 3).map((s, si) => (
                            <span key={si} className="text-[10px] font-medium px-2 py-0.5 border border-border text-muted-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Animated stat ───────────────────────────────────────────── */
function AnimatedStat({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="text-5xl font-[var(--app-font-heading)] font-bold text-primary mb-2"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {value}
      </motion.div>
      <div className="text-lg font-medium mb-1">{label}</div>
      <p className="text-background/60 text-sm font-light">{sub}</p>
    </motion.div>
  );
}

/* ─── Credibility ─────────────────────────────────────────────── */
function Credibility() {
  return (
    <section id="about" className="py-24 bg-foreground text-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <img
          src={img("/images/sc-diagnostics.png")}
          alt="Diagnostics Abstract"
          className="w-full h-full object-cover mix-blend-screen"
        />
      </div>
      {/* Subtle animated grid overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <Reveal direction="none">
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">
              Our Heritage
            </h2>
            <h3 className="text-4xl md:text-6xl font-[var(--app-font-heading)] font-bold mb-12 leading-tight">
              39 Years of Scientific <br className="hidden md:block" /> Excellence.
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-background/20 pt-12">
            <AnimatedStat value="1985" label="Established" sub="Serving Pakistan's scientific community for decades." delay={0.1} />
            <AnimatedStat value="Tier-1" label="Official Partners" sub="Representing Luminex and Merck in the region." delay={0.2} />
            <AnimatedStat value="Nationwide" label="Distribution" sub="Comprehensive coverage across all major cities." delay={0.3} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Offices ──────────────────────────────────────────────── */
const offices = [
  { city: "Rawalpindi", province: "Punjab", address: "3287 Adamjee Road Saddar", phone: "+92 51-5568464", main: true },
  { city: "Karachi", province: "Sindh", address: "A-69 Block S North Nazimabad", phone: "+92 312-3707215" },
  { city: "Peshawar", province: "KPK", address: "MF-4 Pak Medical Centre, Khyber Bazar", phone: "+92 91-2591920" },
  { city: "Lahore", province: "Punjab", address: "House 102-A Block PIA Society", phone: "+92 333-5491666" },
];

function Locations() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">
              Presence
            </h2>
            <h3 className="text-3xl md:text-5xl font-[var(--app-font-heading)] font-bold text-foreground">
              National Infrastructure
            </h3>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {offices.map((office, i) => (
            <Reveal key={i} delay={0.07 * i}>
              <motion.div
                className={`p-8 border h-full ${
                  office.main ? "bg-muted/50 border-primary/30" : "bg-background border-border"
                }`}
                whileHover={{ y: -3, borderColor: "hsl(var(--primary) / 0.4)" }}
                transition={{ duration: 0.2 }}
              >
                {office.main && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 mb-4 inline-block">
                    Head Office
                  </span>
                )}
                <h4 className="text-xl font-[var(--app-font-heading)] font-bold text-foreground mb-1">
                  {office.city}
                </h4>
                <p className="text-xs text-muted-foreground mb-4">{office.province}</p>
                <div className="flex items-start gap-3 mb-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-light">{office.address}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 shrink-0 text-primary" />
                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {office.phone}
                  </a>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─────────────────────────────────────────────────── */
function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <section id="contact" className="py-24 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal direction="left">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">
                Procurement &amp; Partnerships
              </h2>
              <h3 className="text-3xl md:text-5xl font-[var(--app-font-heading)] font-bold text-foreground mb-6">
                Let&apos;s Get to Know Each Other.
              </h3>
              <p className="text-muted-foreground font-light text-lg mb-8 max-w-md">
                Connect with our technical specialists to discuss your laboratory requirements and
                discover how we can elevate your research capabilities.
              </p>
              <div className="space-y-6">
                {[
                  { icon: <Mail className="h-5 w-5" />, label: "Email Us", value: "info@sciencecentre.com.pk", href: "mailto:info@sciencecentre.com.pk" },
                  { icon: <Phone className="h-5 w-5" />, label: "Call Us", value: "+92 51-5568464 | 5568498", href: "tel:+925155684645568498" },
                ].map(({ icon, label, value, href }) => (
                  <motion.div
                    key={label}
                    className="flex items-center gap-4"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="h-12 w-12 bg-background border border-border flex items-center justify-center text-primary shrink-0">
                      {icon}
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground font-medium">{label}</div>
                      <a href={href} className="font-semibold hover:text-primary transition-colors">
                        {value}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div className="bg-background border border-border p-8 md:p-12">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center h-full min-h-[300px] text-center"
                  >
                    <motion.div
                      className="h-16 w-16 bg-primary/10 border border-primary/30 flex items-center justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Mail className="h-8 w-8 text-primary" />
                    </motion.div>
                    <h4 className="text-xl font-[var(--app-font-heading)] font-bold mb-2">
                      Inquiry Received
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Our technical team will be in touch shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className="space-y-6"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">
                          Full Name
                        </Label>
                        <Input id="name" required placeholder="Dr. Jane Doe" className="rounded-none border-border h-12 bg-muted/50 focus-visible:ring-primary focus-visible:bg-background transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                          Email Address
                        </Label>
                        <Input id="email" type="email" required placeholder="jane@institution.edu" className="rounded-none border-border h-12 bg-muted/50 focus-visible:ring-primary focus-visible:bg-background transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Organization / Hospital
                      </Label>
                      <Input id="org" required placeholder="National Research Institute" className="rounded-none border-border h-12 bg-muted/50 focus-visible:ring-primary focus-visible:bg-background transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Inquiry Details
                      </Label>
                      <Textarea id="message" required placeholder="Please specify equipment requirements or applications..." className="rounded-none border-border min-h-[120px] bg-muted/50 focus-visible:ring-primary focus-visible:bg-background transition-colors" />
                    </div>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button type="submit" className="w-full rounded-none h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base mt-4">
                        Submit Inquiry
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */

/* ─── Root ────────────────────────────────────────────────────── */
export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-background selection:bg-primary selection:text-primary-foreground text-foreground">
      <AnimatePresence>{!splashDone && <IntroSplash onDone={() => setSplashDone(true)} />}</AnimatePresence>

      <SiteNavbar visible={splashDone} />

      <main>
        <Hero visible={splashDone} />
        <Partners />
        <Solutions />
        <FeaturedProducts />
        <Credibility />
        <Locations />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
