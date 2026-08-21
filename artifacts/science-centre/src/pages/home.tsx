import { type MouseEvent, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
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

function resolveAsset(path?: string) {
  if (!path) return "";
  return /^https?:\/\//i.test(path) ? path : img(path);
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

function BrandHubIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"assemble" | "lock" | "done">("assemble");

  const sparks = [
    { left: "24%", top: "32%", x: -260, y: -90, delay: 0.18, size: "h-1.5 w-1.5" },
    { left: "74%", top: "31%", x: 260, y: -130, delay: 0.34, size: "h-1.5 w-1.5" },
    { left: "28%", top: "72%", x: -300, y: 160, delay: 0.5, size: "h-1 w-1" },
    { left: "70%", top: "69%", x: 280, y: 150, delay: 0.62, size: "h-1 w-1" },
    { left: "50%", top: "18%", x: -20, y: -230, delay: 0.72, size: "h-1.5 w-1.5" },
    { left: "52%", top: "82%", x: 35, y: 230, delay: 0.86, size: "h-1 w-1" },
  ];

  const logoPieces = [
    {
      clipPath: "inset(0 50% 0 0)",
      x: -360,
      y: 118,
      rotate: -16,
      delay: 0.16,
    },
    {
      clipPath: "inset(0 0 0 50%)",
      x: 360,
      y: -104,
      rotate: 14,
      delay: 0.34,
    },
  ];

  useEffect(() => {
    const lockMs = 3300;
    const doneMs = 6100;
    const exitMs = 780;
    const timeouts: number[] = [];

    timeouts.push(window.setTimeout(() => setPhase("lock"), lockMs));
    timeouts.push(window.setTimeout(() => {
      setPhase("done");
      timeouts.push(window.setTimeout(onDone, exitMs));
    }, doneMs));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#01040a] text-white"
      initial={{ opacity: 1 }}
        animate={phase === "done" ? { opacity: 0, scale: 1.018 } : { opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.76, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(1,4,10,0.98) 0%, rgba(3,9,19,0.94) 42%, rgba(1,4,10,1) 100%), radial-gradient(ellipse at 50% 48%, rgba(56,189,248,0.22) 0%, rgba(56,189,248,0.08) 28%, transparent 58%), radial-gradient(ellipse at 50% 88%, rgba(16,185,129,0.18) 0%, transparent 48%)",
        }}
      />
      <motion.div
        className="sc-cinema-aurora absolute inset-0 opacity-70"
        animate={{ opacity: phase === "lock" ? 0.9 : 0.68 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, transparent 0%, rgba(125,211,252,0.18) 48%, transparent 58%), linear-gradient(240deg, transparent 0%, rgba(45,212,191,0.12) 42%, transparent 56%)",
          backgroundSize: "170% 170%, 190% 190%",
        }}
        animate={{ backgroundPosition: ["0% 0%, 100% 100%", "100% 100%, 0% 0%"] }}
        transition={{ duration: 7.5, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="relative flex h-full w-full max-w-6xl items-center justify-center">
          {sparks.map((spark, index) => (
            <motion.span
              key={index}
              className={`absolute rounded-full bg-cyan-100 shadow-[0_0_24px_rgba(125,211,252,0.95)] ${spark.size}`}
              style={{ left: spark.left, top: spark.top }}
              initial={{ x: spark.x, y: spark.y, opacity: 0, scale: 0.4 }}
              animate={{
                x: 0,
                y: 0,
                opacity: phase === "done" ? 0 : phase === "lock" ? 0.38 : [0, 1, 0.68],
                scale: phase === "lock" ? 0.74 : [0.4, 1.12, 0.9],
              }}
              transition={{
                duration: phase === "lock" ? 0.8 : 2.6,
                ease: [0.16, 1, 0.3, 1],
                delay: spark.delay,
              }}
            />
          ))}

          <motion.div
            className="relative flex flex-col items-center justify-center"
            animate={{ opacity: phase === "done" ? 0 : 1, scale: phase === "lock" ? 1 : 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute -inset-x-24 -top-20 h-[34rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.34),rgba(20,184,166,0.13)_34%,transparent_66%)] blur-3xl"
              initial={{ opacity: 0, scale: 0.74 }}
              animate={{ opacity: phase === "lock" ? 0.92 : 0.55, scale: phase === "lock" ? 1 : 0.9 }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.div
              className="relative h-[clamp(230px,29vw,400px)] w-[clamp(230px,29vw,400px)]"
              animate={{ y: phase === "lock" ? -14 : 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {logoPieces.map((piece, index) => (
                <motion.img
                  key={index}
                  src={img("/images/sc-logo-mark-transparent.png")}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ clipPath: piece.clipPath }}
                  initial={{ x: piece.x, y: piece.y, rotate: piece.rotate, opacity: 0, scale: 0.9, filter: "blur(14px) drop-shadow(0 0 24px rgba(56,189,248,0.78))" }}
                  animate={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                    opacity: phase === "lock" ? 0 : 1,
                    scale: 1,
                    filter: phase === "lock" ? "blur(0px) drop-shadow(0 0 16px rgba(56,189,248,0.6))" : "blur(0px) drop-shadow(0 0 28px rgba(56,189,248,0.8))",
                  }}
                  transition={{
                    duration: phase === "lock" ? 0.18 : 2.15,
                    ease: [0.16, 1, 0.3, 1],
                    delay: phase === "lock" ? 0 : piece.delay,
                  }}
                />
              ))}
              <motion.img
                src={img("/images/sc-logo-mark-transparent.png")}
                alt="Science Centre mark"
                className="absolute inset-0 h-full w-full object-contain"
                initial={{ opacity: 0, scale: 0.995, filter: "blur(3px) drop-shadow(0 0 22px rgba(56,189,248,0.6))" }}
                animate={{
                  opacity: phase === "lock" ? 1 : 0,
                  scale: phase === "lock" ? 1 : 0.995,
                  filter: phase === "lock" ? "blur(0px) drop-shadow(0 0 18px rgba(56,189,248,0.62))" : "blur(3px) drop-shadow(0 0 22px rgba(56,189,248,0.6))",
                }}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1], delay: phase === "lock" ? 0.16 : 0 }}
              />
              <motion.span
                className="absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/65 to-transparent blur-sm"
                initial={{ x: "-230%", opacity: 0 }}
                animate={{ x: phase === "lock" ? "230%" : "-230%", opacity: phase === "lock" ? [0, 0.75, 0] : 0 }}
                transition={{ duration: 1.25, ease: [0.65, 0, 0.35, 1], delay: 0.12 }}
              />
            </motion.div>

            <motion.div
              className="-mt-4 w-[min(640px,78vw)] md:-mt-7"
              initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
              animate={{ opacity: phase === "lock" ? 1 : 0, y: phase === "lock" ? 0 : 30, filter: phase === "lock" ? "blur(0px)" : "blur(14px)" }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
            >
              <img
                src={img("/images/sc-logo-wordmark-only.png")}
                alt="Science Centre"
                className="mx-auto w-full object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.24)]"
              />
            </motion.div>

            <motion.div
              className="mt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.42em] text-cyan-100/58"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: phase === "lock" ? 1 : 0, y: phase === "lock" ? 0 : 12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
            >
              <span className="h-px w-10 bg-cyan-100/32" />
              Pakistan
              <span className="h-px w-10 bg-emerald-100/32" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 h-px w-[min(520px,64vw)] -translate-x-1/2 overflow-hidden bg-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "done" ? 0 : 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-300 via-white to-emerald-300"
          initial={{ x: "-100%" }}
          animate={{ x: ["-100%", "0%", "100%"] }}
          transition={{ duration: 5.8, ease: [0.65, 0, 0.35, 1] }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────── */

/* ─── Hero ────────────────────────────────────────────────────── */
const heroSpecialties = [
  "Transplant diagnostics",
  "Flow cytometry solutions",
  "Water purification systems",
  "NGS solutions",
  "Cell culture solutions",
  "General lab consumables",
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
          src={img("/images/sc-lab-hero-optimized.webp")}
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

      <div className="container relative z-20 mx-auto flex min-h-[calc(100dvh-6rem)] max-w-[1760px] flex-col justify-center px-6 pb-20 pt-8 md:px-12 2xl:px-16">
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
              className="font-[var(--app-font-heading)] text-[4rem] font-black leading-[0.84] text-white sm:text-[5.8rem] lg:text-[7.8rem] xl:text-[9rem] 2xl:text-[10.5rem]"
              variants={fadeUp} custom={0.08} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              <span className="block">Science</span>
              <span className="block">Centre</span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-5xl font-[var(--app-font-heading)] text-3xl font-black leading-none text-cyan-100 sm:text-4xl lg:text-5xl 2xl:text-6xl"
              variants={fadeUp} custom={0.16} initial="hidden" animate={visible ? "visible" : "hidden"}
            >
              for labs that move Pakistan.
            </motion.p>

            <motion.div
              className="mt-7 max-w-4xl border-l-2 border-primary pl-5"
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
              <p className="max-w-3xl text-base leading-relaxed text-slate-100 md:text-lg 2xl:text-xl">
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
          className="absolute right-10 top-36 hidden w-72 text-right lg:block 2xl:right-16 2xl:w-80"
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
          src={img("/images/sc-lab-hero-optimized.webp")}
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
  { name: "Merck", logo: "/images/logos/merck-logo-clean.png", color: "#503291", x: "18%", y: "26%", w: "clamp(160px, 15vw, 280px)", delay: 0 },
  { name: "Luminex", logo: "/images/logos/luminex-logo-clean.png", color: "#ef1b23", x: "52%", y: "19%", w: "clamp(170px, 16vw, 300px)", delay: 0.12 },
  { name: "Cytek", logo: "/images/logos/cytek-logo.png", color: "#5e2a84", x: "78%", y: "28%", w: "clamp(160px, 14vw, 270px)", delay: 0.2 },
  { name: "NgeneBio", logo: "/images/logos/ngene-logo-clean.svg", color: "#e51b2b", x: "34%", y: "47%", w: "clamp(155px, 14vw, 260px)", delay: 0.28 },
  { name: "REX", logo: "/images/logos/rex-logo-crop.png", color: "#276fb7", x: "63%", y: "50%", w: "clamp(160px, 15vw, 290px)", delay: 0.36 },
  { name: "HKM", logo: "/images/logos/hkm-logo.png", color: "#26715a", x: "88%", y: "55%", w: "clamp(150px, 13vw, 240px)", delay: 0.44 },
  { name: "Sugentech", logo: "/images/logos/sugentech-logo-clean.svg", color: "#ed174f", x: "23%", y: "71%", w: "clamp(165px, 15vw, 280px)", delay: 0.52 },
  { name: "BioLegend", logo: "/images/biolegend/biolegend-logo.svg", color: "#7d1fb2", x: "54%", y: "68%", w: "clamp(190px, 18vw, 330px)", delay: 0.6 },
  { name: "One Lambda", logo: "/images/logos/onelambda-mark.png", color: "#d71920", x: "82%", y: "70%", w: "clamp(96px, 8vw, 150px)", delay: 0.68 },
];

function Partners() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <section
      ref={ref}
      id="partners"
      className="relative flex flex-col justify-center overflow-hidden bg-[#f7fbff]"
      style={{ height: "100dvh", paddingTop: "108px" }}
    >
      <div className="absolute inset-0 opacity-[0.55]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(46,163,242,.22) 1px, transparent 0)", backgroundSize: "34px 34px" }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(46,163,242,0.13),transparent_30%),radial-gradient(circle_at_78%_80%,rgba(16,185,129,0.12),transparent_30%)]" />

      <div className="container relative z-10 mx-auto grid min-h-0 flex-1 grid-rows-[auto_1fr_auto] px-6 pb-7 md:px-12">
        <div className="grid gap-5 md:grid-cols-[0.95fr_0.8fr] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              <span className="h-px w-9 bg-primary" />
              Trusted Partnerships
            </div>
            <h2 className="max-w-4xl font-[var(--app-font-heading)] text-[clamp(2.7rem,6.4vw,6.7rem)] font-black leading-[0.9] tracking-tight text-foreground">
              Active scientific<br />brand network.
            </h2>
          </motion.div>
          <motion.p
            className="max-w-md text-base leading-relaxed text-muted-foreground md:justify-self-end md:text-right"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Science Centre sources, supplies and supports specialist catalogues from the brand families currently available in our product data.
          </motion.p>
        </div>

        <div className="relative my-3 min-h-[430px] overflow-hidden md:my-0 md:min-h-[520px]">
          <div className="absolute left-1/2 top-1/2 h-[min(60vw,660px)] w-[min(60vw,660px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
          <div className="absolute left-1/2 top-1/2 h-[min(42vw,470px)] w-[min(42vw,470px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
          {partnerBrands.map((brand, index) => (
            <motion.div
              key={brand.name}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: brand.x, top: brand.y, width: brand.w }}
              initial={{ opacity: 0, scale: 0.88, y: 18 }}
              animate={inView ? { opacity: 1, scale: 1, y: [0, -8, 0] } : {}}
              transition={{ opacity: { duration: 0.55, delay: brand.delay }, scale: { duration: 0.55, delay: brand.delay }, y: { duration: 5.5 + index * 0.25, repeat: Infinity, ease: "easeInOut", delay: brand.delay } }}
            >
              <img
                src={img(brand.logo)}
                alt={brand.name}
                loading="lazy"
                decoding="async"
                className="h-auto max-h-24 w-full object-contain drop-shadow-[0_18px_32px_rgba(15,23,42,0.16)]"
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-5 md:flex md:items-center md:gap-12">
          {[["9", "Active Brands"], ["30+", "Years in Market"], ["500+", "Lab Conversations"], ["4", "Cities Supported"]].map(([val, label]) => (
            <div key={label} className="flex flex-col">
              <span className="font-[var(--app-font-heading)] text-2xl font-black text-foreground">{val}</span>
              <span className="text-xs font-medium tracking-wide text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ─── Solutions ───────────────────────────────────────────────── */
const solutions = [
  {
    icon: <Dna className="h-5 w-5" />,
    title: "Life Sciences",
    short: "Research reagents, assays and instruments",
    desc: "Core reagents, kits, antibodies and laboratory systems for academic, clinical and industrial research teams.",
    image: "/images/solutions/life-sciences-lab.webp",
    imagePosition: "center",
    accent: "#2EA3F2",
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    title: "Transplant Diagnostics",
    short: "HLA typing and antibody screening",
    desc: "HLA typing, antibody detection, crossmatch and post-transplant monitoring workflows for specialist labs.",
    image: "/images/solutions/transplant-diagnostics-lab.webp",
    imagePosition: "center",
    accent: "#E85D4A",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Flow Cytometry Solutions",
    short: "Cell analysis and immune profiling",
    desc: "Flow instruments, antibodies, panels and analysis support for high-parameter cell and immune workflows.",
    image: "/images/solutions/flow-cytometry-lab.webp",
    imagePosition: "center",
    accent: "#06B6D4",
  },
  {
    icon: <Microscope className="h-5 w-5" />,
    title: "Cell Culture Solutions",
    short: "Media, reagents and lab support",
    desc: "Cell culture media, supplements, plastics and lab systems for repeatable cellular workflows.",
    image: "/images/solutions/cell-culture-lab.webp",
    imagePosition: "center",
    accent: "#10B981",
  },
  {
    icon: <TestTube className="h-5 w-5" />,
    title: "Water Purification Systems",
    short: "Clinical, RO and ultrapure water",
    desc: "Water purification systems for analyzer feed, pure water and ultrapure laboratory applications.",
    image: "/images/solutions/water-purification-lab.webp",
    imagePosition: "center",
    accent: "#2563EB",
  },
  {
    icon: <Syringe className="h-5 w-5" />,
    title: "NGS Solutions",
    short: "Sequencing panels and workflows",
    desc: "NGS kits, library preparation, analysis tools and adoption support for clinical and research laboratories.",
    image: "/images/solutions/ngs-sequencing-lab.webp",
    imagePosition: "center",
    accent: "#7C3AED",
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    title: "Allergen Solutions",
    short: "Allergy screening and blot systems",
    desc: "Allergy screening instruments, panels and diagnostic kits for immunology and clinical testing workflows.",
    image: "/images/sugentech/sug-sgti-allergy-plus-60.png",
    accent: "#EF4444",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Biochemistry Instruments",
    short: "Analyzers and routine testing support",
    desc: "Clinical chemistry instruments, rapid platforms and routine diagnostic support for hospital laboratories.",
    image: "/images/sugentech/sug-inclix-f-100.png",
    accent: "#F59E0B",
  },
  {
    icon: <TestTube className="h-5 w-5" />,
    title: "Filtration Solutions",
    short: "Membrane, media and sample prep",
    desc: "Filtration media, membranes, water testing tools and workflow consumables for reliable lab preparation.",
    image: "/images/hkm/hkm-multi-branch-manifold-membrane-filtration-system.jpg",
    accent: "#14B8A6",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Flow Antibody Solutions",
    short: "Antibodies, panels and controls",
    desc: "Flow antibodies, controls and panel-building support for clinical and research immunophenotyping.",
    image: "/images/biolegend/biolegend-antibodies.svg",
    accent: "#A855F7",
  },
  {
    icon: <TestTube className="h-5 w-5" />,
    title: "General Lab Consumables",
    short: "Daily-use laboratory supplies",
    desc: "Pipettes, media, plates, bottles and everyday lab consumables sourced across trusted scientific catalogues.",
    image: "/images/hkm/hkm-disposable-pipette.jpg",
    accent: "#64748B",
  },
];

function LegacySolutions() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="solutions" className="relative overflow-hidden" style={{ height: "100dvh" }}>

      {/* Full-bleed shared background image */}
      <img
        src={img("/images/sc-lab-hero-optimized.webp")}
        alt="Scientific laboratory with diagnostic analyzers, microscope and reagent workbench"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* Panels — full height */}
      <div className="relative flex h-full flex-col md:flex-row">
        {solutions.map((s, i) => {
          const isActive = active === i;
          return (
            <motion.div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              onFocus={() => setActive(i)}
              animate={{ flex: isActive ? 4.5 : 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              tabIndex={0}
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
                <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-white/15 md:bottom-auto md:left-auto md:top-0 md:h-auto md:w-px" />
              )}

              {/* Collapsed state — title at bottom only */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-4 md:p-8"
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
                className="absolute inset-0 flex flex-col justify-between p-6 md:p-14 z-10"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 24 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: isActive ? 0.15 : 0 }}
              >
                {/* Top: icon only */}
                <div className="flex justify-end pt-10 md:pt-28">
                  <div className="w-11 h-11 flex items-center justify-center bg-white/15 text-white rounded-sm backdrop-blur-sm">
                    {s.icon}
                  </div>
                </div>

                {/* Bottom: title + desc + cta */}
                <div>
                  <h4 className="font-[var(--app-font-heading)] text-2xl md:text-4xl font-black text-white leading-tight tracking-tight mb-4 md:mb-5">
                    {s.title}
                  </h4>
                  <p className="text-white/75 text-sm md:text-base font-light leading-relaxed mb-5 md:mb-8 max-w-sm">
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

function ApplicationVisual({ title, accent }: { title: string; accent: string }) {
  const isBrand = title === "Science Centre";
  const isLife = title === "Life Sciences";
  const isTransplant = title === "Transplant Diagnostics";
  const isFlow = title === "Flow Cytometry Solutions";
  const isCulture = title === "Cell Culture Solutions";
  const isWater = title === "Water Purification Systems";
  const isNgs = title === "NGS Solutions";

  return (
    <div className="relative h-full overflow-hidden border border-white/12 bg-[#071421]/76 shadow-[0_32px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${accent}50 0%, transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.1), transparent 46%)`,
        }}
      />
      <motion.div
        key={title}
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -14 }}
        transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 760 520" className="h-full w-full" role="img" aria-label={`${title} visual`}>
          <defs>
            <linearGradient id={`g-${title}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.72" />
            </linearGradient>
            <filter id={`glow-${title}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="382" cy="258" r="184" fill="none" stroke={accent} strokeOpacity="0.18" strokeWidth="2" />
          <circle cx="382" cy="258" r="126" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />
          <line x1="80" y1="430" x2="680" y2="430" stroke="#fff" strokeOpacity="0.13" />

          {isBrand && (
            <g filter={`url(#glow-${title})`}>
              <path d="M245 338 C310 242 454 244 514 338" fill="none" stroke={`url(#g-${title})`} strokeWidth="20" strokeLinecap="round" />
              <path d="M292 330 L382 174 L472 330" fill="none" stroke="#fff" strokeOpacity="0.82" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M382 188 L382 414" stroke={accent} strokeWidth="5" strokeOpacity="0.88" />
              <circle cx="382" cy="260" r="68" fill="none" stroke="#fff" strokeOpacity="0.72" strokeWidth="5" />
              <circle cx="382" cy="260" r="14" fill={accent} />
            </g>
          )}

          {isLife && (
            <g filter={`url(#glow-${title})`}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i} transform={`translate(${210 + i * 56} ${120 + (i % 2) * 18}) rotate(${i % 2 ? -16 : 16})`}>
                  <line x1="0" y1="0" x2="60" y2="260" stroke="#fff" strokeOpacity="0.78" strokeWidth="6" strokeLinecap="round" />
                  <line x1="80" y1="0" x2="20" y2="260" stroke={accent} strokeOpacity="0.9" strokeWidth="6" strokeLinecap="round" />
                  {[35, 88, 142, 196].map((y) => (
                    <line key={y} x1="18" y1={y} x2="62" y2={y} stroke="#7dd3fc" strokeOpacity="0.5" strokeWidth="4" />
                  ))}
                </g>
              ))}
            </g>
          )}

          {isTransplant && (
            <g filter={`url(#glow-${title})`}>
              <rect x="236" y="154" width="288" height="212" rx="24" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.22" />
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3, 4].map((c) => (
                  <circle key={`${r}-${c}`} cx={286 + c * 48} cy={204 + r * 42} r="13" fill={c % 2 ? accent : "#7dd3fc"} fillOpacity="0.88" />
                )),
              )}
              <path d="M250 396 C315 342 432 342 508 396" fill="none" stroke="#fff" strokeOpacity="0.68" strokeWidth="9" strokeLinecap="round" />
              <text x="318" y="416" fill="#fff" fillOpacity="0.76" fontSize="30" fontWeight="800">HLA</text>
            </g>
          )}

          {isFlow && (
            <g filter={`url(#glow-${title})`}>
              <path d="M112 266 H628" stroke={accent} strokeWidth="8" strokeLinecap="round" />
              <path d="M188 160 L570 378" stroke="#7dd3fc" strokeOpacity="0.76" strokeWidth="5" strokeLinecap="round" />
              <path d="M190 380 L568 156" stroke="#fff" strokeOpacity="0.48" strokeWidth="4" strokeLinecap="round" />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <circle key={i} cx={230 + i * 50} cy={220 + Math.sin(i) * 70} r={18 + (i % 3) * 5} fill={i % 2 ? accent : "#fff"} fillOpacity={i % 2 ? 0.85 : 0.72} />
              ))}
              <rect x="520" y="222" width="88" height="88" rx="10" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeOpacity="0.32" />
            </g>
          )}

          {isCulture && (
            <g filter={`url(#glow-${title})`}>
              <path d="M292 132 H468 L448 392 Q380 434 312 392 Z" fill="#fff" fillOpacity="0.1" stroke="#fff" strokeOpacity="0.36" strokeWidth="5" />
              <path d="M314 304 Q382 266 448 304 L438 386 Q380 420 322 386 Z" fill={accent} fillOpacity="0.7" />
              <rect x="338" y="104" width="84" height="34" rx="7" fill="#fff" fillOpacity="0.78" />
              <circle cx="534" cy="346" r="50" fill="none" stroke="#7dd3fc" strokeOpacity="0.68" strokeWidth="6" />
              <circle cx="546" cy="334" r="9" fill="#fff" fillOpacity="0.85" />
              <circle cx="514" cy="360" r="7" fill={accent} />
            </g>
          )}

          {isWater && (
            <g filter={`url(#glow-${title})`}>
              <rect x="218" y="156" width="324" height="230" rx="22" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.28" strokeWidth="5" />
              {[0, 1, 2].map((i) => (
                <rect key={i} x={268 + i * 82} y="198" width="42" height="142" rx="20" fill={i === 1 ? accent : "#7dd3fc"} fillOpacity="0.72" />
              ))}
              <path d="M206 404 H556" stroke="#fff" strokeOpacity="0.56" strokeWidth="8" strokeLinecap="round" />
              <path d="M580 222 C608 260 622 284 622 310 C622 342 600 364 570 364 C540 364 518 342 518 310 C518 284 552 246 580 222Z" fill={accent} fillOpacity="0.76" />
            </g>
          )}

          {isNgs && (
            <g filter={`url(#glow-${title})`}>
              <rect x="252" y="142" width="256" height="256" rx="30" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.32" strokeWidth="5" />
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <rect key={`${r}-${c}`} x={292 + c * 44} y={182 + r * 44} width="24" height="24" rx="6" fill={c === r ? accent : "#7dd3fc"} fillOpacity="0.78" />
                )),
              )}
              <path d="M182 284 C246 202 304 346 380 262 C454 180 514 328 584 246" fill="none" stroke="#fff" strokeOpacity="0.72" strokeWidth="8" strokeLinecap="round" />
              <text x="280" y="438" fill="#fff" fillOpacity="0.72" fontSize="24" fontWeight="800">A  C  G  T</text>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}

