import { useEffect, useRef, useState } from "react";
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

const introParticles = [
  { x: "18%", y: "24%", size: 4, delay: 0.45, color: "#7dd3fc" },
  { x: "25%", y: "72%", size: 3, delay: 0.9, color: "#10b981" },
  { x: "34%", y: "38%", size: 5, delay: 0.65, color: "#2ea3f2" },
  { x: "64%", y: "31%", size: 3, delay: 1.1, color: "#a7f3d0" },
  { x: "72%", y: "67%", size: 5, delay: 0.75, color: "#38bdf8" },
  { x: "81%", y: "44%", size: 4, delay: 1.3, color: "#22c55e" },
  { x: "48%", y: "18%", size: 3, delay: 1.0, color: "#93c5fd" },
  { x: "52%", y: "82%", size: 4, delay: 1.45, color: "#5eead4" },
];

const introSignals = ["HLA", "NGS", "FLOW", "WATER", "LIFE SCIENCES"];

const introBrandLogos = [
  { name: "One Lambda", logo: "/images/logos/onelambda-mark.png", x: "6%", y: "18%", delay: 0.1 },
  { name: "Merck", logo: "/images/logos/merck-logo-clean.png", x: "35%", y: "4%", delay: 0.2 },
  { name: "Luminex", logo: "/images/logos/luminex-logo-clean.png", x: "68%", y: "15%", delay: 0.3 },
  { name: "Cytek", logo: "/images/logos/cytek-logo.png", x: "81%", y: "45%", delay: 0.4 },
  { name: "NGeneBio", logo: "/images/logos/ngene-logo-clean.svg", x: "65%", y: "76%", delay: 0.5 },
  { name: "REX", logo: "/images/logos/rex-logo-crop.png", x: "34%", y: "82%", delay: 0.6 },
  { name: "HKM", logo: "/images/logos/hkm-logo.png", x: "8%", y: "66%", delay: 0.7 },
  { name: "Sugentech", logo: "/images/logos/sugentech-logo-clean.svg", x: "1%", y: "43%", delay: 0.8 },
  { name: "BioLegend", logo: "/images/biolegend/biolegend-logo.svg", x: "82%", y: "66%", delay: 0.9 },
];

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
  const [phase, setPhase] = useState<"calibrate" | "resolve" | "done">("calibrate");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    let cancelled = false;
    const timeouts: number[] = [];
    const tick = (now: number) => {
      const pct = Math.min(100, Math.round(((now - started) / 3600) * 100));
      setProgress(pct);
      if (pct < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    timeouts.push(window.setTimeout(() => setPhase("resolve"), 1750));

    const heroReady = new Promise<void>((resolve) => {
      const hero = new Image();
      hero.onload = () => resolve();
      hero.onerror = () => resolve();
      hero.src = img("/images/sc-lab-hero-optimized.webp");
      if (hero.complete) resolve();
    });
    const minimumIntro = new Promise<void>((resolve) => {
      timeouts.push(window.setTimeout(resolve, 3800));
    });

    Promise.all([heroReady, minimumIntro]).then(() => {
      if (cancelled) return;
      timeouts.push(window.setTimeout(() => setPhase("done"), 950));
      timeouts.push(window.setTimeout(onDone, 1550));
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      timeouts.forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#020711] text-white"
      initial={{ opacity: 1 }}
      animate={phase === "done" ? { opacity: 0 } : { opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,163,242,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(46,163,242,0.16) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(46,163,242,0.28),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.18),transparent_42%)]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />

      {introParticles.map((p, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, backgroundColor: p.color, boxShadow: `0 0 18px ${p.color}` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.35], scale: [0, 1.25, 1], x: [0, index % 2 ? -14 : 14], y: [0, index % 2 ? 12 : -12] }}
          transition={{ duration: 2.2, delay: p.delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}

      <div className="absolute left-6 top-6 hidden text-[10px] font-black uppercase tracking-[0.34em] text-cyan-100/55 md:block">
        Scientific sourcing network
      </div>
      <div className="absolute right-6 top-6 hidden text-[10px] font-black uppercase tracking-[0.34em] text-cyan-100/55 md:block">
        SC-PK / {String(progress).padStart(3, "0")}
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <motion.div
          className="relative h-[300px] w-[300px] md:h-[420px] md:w-[420px]"
          initial={{ scale: 0.72, opacity: 0 }}
          animate={{ scale: phase === "resolve" ? 1 : 0.86, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-100/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-emerald-200/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          />

          {introBrandLogos.map((brand, index) => (
            <motion.div
              key={brand.name}
              className="absolute z-20 flex h-14 w-20 items-center justify-center border border-cyan-100/18 bg-white/[0.11] px-3 shadow-[0_18px_42px_rgba(0,0,0,0.3)] backdrop-blur-md md:h-16 md:w-24"
              style={{ left: brand.x, top: brand.y }}
              initial={{ opacity: 0, scale: 0.72, x: 0, y: 18 }}
              animate={
                phase === "calibrate"
                  ? { opacity: 1, scale: 1, x: [0, index % 2 ? -8 : 8, 0], y: [0, index % 2 ? 8 : -8, 0] }
                  : { opacity: 0, scale: 0.42, x: "150%", y: "135%" }
              }
              transition={
                phase === "calibrate"
                  ? { opacity: { duration: 0.45, delay: brand.delay }, scale: { duration: 0.45, delay: brand.delay }, x: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }
                  : { duration: 0.78, delay: index * 0.035, ease: [0.76, 0, 0.24, 1] }
              }
            >
              <img src={img(brand.logo)} alt={brand.name} className="max-h-10 max-w-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.2)] md:max-h-11" />
            </motion.div>
          ))}

          <motion.svg
            viewBox="0 0 420 420"
            className="absolute inset-0 h-full w-full overflow-visible"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={phase === "resolve" ? { opacity: 1, scale: 1 } : { opacity: 0.12, scale: 0.82 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <defs>
              <linearGradient id="introStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="48%" stopColor="#2ea3f2" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <filter id="introGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <motion.g
              transform="rotate(-16 210 210)"
              initial={{ opacity: 0, x: -18, y: 10 }}
              animate={{ opacity: 0.78, x: 0, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              filter="url(#introGlow)"
            >
              <motion.path
                d="M104 188H263L287 218H119Z"
                fill="rgba(46,163,242,0.12)"
                stroke="rgba(157,246,255,0.72)"
                strokeWidth="2"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.15, delay: 0.3, ease: "easeOut" }}
              />
              <motion.circle
                cx="104"
                cy="203"
                r="32"
                fill="rgba(125,211,252,0.08)"
                stroke="rgba(157,246,255,0.72)"
                strokeWidth="2"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: "104px 203px" }}
              />
              <motion.circle
                cx="104"
                cy="203"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.32)"
                strokeWidth="1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.95, 1.08, 0.95], opacity: 1 }}
                transition={{ duration: 2.4, delay: 0.75, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "104px 203px" }}
              />
              <motion.path
                d="M286 190H326V218H286Z"
                fill="rgba(16,185,129,0.12)"
                stroke="rgba(167,243,208,0.68)"
                strokeWidth="2"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.7, ease: "easeOut" }}
              />
              <motion.path
                d="M176 218L146 302M222 218L262 302M199 218V312"
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
              />
              <motion.path
                d="M80 203H128"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2.2, delay: 1.15, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>

            <motion.circle
              cx="210"
              cy="210"
              r="130"
              fill="none"
              stroke="url(#introStroke)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="90 38"
              filter="url(#introGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.95, rotate: 360 }}
              transition={{ pathLength: { duration: 1.35, ease: "easeOut" }, rotate: { duration: 16, repeat: Infinity, ease: "linear" } }}
              style={{ transformOrigin: "210px 210px" }}
            />
            <motion.path
              d="M128 290C172 206 251 206 292 126"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="10 16"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
            />
            <motion.path
              d="M128 126C172 210 251 210 292 290"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="10 16"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 1.2, delay: 0.55, ease: "easeOut" }}
            />
            <motion.path
              d="M210 145L266 177V243L210 275L154 243V177Z"
              fill="none"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              filter="url(#introGlow)"
            />
            <motion.path
              d="M178 199L210 178L244 199L232 238L188 238L178 199ZM210 178V222M178 199L210 222L244 199M188 238L210 222L232 238"
              fill="none"
              stroke="#9df6ff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.95 }}
              transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              filter="url(#introGlow)"
            />
            <motion.circle
              cx="210"
              cy="210"
              r="86"
              fill="rgba(46,163,242,0.06)"
              stroke="rgba(157,246,255,0.42)"
              strokeWidth="2"
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "210px 210px" }}
            />
            <motion.path
              d="M146 210H274M210 146V274"
              stroke="rgba(255,255,255,0.24)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.35, duration: 0.7, ease: "easeOut" }}
            />
            {[
              { cx: 178, cy: 199, fill: "#38bdf8" },
              { cx: 210, cy: 178, fill: "#ffffff" },
              { cx: 244, cy: 199, fill: "#22c55e" },
              { cx: 210, cy: 222, fill: "#7dd3fc" },
              { cx: 188, cy: 238, fill: "#9df6ff" },
              { cx: 232, cy: 238, fill: "#ffffff" },
            ].map((node, i) => (
              <motion.circle
                key={i}
                cx={node.cx}
                cy={node.cy}
                r={i === 3 ? 6 : 5}
                fill={node.fill}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.35 + i * 0.08, duration: 0.35 }}
                filter="url(#introGlow)"
              />
            ))}
          </motion.svg>

          <motion.div
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="font-mono text-xs tracking-[0.36em] text-cyan-100/70">/{String(progress).padStart(3, "0")}</div>
          </motion.div>
        </motion.div>

        <motion.div
          className="-mt-8 text-center md:-mt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={phase === "resolve" ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-[11px] font-black uppercase tracking-[0.55em] text-cyan-100/65">
            {introSignals[progress % introSignals.length]}
          </div>
          <div className="relative mt-4 inline-flex flex-col items-center">
            <div className="absolute inset-x-8 top-6 h-20 rounded-full bg-cyan-300/20 blur-3xl" />
            <img
              src={img("/images/sc-logo-full-nav.webp")}
              alt="Science Centre Pakistan"
              className="relative h-20 w-auto object-contain drop-shadow-[0_18px_34px_rgba(46,163,242,0.28)] md:h-28"
            />
            <div className="mt-4 inline-flex items-center gap-3 border border-cyan-100/20 bg-white/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/75 backdrop-blur-md">
              <Microscope className="h-4 w-4 text-emerald-200" />
              Global portfolios covered locally
            </div>
          </div>
          <div className="mt-3 text-xs font-black uppercase tracking-[0.46em] text-emerald-200/75 md:text-sm">
            Science Centre Pakistan
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 h-px w-56 -translate-x-1/2 overflow-hidden bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-300 via-white to-emerald-300"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

function BrandHubIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"brands" | "hub" | "done">("brands");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    let cancelled = false;
    const timeouts: number[] = [];

    const tick = (now: number) => {
      const pct = Math.min(100, Math.round(((now - started) / 3600) * 100));
      setProgress(pct);
      if (pct < 100) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    timeouts.push(window.setTimeout(() => setPhase("hub"), 1850));

    const heroReady = new Promise<void>((resolve) => {
      const hero = new Image();
      hero.onload = () => resolve();
      hero.onerror = () => resolve();
      hero.src = img("/images/sc-lab-hero-optimized.webp");
      if (hero.complete) resolve();
    });

    const minimumIntro = new Promise<void>((resolve) => {
      timeouts.push(window.setTimeout(resolve, 3900));
    });

    Promise.all([heroReady, minimumIntro]).then(() => {
      if (cancelled) return;
      timeouts.push(window.setTimeout(() => setPhase("done"), 900));
      timeouts.push(window.setTimeout(onDone, 1450));
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      timeouts.forEach(clearTimeout);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#020711] text-white"
      initial={{ opacity: 1 }}
      animate={phase === "done" ? { opacity: 0 } : { opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,163,242,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(46,163,242,0.18) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(46,163,242,0.18),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.16),transparent_44%)]" />

      <div className="absolute left-6 top-6 hidden text-[10px] font-black uppercase tracking-[0.34em] text-cyan-100/55 md:block">
        Scientific sourcing network
      </div>
      <div className="absolute right-6 top-6 hidden text-[10px] font-black uppercase tracking-[0.34em] text-cyan-100/55 md:block">
        SC-PK / {String(progress).padStart(3, "0")}
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <motion.div
          className="absolute w-full max-w-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={phase === "brands" ? { opacity: 1, y: 0 } : { opacity: 0, y: -28, scale: 0.96 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.48em] text-cyan-100/60">
              Global Scientific Portfolios
            </div>
            <div className="mt-4 font-[var(--app-font-heading)] text-3xl font-black uppercase tracking-[0.08em] md:text-5xl">
              Trusted brands, one local partner
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:grid-cols-9">
            {introBrandLogos.map((brand) => (
              <motion.div
                key={brand.name}
                className="flex h-20 items-center justify-center border border-cyan-100/16 bg-white/[0.09] p-3 shadow-[0_18px_44px_rgba(0,0,0,0.24)] backdrop-blur-md"
                initial={{ opacity: 0, y: 18, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.42, delay: brand.delay, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={img(brand.logo)} alt={brand.name} className="max-h-12 max-w-full object-contain" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute flex w-full max-w-3xl flex-col items-center text-center"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={phase === "hub" || phase === "done" ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-7 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.34em] text-cyan-100/65">
            <span className="h-px w-12 bg-cyan-100/30" />
            Covered under one sourcing hub
            <span className="h-px w-12 bg-cyan-100/30" />
          </div>
          <div className="relative">
            <div className="absolute inset-x-4 top-8 h-24 rounded-full bg-cyan-300/18 blur-3xl" />
            <img
              src={img("/images/sc-logo-full-nav.webp")}
              alt="Science Centre Pakistan"
              className="relative h-24 w-auto object-contain drop-shadow-[0_20px_38px_rgba(46,163,242,0.3)] md:h-32"
            />
          </div>
          <div className="mt-7 grid w-full max-w-2xl grid-cols-3 border border-cyan-100/16 bg-white/[0.07] text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 border-r border-cyan-100/12 px-3 py-4">
              <Microscope className="h-4 w-4 text-emerald-200" />
              Instruments
            </div>
            <div className="flex items-center justify-center gap-2 border-r border-cyan-100/12 px-3 py-4">
              <Dna className="h-4 w-4 text-cyan-200" />
              Diagnostics
            </div>
            <div className="flex items-center justify-center gap-2 px-3 py-4">
              <TestTube className="h-4 w-4 text-sky-200" />
              Reagents
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 h-px w-56 -translate-x-1/2 overflow-hidden bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-300 via-white to-emerald-300"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
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
    image: "/images/sc-lab-hero-optimized.webp",
    accent: "#2EA3F2",
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    title: "Transplant Diagnostics",
    short: "HLA typing and antibody screening",
    desc: "HLA typing, antibody detection, crossmatch and post-transplant monitoring workflows for specialist labs.",
    image: "/images/sc-lab-hero-optimized.webp",
    accent: "#E85D4A",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Flow Cytometry Solutions",
    short: "Cell analysis and immune profiling",
    desc: "Flow instruments, antibodies, panels and analysis support for high-parameter cell and immune workflows.",
    image: "/images/sc-lab-hero-optimized.webp",
    accent: "#06B6D4",
  },
  {
    icon: <Microscope className="h-5 w-5" />,
    title: "Cell Culture Solutions",
    short: "Media, reagents and lab support",
    desc: "Cell culture media, supplements, plastics and lab systems for repeatable cellular workflows.",
    image: "/images/sc-lab-hero-optimized.webp",
    accent: "#10B981",
  },
  {
    icon: <TestTube className="h-5 w-5" />,
    title: "Water Purification Systems",
    short: "Clinical, RO and ultrapure water",
    desc: "Water purification systems for analyzer feed, pure water and ultrapure laboratory applications.",
    image: "/images/sc-lab-hero-optimized.webp",
    accent: "#2563EB",
  },
  {
    icon: <Syringe className="h-5 w-5" />,
    title: "NGS Solutions",
    short: "Sequencing panels and workflows",
    desc: "NGS kits, library preparation, analysis tools and adoption support for clinical and research laboratories.",
    image: "/images/sc-lab-hero-optimized.webp",
    accent: "#7C3AED",
  },
];

function Solutions() {
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

/* ─── Products ────────────────────────────────────────────────── */
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
const SECTION_NAMES = ["Home", "Instruments", "Solutions", "Partners", "About", "Locations", "Contact"];

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
  const [splashDone, setSplashDone] = useState(() => {
    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "reload") return false;
      return window.sessionStorage.getItem("science-centre-intro-seen") === "1";
    } catch {
      return false;
    }
  });
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
    <FeaturedProducts key="products" />,
    <Solutions key="solutions" />,
    <Partners key="partners" />,
    <Credibility key="credibility" />,
    <Locations key="locations" />,
    <SiteFooter key="contact" />,
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
      <AnimatePresence>
        {!splashDone && (
          <BrandHubIntro
            onDone={() => {
              try {
                window.sessionStorage.setItem("science-centre-intro-seen", "1");
              } catch {
                // The intro still completes if browser storage is unavailable.
              }
              setSplashDone(true);
            }}
          />
        )}
      </AnimatePresence>
      {/* 
        Section backgrounds:
        0=Hero(transparent nav), 1=Instruments(light), 2=Solutions(hidden),
        3=Partners(light), 4=Credibility(dark), 5=Locations(light), 6=Contact(light)
        forceSolid=true on light sections so links are dark and visible
      */}
      <SiteNavbar
        visible={splashDone && current !== 2}
        forceSolid={current === 1 || current === 3 || current === 5 || current === 6}
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
