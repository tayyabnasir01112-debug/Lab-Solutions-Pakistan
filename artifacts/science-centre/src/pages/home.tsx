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
  const [phase, setPhase] = useState<"logo" | "fill" | "done">("logo");

  useEffect(() => {
    // Phase 1: logo appears (grayscale) — 0.9s
    // Phase 2: color fills in — 1.4s
    // Phase 3: exit — 0.7s
    const t1 = setTimeout(() => setPhase("fill"), 900);
    const t2 = setTimeout(() => setPhase("done"), 2600);
    const t3 = setTimeout(onDone, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Subtle animated grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />

      {/* Center logo container */}
      <div className="relative flex flex-col items-center gap-8">

        {/* Glow that pulses when color fills */}
        <motion.div
          className="absolute inset-0 blur-3xl rounded-full pointer-events-none"
          style={{ background: "hsl(var(--primary)/0.15)" }}
          animate={phase === "fill" ? { scale: [1, 1.8, 1.2], opacity: [0, 0.8, 0.3] } : { opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />

        {/* Logo — grayscale then color */}
        <div className="relative w-72 md:w-96">
          {/* Grayscale base — always visible */}
          <motion.img
            src={img("/images/sc-logo-full.png")}
            alt="Science Centre"
            className="w-full h-auto object-contain"
            style={{ filter: "grayscale(1) brightness(0.5)" }}
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Colored version — revealed left-to-right via clip */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={phase !== "logo" ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            <img
              src={img("/images/sc-logo-full.png")}
              alt="Science Centre"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </motion.div>

          {/* Bright sweep line that travels across during fill */}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, white, transparent)", boxShadow: "0 0 12px 4px rgba(255,255,255,0.8)" }}
            initial={{ left: "-2px", opacity: 0 }}
            animate={phase !== "logo" ? { left: ["0%", "100%"], opacity: [0, 1, 0] } : { left: "-2px", opacity: 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          />
        </div>

        {/* Tagline fades in after color fills */}
        <motion.p
          className="text-xs tracking-[0.4em] text-muted-foreground uppercase font-medium"
          initial={{ opacity: 0, y: 8 }}
          animate={phase === "fill" || phase === "done" ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Your Partner in Science
        </motion.p>
      </div>

      {/* Bottom progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2.8, delay: 0.2, ease: "linear" }}
      />
    </motion.div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────── */

/* ─── Hero ────────────────────────────────────────────────────── */
const heroSpecialties = [
  "Transplant diagnostics",
  "Clinical water systems",
  "Molecular biology",
  "Flow cytometry",
  "Life science reagents",
  "Rapid diagnostic kits",
];

const heroMetrics = [
  { value: "30+", label: "years serving Pakistan" },
  { value: "9", label: "global brand portfolios" },
  { value: "500+", label: "lab conversations supported" },
];

const heroStats = [
  { value: "30+", label: "Years of Excellence", sub: "Serving Pakistan since 1985" },
  { value: "8+", label: "Global Brands", sub: "Luminex, Merck and more" },
  { value: "500+", label: "Clients Served", sub: "Hospitals, labs and universities" },
  { value: "6", label: "Specialisations", sub: "End-to-end lab solutions" },
];

function Hero({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const [specIndex, setSpecIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSpecIndex(i => (i + 1) % heroSpecialties.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-[#06111d] pt-24 text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src={img("/images/sc-hero-lab-wow.webp")}
          alt="Modern scientific laboratory with diagnostic analyzers, microscope, pipettes and reagent racks"
          style={{ y: imageY }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-[112%] w-full object-cover object-center opacity-95"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,17,29,0.99) 0%, rgba(6,17,29,0.88) 34%, rgba(6,17,29,0.34) 68%, rgba(6,17,29,0.08) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06111d] to-transparent" />
        <div
          className="absolute inset-0 opacity-18"
          style={{
            backgroundImage:
              "linear-gradient(rgba(105,205,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(105,205,255,0.13) 1px, transparent 1px)",
            backgroundSize: "110px 110px",
          }}
        />
        <motion.div
          className="absolute left-0 top-[37%] h-px w-2/3 bg-cyan-100/75"
          animate={{ x: ["-70%", "170%"], opacity: [0, 0.9, 0] }}
          transition={{ repeat: Infinity, duration: 6.2, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[8%] top-[26%] hidden h-[42vh] w-[28vw] border border-cyan-100/18 lg:block"
          animate={{ opacity: [0.35, 0.75, 0.35], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-[14%] right-[3%] z-10 hidden font-[var(--app-font-heading)] text-[12rem] font-black leading-none text-white/5 lg:block xl:text-[15rem]"
        initial={{ opacity: 0, x: 60 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        LAB
      </motion.div>

      <div className="container relative z-20 mx-auto flex min-h-[calc(100dvh-6rem)] flex-col justify-center px-6 pb-20 pt-8 md:px-12">
        <motion.div className="max-w-5xl" style={{ y: headlineY }}>
          <div className="max-w-5xl">
            <motion.div
              className="mb-5 inline-flex items-center gap-3 text-[11px] font-black uppercase text-cyan-100"
              variants={fadeUp} custom={0.0} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              <span className="h-px w-10 bg-cyan-100/70" />
              Pakistan's scientific sourcing network
            </motion.div>

            <motion.h1
              className="font-[var(--app-font-heading)] text-[4rem] font-black leading-[0.84] text-white sm:text-[5.8rem] lg:text-[7.8rem] xl:text-[9rem]"
              variants={fadeUp} custom={0.08} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              <span className="block">Science</span>
              <span className="block">Centre</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-4xl font-[var(--app-font-heading)] text-3xl font-black leading-none text-cyan-100 sm:text-4xl lg:text-5xl"
              variants={fadeUp} custom={0.16} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              for labs that move Pakistan.
            </motion.p>

            <motion.div
              className="mt-7 max-w-3xl border-l-2 border-primary pl-5"
              variants={fadeUp} custom={0.24} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={specIndex}
                  className="mb-3 text-xl font-black text-white md:text-2xl"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35 }}
                >
                  {heroSpecialties[specIndex]}
                </motion.div>
              </AnimatePresence>
              <p className="max-w-2xl text-base leading-relaxed text-slate-100 md:text-lg">
                Advanced laboratory instruments, diagnostics, reagents and scientific systems routed from trusted global portfolios to hospitals, universities and research teams.
              </p>
            </motion.div>

            <motion.div
              className="mt-7 flex flex-wrap gap-8 text-xs font-black uppercase text-white"
              variants={fadeUp} custom={0.34} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              <a href="#solutions" className="group inline-flex items-center gap-3 border-t border-white/35 pt-3 hover:text-cyan-100">
                Explore solutions
                <motion.span
                  className="inline-flex"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </a>
              <a href="#contact" className="inline-flex items-center gap-3 border-t border-white/35 pt-3 hover:text-cyan-100">
                Talk to a specialist
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute right-10 top-36 hidden w-72 text-right lg:block"
          variants={fadeUp} custom={0.48} initial="hidden" animate={visible ? "visible" : "hidden"}
        >
          {heroMetrics.map((metric, i) => (
            <button
              key={metric.label}
              type="button"
              onClick={() => setSpecIndex(i)}
              className="block w-full border-t border-white/22 py-4 text-right transition-colors hover:text-cyan-100"
            >
              <span className="block font-[var(--app-font-heading)] text-5xl font-black leading-none text-white">
                {metric.value}
              </span>
              <span className="mt-1 block text-[11px] font-bold uppercase leading-snug text-slate-300">
                {metric.label}
              </span>
            </button>
          ))}
        </motion.div>
      </div>

    </section>
  );
}

function LegacyHero({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [specIndex, setSpecIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSpecIndex(i => (i + 1) % heroSpecialties.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center pt-24 pb-12 bg-background">

      {/* ── Animated background layers ── */}
      {/* Parallax image - contained within section */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(100deg, hsl(var(--background)) 42%, hsl(var(--background)/0.92) 62%, hsl(var(--background)/0.35) 100%)",
          }}
        />
        <motion.img
          src={img("/images/sc-hero.png")}
          alt="Science Centre Laboratory"
          style={{ y: imgY }}
          className="w-full h-[115%] object-cover object-right absolute top-0 left-0 opacity-40"
        />
      </div>

      {/* Animated dot grid */}
      <div className="absolute inset-0 z-0 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

      {/* Glowing primary orb — contained */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full z-0 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.10) 0%, transparent 70%)" }} />

      {/* ── Content ── */}
      <div className="container mx-auto px-6 md:px-12 relative z-20 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">

          {/* LEFT: Main intro */}
          <div className="lg:col-span-7">

            {/* Eyebrow */}
            <motion.div
              className="inline-flex items-center gap-2.5 mb-7"
              variants={fadeUp} custom={0.0} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold tracking-[0.22em] text-primary uppercase">
                Pakistan's Leading Scientific Distributor
              </span>
            </motion.div>

            {/* Headline */}
            <div className="mb-2">
              <motion.h1
                className="text-5xl md:text-[4.25rem] lg:text-[4.75rem] font-[var(--app-font-heading)] font-black text-foreground leading-[1.0] tracking-tight"
                variants={fadeUp} custom={0.1} initial="hidden" animate={visible ? "visible" : "hidden"}
              >
                Your Partner in
              </motion.h1>
            </div>

            {/* Animated cycling specialty */}
            <div className="mb-6" style={{ minHeight: "1.5em", paddingBottom: "0.25em", overflow: "visible" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={specIndex}
                  className="text-5xl md:text-[4.25rem] lg:text-[4.75rem] font-[var(--app-font-heading)] font-black leading-[1.0] tracking-tight"
                  style={{
                    backgroundImage: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {heroSpecialties[specIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Body copy */}
            <motion.p
              className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl mb-10"
              variants={fadeUp} custom={0.3} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              Science Centre has been Pakistan's trusted bridge between world-class diagnostic technology and the laboratories, hospitals, research institutes, and universities that depend on it — for over three decades.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              variants={fadeUp} custom={0.4} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              <Button asChild size="lg"
                className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-13 px-8 text-sm font-bold tracking-wide group">
                <a href="#solutions">
                  Explore Our Solutions
                  <motion.span className="inline-flex ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </a>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="rounded-none h-13 px-8 text-sm font-bold tracking-wide border-border hover:bg-muted">
                <a href="#contact">Talk to a Specialist</a>
              </Button>
            </motion.div>

            {/* Specialty pill strip */}
            <motion.div
              className="flex flex-wrap gap-2 mt-8"
              variants={fadeUp} custom={0.5} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              {heroSpecialties.map((s, i) => (
                <span
                  key={i}
                  onClick={() => setSpecIndex(i)}
                  className="text-[11px] font-semibold tracking-wide px-3 py-1.5 border cursor-pointer transition-all duration-300"
                  style={{
                    borderColor: i === specIndex ? "hsl(var(--primary))" : "hsl(var(--border))",
                    color: i === specIndex ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    background: i === specIndex ? "hsl(var(--primary)/0.08)" : "transparent",
                  }}
                >
                  {s}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Floating stats cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {heroStats.map((stat, i) => (
              <motion.div
                key={i}
                className="border border-border p-5 md:p-6 relative overflow-hidden group cursor-default"
                variants={fadeUp} custom={0.2 + i * 0.1} initial="hidden" animate={visible ? "visible" : "hidden"}
                whileHover={{ y: -4, borderColor: "hsl(var(--primary)/0.5)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Subtle hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.06), transparent 70%)" }} />

                <div className="text-3xl md:text-4xl font-[var(--app-font-heading)] font-black text-foreground mb-1 leading-none">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={visible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {stat.value}
                  </motion.span>
                </div>
                <div className="text-sm font-bold text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground font-light">{stat.sub}</div>

                {/* Bottom accent line on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            ))}

            {/* Trust badge card */}
            <motion.div
              className="col-span-2 border border-border p-5 flex items-center gap-4 bg-muted/30"
              variants={fadeUp} custom={0.65} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-primary/10 border border-primary/20">
                <span className="text-lg">🏥</span>
              </div>
              <div>
                <div className="text-sm font-bold text-foreground leading-snug">
                  Trusted by Leading Hospitals, Research Institutes & Universities across Pakistan
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 font-light">
                  Including government institutes, clinical labs & pharmaceutical companies
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground z-20"
        initial={{ opacity: 0, y: 10 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.4, duration: 0.6 }}
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

  const BrandPill = ({ brand, dark = false }: { brand: typeof partnerBrands[0], dark?: boolean }) => (
    <div
      className="flex-shrink-0 flex items-center gap-3 px-5 py-3 border mx-2 group cursor-default transition-all duration-300 hover:scale-105"
      style={{
        borderColor: brand.color + (dark ? "40" : "30"),
        background: brand.color + (dark ? "15" : "08"),
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="text-[11px] font-black tracking-[0.14em] px-2 py-0.5"
        style={{ color: brand.color, background: brand.color + "25" }}>
        {brand.initial}
      </div>
      <div>
        <div className={`text-sm font-[var(--app-font-heading)] font-bold leading-none mb-0.5 whitespace-nowrap ${dark ? "text-white" : "text-foreground"}`}>
          {brand.name}
        </div>
        <div className={`text-[10px] font-medium tracking-wide whitespace-nowrap ${dark ? "text-white/40" : "text-muted-foreground"}`}>
          {brand.sub}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={ref} id="partners" className="flex flex-col justify-center overflow-hidden relative" style={{ height: "100dvh", background: "hsl(var(--foreground))" }}>

      {/* Background dot grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Big centered headline */}
      <div className="container mx-auto px-6 md:px-12 mb-12 relative z-10">
        <motion.div className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <div className="w-6 h-px bg-primary" />
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Trusted Partnerships</span>
        </motion.div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.h2
            className="text-4xl md:text-6xl font-[var(--app-font-heading)] font-black text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.05 }}>
            Representing the World's<br className="hidden md:block" />
            <span className="text-primary">Best Science Brands.</span>
          </motion.h2>
          <motion.p
            className="text-white/50 text-sm font-light max-w-xs md:text-right leading-relaxed"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
            Official distributor of 8+ globally recognized scientific brands across Pakistan for 30+ years
          </motion.p>
        </div>
      </div>

      {/* Marquee rows */}
      <motion.div
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-3 relative z-10"
      >
        {/* Row 1 — scrolls left */}
        <div className="relative flex overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, hsl(var(--foreground)), transparent)` }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, hsl(var(--foreground)), transparent)` }} />
          <div className="flex" style={{ animation: paused ? "none" : "marquee-left 28s linear infinite", willChange: "transform" }}>
            {[...row1, ...row1, ...row1].map((brand, i) => (<BrandPill key={i} brand={brand} dark />))}
          </div>
        </div>
        {/* Row 2 — scrolls right */}
        <div className="relative flex overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, hsl(var(--foreground)), transparent)` }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, hsl(var(--foreground)), transparent)` }} />
          <div className="flex" style={{ animation: paused ? "none" : "marquee-right 34s linear infinite", willChange: "transform" }}>
            {[...row2, ...row2, ...row2].map((brand, i) => (<BrandPill key={i} brand={brand} dark />))}
          </div>
        </div>
      </motion.div>

      {/* Bottom stat strip */}
      <div className="container mx-auto px-6 md:px-12 mt-12 relative z-10">
        <div className="flex items-center gap-12 border-t border-white/10 pt-8">
          {[["8+", "Global Brands"], ["30+", "Years of Partnership"], ["500+", "Clients Served"], ["4", "Cities Nationwide"]].map(([val, label]) => (
            <div key={label} className="flex flex-col">
              <span className="text-2xl font-black font-[var(--app-font-heading)] text-white">{val}</span>
              <span className="text-xs text-white/40 font-medium tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        @keyframes marquee-right { 0% { transform: translateX(-33.333%); } 100% { transform: translateX(0); } }
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
    <section id="solutions" className="relative overflow-hidden" style={{ height: "100dvh" }}>

      {/* Full-bleed shared background image */}
      <img
        src={img("/images/sc-hero.png")}
        alt="Lab background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* Panels — full height */}
      <div className="relative flex h-full">
        {solutions.map((s, i) => {
          const isActive = active === i;
          return (
            <motion.div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              animate={{ flex: isActive ? 4.5 : 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden cursor-pointer"
              style={{ minWidth: 0 }}
            >
              {/* Colored overlay on hover */}
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.45 }}
                style={{ backgroundColor: s.accent + "d8" }}
              />

              {/* Vertical divider */}
              {i < solutions.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-px bg-white/15 z-10" />
              )}

              {/* Collapsed state — title at bottom only */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
                animate={{ opacity: isActive ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-5 h-px bg-white/40 mb-3" />
                <h4 className="text-white font-[var(--app-font-heading)] font-bold text-sm md:text-base leading-snug drop-shadow-lg">
                  {s.title}
                </h4>
              </motion.div>

              {/* Expanded content */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-between p-10 md:p-14 z-10"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 24 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: isActive ? 0.15 : 0 }}
              >
                {/* Top: icon only */}
                <div className="flex justify-end pt-28">
                  <div className="w-11 h-11 flex items-center justify-center bg-white/15 text-white rounded-sm backdrop-blur-sm">
                    {s.icon}
                  </div>
                </div>

                {/* Bottom: title + desc + cta */}
                <div>
                  <h4 className="font-[var(--app-font-heading)] text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-5">
                    {s.title}
                  </h4>
                  <p className="text-white/75 text-sm md:text-base font-light leading-relaxed mb-8 max-w-sm">
                    {s.desc}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-dashed border-white/60 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 group">
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-white/50 text-xs font-bold tracking-[0.15em] uppercase">Learn more</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
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
    <section ref={ref} id="products" className="bg-background border-t border-border overflow-hidden flex flex-col justify-center" style={{ height: "100dvh", paddingTop: "108px" }}>
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <motion.div className="text-xs font-bold tracking-[0.18em] text-primary uppercase mb-2"
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              Featured Instruments
            </motion.div>
            <motion.h3 className="text-2xl md:text-4xl font-[var(--app-font-heading)] font-bold text-foreground tracking-tight leading-tight"
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
        <motion.div className="relative w-full h-[320px] md:h-[380px] overflow-hidden"
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
    <section id="about" className="bg-foreground text-background relative overflow-hidden flex items-center justify-center" style={{ height: "100dvh" }}>
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
              41 Years of Scientific <br className="hidden md:block" /> Excellence.
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
    <section className="relative flex flex-col justify-center overflow-hidden" style={{ height: "100dvh", paddingTop: "96px", background: "hsl(var(--background))" }}>

      {/* Subtle background accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: "linear-gradient(to left, hsl(var(--primary)/0.04), transparent)" }} />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <Reveal>
              <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3 flex items-center gap-2">
                <div className="w-5 h-px bg-primary" /> Presence
              </div>
              <h2 className="text-4xl md:text-6xl font-[var(--app-font-heading)] font-black text-foreground leading-tight tracking-tight">
                Nationwide<br />
                <span className="text-primary">Infrastructure.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground text-sm font-light max-w-xs leading-relaxed md:text-right">
              Strategically located across Pakistan's major cities to serve hospitals, labs and research institutes nationwide.
            </p>
          </Reveal>
        </div>

        {/* Office cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {offices.map((office, i) => (
            <Reveal key={i} delay={0.07 * i}>
              <motion.div
                className={`p-6 border-l-2 relative overflow-hidden group ${office.main ? "bg-primary/5 border-l-primary" : "bg-muted/30 border-l-border hover:border-l-primary"}`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {office.main && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 mb-3 inline-block">
                    Head Office
                  </span>
                )}
                <h4 className="text-2xl font-[var(--app-font-heading)] font-black text-foreground mb-1">{office.city}</h4>
                <p className="text-xs text-primary font-semibold tracking-wide mb-5">{office.province}</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span className="text-sm font-light leading-snug">{office.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    <a href={`tel:${office.phone.replace(/\s/g, "")}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      {office.phone}
                    </a>
                  </div>
                </div>
                {/* Hover accent */}
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }}
                  style={{ originX: 0 }} transition={{ duration: 0.3 }} />
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Bottom call-to-action */}
        <Reveal delay={0.3}>
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <p className="text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">4 offices</span> across Pakistan — Rawalpindi, Karachi, Peshawar & Lahore
            </p>
            <a href="#contact" className="text-xs font-bold tracking-[0.15em] uppercase text-primary flex items-center gap-2 hover:gap-3 transition-all duration-200">
              Contact Us <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>
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
    <section id="contact" className="bg-muted/30 border-y border-border flex flex-col justify-center" style={{ height: "100dvh", paddingTop: "96px" }}>
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
const SECTION_NAMES = ["Home", "Partners", "Solutions", "Instruments", "About", "Locations", "Contact"];

const slideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  }),
};

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const cooldown = useRef(false);

  // Lock body scroll — homepage controls its own scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  const sections = [
    <Hero key="hero" visible={splashDone} />,
    <Partners key="partners" />,
    <Solutions key="solutions" />,
    <FeaturedProducts key="products" />,
    <Credibility key="credibility" />,
    <Locations key="locations" />,
    <Contact key="contact" />,
  ];

  const goTo = (index: number) => {
    if (cooldown.current || index === current) return;
    cooldown.current = true;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setTimeout(() => { cooldown.current = false; }, 850);
  };

  useEffect(() => {
    const onHomeTop = () => {
      cooldown.current = false;
      setDirection(-1);
      setCurrent(0);
    };
    window.addEventListener("science-centre:home-top", onHomeTop);
    return () => window.removeEventListener("science-centre:home-top", onHomeTop);
  }, []);

  useEffect(() => {
    if (!splashDone) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown.current) return;
      if (e.deltaY > 20) goTo(Math.min(current + 1, sections.length - 1));
      else if (e.deltaY < -20) goTo(Math.max(current - 1, 0));
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown","PageDown"].includes(e.key)) { e.preventDefault(); goTo(Math.min(current + 1, sections.length - 1)); }
      if (["ArrowUp","PageUp"].includes(e.key)) { e.preventDefault(); goTo(Math.max(current - 1, 0)); }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("wheel", onWheel); window.removeEventListener("keydown", onKey); };
  }, [splashDone, current]);

  useEffect(() => {
    if (!splashDone) return;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 60) return;
      if (diff > 0) goTo(Math.min(current + 1, sections.length - 1));
      else goTo(Math.max(current - 1, 0));
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); };
  }, [splashDone, current]);

  return (
    <div className="h-[100dvh] w-full bg-background overflow-hidden selection:bg-primary selection:text-primary-foreground text-foreground">
      <AnimatePresence>{!splashDone && <IntroSplash onDone={() => setSplashDone(true)} />}</AnimatePresence>
      {/* 
        Section backgrounds:
        0=Hero(light bg), 1=Partners(dark), 2=Solutions(hidden), 
        3=Instruments(light), 4=Credibility(dark), 5=Locations(light), 6=Contact(light)
        forceSolid=true on light sections so links are dark and visible
      */}
      <SiteNavbar
        visible={splashDone && current !== 2}
        forceSolid={current === 3 || current === 5 || current === 6}
        forceTransparent={current === 0}
      />

      {/* Full-screen panel container */}
      <div className="relative w-full overflow-hidden" style={{ height: "100dvh" }}>
        <AnimatePresence custom={direction} mode="sync">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full"
            style={{ height: "100dvh", overflowY: "auto" }}
          >
            {sections[current]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section dots — right side */}
      {splashDone && (
        <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {SECTION_NAMES.map((name, i) => (
            <button key={i} onClick={() => goTo(i)} className="group flex items-center gap-2 justify-end" title={name}>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-background/95 text-foreground px-2 py-1 border border-border opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-sm">
                {name}
              </span>
              <motion.div
                className="rounded-full"
                animate={{
                  width:  i === current ? 10 : 5,
                  height: i === current ? 10 : 5,
                  backgroundColor: i === current ? "hsl(var(--primary))" : "hsl(var(--border))",
                  boxShadow: i === current ? "0 0 8px hsl(var(--primary)/0.6)" : "none",
                }}
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Bottom progress bar */}
      {splashDone && (
        <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-border/50 z-50">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${(current / (sections.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}

      {/* Section name label — bottom left */}
      {splashDone && (
        <div className="fixed bottom-4 left-6 z-50">
          <AnimatePresence mode="wait">
            <motion.span
              key={current}
              className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {String(current + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")} — {SECTION_NAMES[current]}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