/* ─── Products ────────────────────────────────────────────────── */
function Solutions({ onEnterWebsite }: { onEnterWebsite?: () => void }) {
  const [active, setActive] = useState(0);
  const panelItems = [
    {
      icon: <Microscope className="h-5 w-5" />,
      title: "Science Centre",
      short: "Scientific sourcing network",
      desc: "One local partner connecting Pakistan's labs with instruments, diagnostics, reagents and workflow support.",
      image: "/images/solutions/science-centre-network.webp",
      imagePosition: "center",
      accent: "#2EA3F2",
      href: "/about",
      logo: undefined,
    },
    ...solutions.slice(0, 6).map((solution) => ({ ...solution, href: "/solutions", logo: undefined })),
  ];
  const activePanel = panelItems[active];

  const activatePanel = (index: number) => {
    setActive(index);
  };

  const handleEnterWebsite = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onEnterWebsite?.();
  };

  return (
    <section id="solutions" className="relative overflow-hidden bg-[#030b13] text-white" style={{ height: "100dvh" }}>
      <div className="absolute inset-0 bg-[#030b13]" />
      <div
        className="absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(125,211,252,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.12) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030b13]/60 via-transparent to-[#030b13]/30" />

      <div className="relative z-10 hidden h-full lg:flex">
        {panelItems.map((panel, index) => {
          const isActive = active === index;
          const collapsedLabel = panel.title.replace("Flow Cytometry Solutions", "Flow Cytometry").replace("Water Purification Systems", "Water Purification");
          const labelWords = collapsedLabel.split(" ");

          return (
            <motion.div
              key={panel.title}
              onMouseEnter={() => {
                setActive(index);
              }}
              onFocus={() => {
                setActive(index);
              }}
              onClick={() => activatePanel(index)}
              animate={{ flex: isActive ? (index === 0 ? 4.65 : 4.35) : 1.12 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-w-0 cursor-pointer overflow-hidden border-r border-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              tabIndex={0}
            >
              <motion.img
                src={img(panel.image)}
                alt=""
                aria-hidden="true"
                loading={index <= 2 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index <= 1 ? "high" : "auto"}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: panel.imagePosition || "center" }}
                animate={{
                  scale: isActive ? 1.02 : 1.08,
                  opacity: isActive ? 1 : 0.42,
                  filter: isActive ? "saturate(1.02) contrast(1.04)" : "saturate(0.86) contrast(0.96) brightness(1.08)",
                }}
                transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.div
                className="absolute inset-0"
                animate={{ opacity: isActive ? 1 : 0.96 }}
                transition={{ duration: 0.45 }}
                style={{
                  background: isActive
                    ? "linear-gradient(90deg, rgba(3,11,19,0.94) 0%, rgba(3,11,19,0.7) 42%, rgba(3,11,19,0.16) 100%), linear-gradient(0deg, rgba(3,11,19,0.88) 0%, rgba(3,11,19,0.08) 54%, rgba(3,11,19,0.34) 100%)"
                    : `linear-gradient(180deg, rgba(248,250,252,0.64) 0%, rgba(226,232,240,0.42) 100%), radial-gradient(circle at 50% 24%, ${panel.accent}28 0%, transparent 44%)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                  backgroundSize: "86px 86px",
                }}
              />

              <motion.div
                className="absolute inset-x-0 bottom-0 h-1"
                animate={{ opacity: isActive ? 1 : 0.72 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: panel.accent }}
              />

              <motion.div
                className="relative z-10 flex h-full flex-col justify-between p-7 xl:p-10"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.24 }}
              >
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -16 }}
                  transition={{ duration: 0.36 }}
                  className="min-h-[88px]"
                >
                  {index === 0 ? (
                    <img
                      src={img("/images/sc-logo-mark-only.png")}
                      alt="Science Centre SC mark"
                      className="h-24 w-auto object-contain brightness-0 invert drop-shadow-[0_0_28px_rgba(46,163,242,0.22)]"
                    />
                  ) : panel.logo ? (
                    <img src={img(panel.logo)} alt="Science Centre Pakistan" className="h-20 w-auto object-contain brightness-0 invert" />
                  ) : (
                    <div className="inline-flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10 text-white backdrop-blur">
                      {panel.icon}
                    </div>
                  )}
                </motion.div>

                <div className={`relative ${isActive ? "max-w-[620px]" : "max-w-full"}`}>
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
                    transition={{ duration: 0.38, delay: isActive ? 0.08 : 0 }}
                    className="mb-5"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <span className="h-px w-14" style={{ backgroundColor: panel.accent }} />
                      <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: panel.accent }}>
                        {panel.short}
                      </span>
                    </div>
                    <p className="max-w-lg text-base leading-relaxed text-white/76 xl:text-lg">
                      {panel.desc}
                    </p>
                  </motion.div>

                  <div className={`mb-4 h-px ${isActive ? "w-12 bg-white/55" : "w-9 bg-slate-400/80"}`} />
                  {index === 0 ? (
                    <img
                      src={img("/images/sc-logo-wordmark-only.png")}
                      alt="Science Centre"
                      className="w-[min(520px,82vw)] max-w-full object-contain brightness-0 invert drop-shadow-[0_12px_35px_rgba(0,0,0,0.36)]"
                    />
                  ) : (
                    <h1
                      className="max-w-[11ch] font-[var(--app-font-heading)] text-[clamp(2.85rem,5.3vw,5rem)] font-black leading-[0.92] tracking-tight text-white transition-all duration-500"
                    >
                      {panel.title}
                    </h1>
                  )}

                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.78 }}
                    transition={{ duration: 0.32, delay: isActive ? 0.12 : 0 }}
                    className="mt-7"
                  >
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={handleEnterWebsite}
                        className="inline-flex items-center gap-4 rounded-full bg-primary px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_20px_55px_rgba(46,163,242,0.35)] transition-transform hover:-translate-y-0.5"
                      >
                        Enter Website <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <Link
                        href={panel.href}
                        className="inline-flex items-center gap-4 border border-white/18 bg-white/[0.08] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white backdrop-blur transition-colors hover:bg-white/[0.14]"
                      >
                        Explore this area <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-[6.2vh] pt-28 xl:px-5"
                animate={{ opacity: isActive ? 0 : 1, y: isActive ? 18 : 0 }}
                transition={{ duration: 0.34 }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[43vh] transition-opacity duration-300 group-hover:opacity-95"
                  style={{
                    background: `linear-gradient(0deg, rgba(3,11,19,0.88) 0%, rgba(3,11,19,0.62) 40%, ${panel.accent}18 72%, transparent 100%)`,
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh] border-t border-white/14 backdrop-blur-[3px] transition-transform duration-500 group-hover:-translate-y-2"
                  style={{
                    background: `linear-gradient(180deg, ${panel.accent}22 0%, rgba(3,11,19,0.54) 54%, rgba(3,11,19,0.84) 100%)`,
                    clipPath: "polygon(0 14%, 100% 0, 100% 100%, 0 100%)",
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]"
                  style={{ background: `linear-gradient(90deg, transparent 0%, ${panel.accent} 46%, transparent 100%)` }}
                />
                <div className="relative transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div
                      className="h-px w-12 shadow-[0_0_16px_currentColor]"
                      style={{ backgroundColor: panel.accent, color: panel.accent }}
                    />
                    <span className="font-[var(--app-font-heading)] text-[11px] font-black leading-none text-white/42">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="max-w-full font-[var(--app-font-heading)] text-[clamp(0.9rem,1.02vw,1.28rem)] font-black uppercase leading-[0.94] tracking-normal text-white drop-shadow-[0_10px_26px_rgba(0,0,0,0.42)]">
                    {labelWords.map((word) => (
                      <span key={word} className="block">
                        {word}
                      </span>
                    ))}
                  </h2>
                  <div className="mt-5 flex items-center justify-between gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/54">Preview</span>
                    <span
                      className="grid h-8 w-8 place-items-center rounded-full text-white shadow-[0_10px_28px_rgba(3,11,19,0.32)]"
                      style={{ backgroundColor: panel.accent }}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end p-6 lg:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="relative overflow-hidden border border-white/16 bg-[#06111d]/76 p-5 backdrop-blur-md"
          >
            <img
              src={img(activePanel.image)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
              style={{ objectPosition: activePanel.imagePosition || "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030b13] via-[#030b13]/76 to-[#030b13]/28" />
            <div className="relative min-h-[320px] pt-36">
            <div className="mb-3 h-px w-10 bg-white/45" />
            {activePanel.title === "Science Centre" ? (
              <img
                src={img("/images/sc-logo-wordmark-only.png")}
                alt="Science Centre"
                className="w-[min(330px,78vw)] max-w-full object-contain brightness-0 invert"
              />
            ) : (
              <h1 className="font-[var(--app-font-heading)] text-4xl font-black leading-none">
                {activePanel.title}
              </h1>
            )}
            <p className="mt-4 text-sm leading-relaxed text-white/72">{activePanel.desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {panelItems.map((panel, index) => (
            <button
              key={panel.title}
              type="button"
              onClick={() => setActive(index)}
              className={`h-1.5 ${active === index ? "bg-primary" : "bg-white/25"}`}
              aria-label={`Show ${panel.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type FeaturedInstrument = {
  id: string;
  name: string;
  fullName: string;
  brand: string;
  category: string;
  accent: string;
  desc: string;
  image: string;
  specs: string[];
  href: string;
  external?: boolean;
};

const featuredInstruments: FeaturedInstrument[] = [
  {
    id: "ol-labscan3d",
    name: "LABScan3D",
    fullName: "LABScan3D Multiplex Analyzer",
    brand: "One Lambda",
    category: "Readers & Analysers",
    accent: "#D71920",
    desc: "Advanced, high-throughput IVD-certified multiplex analyser engineered for transplant diagnostics, HLA typing, and antibody detection using xMAP bead-based suspension technology.",
    image: resolveAsset("/images/ol-labscan3d.jpg"),
    specs: ["500 bead regions", "IVD-certified system", "HLA typing and antibody detection", "96-well microplate workflow"],
    href: "/products/ol-labscan3d",
  },
  {
    id: "cytek-nl-clc",
    name: "Northern Lights CLC",
    fullName: "Cytek Northern Lights CLC Clinical System",
    brand: "Cytek",
    category: "Flow Cytometry",
    accent: "#6F6BB7",
    desc: "Full spectrum flow cytometry for clinical environments, designed for diagnostic laboratories that need sensitive immunophenotyping with efficient daily QC and transferable templates.",
    image: resolveAsset("/images/featured/cytek-northern-lights-clc.png"),
    specs: ["Clinical-use configuration", "Up to 3 laser lines", "38 fluorescence channels", "SpectroFlo clinical workflow"],
    href: "/products/cytek-nl-clc",
  },
  {
    id: "cytek-aurora",
    name: "Cytek Aurora Cell Cycle",
    fullName: "Cytek Aurora Full Spectrum Flow Cytometer",
    brand: "Cytek",
    category: "Cell Cycle / Flow Cytometry",
    accent: "#6F6BB7",
    desc: "A full spectrum flow cytometer for high-dimensional cell analysis, supporting deep immunophenotyping, rare cell analysis, small particle detection, and cell-cycle workflow development.",
    image: resolveAsset("/images/featured/cytek-aurora.webp"),
    specs: ["Up to 5 lasers", "64 fluorescence channels", "40-color panels demonstrated", "SpectroFlo unmixing software"],
    href: "/products/cytek-aurora",
  },
  {
    id: "ngene-brca",
    name: "NGeneBio BRCAaccuTest",
    fullName: "BRCAaccuTest / BRCAaccuTest PLUS",
    brand: "NGeneBio",
    category: "NGS Precision Diagnostics",
    accent: "#E91E2F",
    desc: "NGS-based BRCA1/2 reagent kit for germline and somatic variant detection, with PLUS support for expanded target coverage and CNV analysis.",
    image: resolveAsset("/images/ngene/precision1Img1_en.png"),
    specs: ["BRCA1 and BRCA2 targets", "Germline and FFPE tissue", "Illumina MiSeq/MiniSeq platforms", "CE-IVD and MFDS approved"],
    href: "/products/ngene-brca",
  },
  {
    id: "ol-alltype-fastplex",
    name: "AllType FASTplex NGS",
    fullName: "AllType FASTplex NGS",
    brand: "One Lambda",
    category: "Next-Generation Sequencing",
    accent: "#D71920",
    desc: "Rapid CE-IVD HLA NGS solution with sample-to-sequencing in under 7 hours, less than 90 minutes hands-on time, and reportable results in 1.5 days or less.",
    image: resolveAsset("/images/ol-alltype-fastplex.jpeg"),
    specs: ["Under 7-hour workflow", "Less than 90 min hands-on", "Allele-level HLA typing", "TypeStream Visual software"],
    href: "/products/ol-alltype-fastplex",
  },
  {
    id: "rex-ph510t",
    name: "REX PH510T",
    fullName: "REX PH510T Portable pH Meter",
    brand: "REX",
    category: "Portable Meters",
    accent: "#0076C8",
    desc: "Professional smart portable pH meter with IP-rated protection, high-accuracy pH measurement, rechargeable battery, GLP storage, and USB export for demanding field use.",
    image: resolveAsset("/images/featured/rex-ph510t.webp"),
    specs: ["Model PH510T", "pH/Temp and mV/ORP", "Up to 8 calibration points", "1000-group data storage"],
    href: "/products/rex-ph510t",
  },
];

function FeaturedProducts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const [current, setCurrent] = useState(0);
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
        setCurrent(c => (c + 1) % featuredInstruments.length);
      }
    }, 30);
  };

  useEffect(() => {
    startTimer();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [current]);

  const go = (i: number) => { setCurrent(i); };
  const prev = () => go((current - 1 + featuredInstruments.length) % featuredInstruments.length);
  const next = () => go((current + 1) % featuredInstruments.length);

  const p = featuredInstruments[current];

  return (
    <section ref={ref} id="products" className="bg-background border-t border-border overflow-hidden flex flex-col justify-center" style={{ height: "100dvh", paddingTop: "96px" }}>
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div className="text-xs font-bold tracking-[0.18em] text-primary uppercase mb-2"
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              Featured Instruments
            </motion.div>
            <motion.h3 className="text-2xl md:text-3xl font-[var(--app-font-heading)] font-bold text-foreground tracking-tight leading-tight"
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
              <Link href="/contact">Request Quote</Link>
            </Button>
          </motion.div>
        </div>

        {/* Main Slideshow */}
        <motion.div
          className="relative w-full overflow-hidden border border-border bg-background shadow-sm"
          style={{ height: "min(520px, calc(100dvh - 300px))", minHeight: "360px" }}
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>

          {/* Background layer */}
          <AnimatePresence mode="sync">
            <motion.div key={"bg-" + current}
              className="absolute inset-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                background: `
                  radial-gradient(circle at 74% 42%, ${p.accent}22 0%, transparent 34%),
                  radial-gradient(circle at 18% 10%, ${p.accent}16 0%, transparent 28%),
                  linear-gradient(135deg, ${p.accent}14 0%, rgba(255,255,255,0.94) 52%, ${p.accent}10 100%)
                `,
              }}
            />
          </AnimatePresence>

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-[0.045]"
            style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.65) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.65) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-r from-transparent via-white/35 to-white/70 lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/85 to-transparent" />

          {/* Blended product scene */}
          <AnimatePresence mode="wait">
            <motion.div
              key={"image-scene-" + current}
              className="pointer-events-none absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="absolute right-[-10%] top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full blur-3xl md:right-[6%]"
                style={{ backgroundColor: `${p.accent}22` }}
              />
              <div
                className="absolute bottom-5 right-[13rem] hidden h-48 w-[28rem] rounded-full blur-2xl lg:block"
                style={{ backgroundColor: `${p.accent}18` }}
              />
              {p.image ? (
                <>
                  <img
                    src={p.image}
                    alt=""
                    className="absolute -right-16 top-1/2 hidden h-[118%] max-w-[64%] -translate-y-1/2 object-contain opacity-[0.09] saturate-125 lg:block"
                    style={{
                      WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 24%, black 72%, transparent 100%)",
                      maskImage: "linear-gradient(90deg, transparent 0%, black 24%, black 72%, transparent 100%)",
                    }}
                    loading="lazy"
                  />
                  <motion.img
                    src={p.image}
                    alt={p.fullName}
                    className="absolute bottom-10 right-[16.5rem] hidden max-h-[74%] max-w-[34%] object-contain mix-blend-multiply drop-shadow-[0_26px_34px_rgba(15,23,42,0.22)] contrast-[1.04] saturate-110 lg:block 2xl:right-[19rem]"
                    initial={{ opacity: 0, scale: 0.94, x: 34, rotate: 1.5 }}
                    animate={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.96, x: -18 }}
                    transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
                    loading="eager"
                  />
                  <motion.img
                    src={p.image}
                    alt={p.fullName}
                    className="absolute right-3 top-20 h-28 w-36 object-contain opacity-85 mix-blend-multiply drop-shadow-xl contrast-[1.04] saturate-110 md:right-8 md:top-16 md:h-36 md:w-44 lg:hidden"
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 0.85, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    loading="eager"
                  />
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Left: main content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-9 lg:p-10 lg:pr-[34rem] xl:pr-[37rem]">
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
                {String(featuredInstruments.length).padStart(2, "0")}
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
                <h2 className="max-w-[11ch] font-[var(--app-font-heading)] font-black text-foreground leading-none tracking-tight md:max-w-2xl"
                  style={{ fontSize: "clamp(2.15rem, 5.3vw, 4.8rem)" }}>
                  {p.name}
                </h2>
                <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-muted-foreground line-clamp-4 md:text-lg lg:line-clamp-3">
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
                {featuredInstruments.map((_, i) => (
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
                {[{ fn: prev, label: "Previous", icon: ArrowLeft }, { fn: next, label: "Next", icon: ArrowRight }].map(({ fn, label, icon: Icon }) => (
                  <button key={label} onClick={fn} aria-label={label}
                    className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200 text-sm font-bold">
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: specs panel (desktop only) */}
          <AnimatePresence mode="wait">
            <motion.div key={"specs-" + current}
              className="absolute bottom-7 right-5 top-7 hidden w-64 flex-col justify-center border border-border/75 bg-background/70 p-6 shadow-sm backdrop-blur-md xl:flex"
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
              <a href={p.href}
                target={p.external ? "_blank" : undefined}
                rel={p.external ? "noopener noreferrer" : undefined}
                className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
                style={{ color: p.accent }}>
                View Details <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
          </AnimatePresence>
        </motion.div>

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

/* Credibility */
function Credibility() {
  return (
    <section id="about" className="bg-foreground text-background relative overflow-hidden flex items-center justify-center" style={{ height: "100dvh" }}>
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <img
          src={img("/images/sc-diagnostics-optimized.webp")}
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
            <AnimatedStat value="9" label="Active Brands" sub="Specialist catalogues across diagnostics, research and lab systems." delay={0.2} />
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
const SECTION_NAMES = ["Solutions", "Instruments", "Partners", "About", "Locations", "Contact"];

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

function LogoHandoffIntro({ onDone }: { onDone: () => void }) {
  const logoSrc = img("/images/sc-logo-full-intro.webp");

  useEffect(() => {
    const timeout = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(timeout);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#01040a]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.48, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(1,4,10,0.96) 0%, rgba(1,4,10,0.76) 48%, rgba(1,4,10,0.52) 100%), url('/images/sc-lab-hero-optimized.webp') center / cover no-repeat",
        }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.28),rgba(20,184,166,0.12)_32%,transparent_62%)]"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: [0, 0.88, 0.7], scale: [0.82, 1, 1.04] }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <motion.div
          className="relative w-[min(440px,62vw)]"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={logoSrc}
            alt=""
            aria-hidden="true"
            className="w-full object-contain opacity-45"
            style={{ filter: "grayscale(1) brightness(1.75)" }}
          />
          <motion.img
            src={logoSrc}
            alt="Science Centre"
            className="absolute inset-0 w-full object-contain drop-shadow-[0_0_24px_rgba(56,189,248,0.48)]"
            initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
            transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

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

  const goTo = (index: number) => {
    if (cooldown.current || index === current) return;
    cooldown.current = true;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setTimeout(() => { cooldown.current = false; }, 850);
  };

  const enterWebsite = () => {
    cooldown.current = false;
    setDirection(1);
    setCurrent(1);
  };

  const sections = [
    <Solutions key="solutions" onEnterWebsite={enterWebsite} />,
    <FeaturedProducts key="products" />,
    <Partners key="partners" />,
    <Credibility key="credibility" />,
    <Locations key="locations" />,
    <SiteFooter key="contact" />,
  ];

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
      <AnimatePresence>
        {!splashDone && (
          <LogoHandoffIntro onDone={() => setSplashDone(true)} />
        )}
      </AnimatePresence>
      {/* 
        Section backgrounds:
        0=Solutions(hidden nav), 1=Instruments(light), 2=Partners(light),
        3=Credibility, 4=Locations(light), 5=Contact(light)
        forceSolid=true on light sections so links are dark and visible
      */}
      <SiteNavbar
        visible={splashDone && current !== 0}
        forceSolid={current === 1 || current === 2 || current === 4 || current === 5}
        forceTransparent={false}
        tone={current === 3 ? "dark" : "light"}
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
      {splashDone && current !== 0 && (
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
