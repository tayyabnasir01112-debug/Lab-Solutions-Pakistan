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
function Partners() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <section ref={ref} id="partners" className="py-12 border-y border-border bg-muted/30">
      <div className="container mx-auto px-6 md:px-12">
        <motion.p
          className="text-center text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Official Partner of Globally Recognized Brands
        </motion.p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          {[
            {
              name: "LUMINEX",
              dot: <div className="h-4 w-4 bg-primary rounded-sm" />,
              bg: "bg-primary/20",
              delay: 0.1,
            },
            {
              name: "MERCK",
              dot: <div className="h-4 w-4 bg-blue-900 rounded-full" />,
              bg: "bg-blue-900/20",
              delay: 0.2,
            },
          ].map(({ name, dot, bg, delay }) => (
            <motion.div
              key={name}
              className="text-2xl md:text-3xl font-[var(--app-font-heading)] font-extrabold tracking-tight text-foreground flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={inView ? { opacity: 0.8, scale: 1 } : {}}
              transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.06 }}
            >
              <div className={`h-8 w-8 ${bg} rounded flex items-center justify-center`}>
                {dot}
              </div>
              {name}
            </motion.div>
          ))}
        </div>
      </div>
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

        {/* ngenebio-style horizontal expanding panels */}
        <div className="flex h-[540px] md:h-[620px] w-full overflow-hidden rounded-sm">
          {solutions.map((s, i) => {
            const isActive = active === i;
            return (
              <motion.div
                key={i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                animate={{ flex: isActive ? 4 : 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden cursor-pointer"
                style={{ minWidth: 0 }}
              >
                {/* Unique gradient background per solution */}
                <div
                  className="absolute inset-0 transition-all duration-700"
                  style={{
                    background: isActive
                      ? `linear-gradient(160deg, ${s.accent} 0%, ${s.accent}bb 50%, ${s.accent}66 100%)`
                      : `linear-gradient(160deg, ${s.accent}55 0%, ${s.accent}22 50%, #080810 100%)`,
                  }}
                />

                {/* Subtle dot pattern overlay */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Strong accent glow top */}
                <div
                  className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-2xl transition-all duration-700"
                  style={{ background: s.accent, opacity: isActive ? 0.5 : 0.25 }}
                />

                {/* Bottom fade */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2"
                  style={{
                    background: isActive
                      ? "linear-gradient(to top, rgba(0,0,0,0.4), transparent)"
                      : "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                  }}
                />

                {/* Collapsed state — icon + horizontal title at bottom */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-between p-5 md:p-6"
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Number top */}
                  <div className="text-white/40 text-xs font-bold tracking-[0.2em]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Icon + title bottom */}
                  <div className="flex flex-col gap-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-sm text-white"
                      style={{ backgroundColor: s.accent + "66", border: `1px solid ${s.accent}99` }}
                    >
                      {s.icon}
                    </div>
                    <h4 className="text-white font-[var(--app-font-heading)] font-bold text-sm leading-snug drop-shadow-lg">
                      {s.title}
                    </h4>
                    <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: s.accent }} />
                  </div>
                </motion.div>

                {/* Expanded content */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-between p-8 md:p-10"
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 24 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: isActive ? 0.18 : 0 }}
                >
                  {/* Top: number + icon */}
                  <div className="flex items-center justify-between">
                    <div className="text-white/40 text-xs font-bold tracking-[0.22em] uppercase">
                      Focus Area · {String(i + 1).padStart(2, "0")}
                    </div>
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-sm text-white"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                      {s.icon}
                    </div>
                  </div>

                  {/* Bottom: title + desc + arrow */}
                  <div>
                    <h4 className="font-[var(--app-font-heading)] text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight mb-4">
                      {s.title}
                    </h4>
                    <p className="text-white/70 text-sm md:text-[15px] font-light leading-relaxed mb-8 max-w-xs">
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-13 h-13 w-12 h-12 rounded-full border border-dashed border-white/50 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <span className="text-white/50 text-xs font-bold tracking-[0.15em] uppercase">
                        Learn more
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Thin divider between panels */}
                {i < solutions.length - 1 && (
                  <div className="absolute right-0 top-8 bottom-8 w-px bg-white/8 z-10" />
                )}
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
  { name: "LABScan3D™", brand: "Luminex", desc: "The world's most advanced multiplex analyzer with 500 unique bead regions." },
  { name: "Guava® easyCyte™", brand: "Merck", desc: "Benchtop flow cytometers providing powerful cellular analysis." },
  { name: "Guava® Muse®", brand: "Merck", desc: "Compact cell analyzer for highly accurate and precise cell counts." },
  { name: "Amnis® ImageStream® X Mk II", brand: "Merck", desc: "Combines the speed of flow cytometry with the resolution of microscopy." },
  { name: "Amnis® CellStream®", brand: "Merck", desc: "Compact flow cytometer with unprecedented sensitivity." },
];

function FeaturedProducts() {
  return (
    <section id="products" className="py-24 bg-card border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <Reveal>
              <h2 className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">
                Featured Instruments
              </h2>
              <h3 className="text-3xl md:text-5xl font-[var(--app-font-heading)] font-bold text-foreground leading-tight mb-6">
                Institutional Confidence in Every Instrument.
              </h3>
              <p className="text-muted-foreground text-lg font-light mb-8 max-w-lg">
                We distribute only the highest-tier analytical tools, trusted by tier-1 academic
                medical centers and pharmaceutical leaders worldwide.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-none bg-foreground text-background hover:bg-foreground/90 px-8">
                  <Link href="/products">
                    Browse Full Catalogue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none border-border hover:bg-muted px-8"
                >
                  <a href="#contact">Request Quote</a>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal direction="right" delay={0.1}>
            <div className="relative aspect-square md:aspect-[4/3] w-full">
              <div className="absolute inset-0 bg-primary/5 translate-x-4 translate-y-4 z-0" />
              <motion.img
                src={img("/images/sc-instruments.png")}
                alt="Laboratory analytical instruments"
                className="w-full h-full object-cover z-10 relative border border-border"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <motion.div
                className="bg-background border border-border p-6 flex flex-col cursor-pointer group h-full"
                whileHover={{
                  borderColor: "hsl(var(--primary))",
                  y: -4,
                  boxShadow: "0 12px 40px -8px hsl(var(--primary) / 0.15)",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="flex justify-between items-start mb-12">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1">
                    {p.brand}
                  </span>
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <h4 className="text-lg font-[var(--app-font-heading)] font-bold text-foreground mb-2 mt-auto">
                  {p.name}
                </h4>
                <p className="text-sm text-muted-foreground font-light">{p.desc}</p>
              </motion.div>
            </Reveal>
          ))}
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
