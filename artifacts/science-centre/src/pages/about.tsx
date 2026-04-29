import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SiteNavbar } from "@/components/site-navbar";
import { ArrowRight, Award, Globe, HeartPulse, Microscope, FlaskConical, Dna } from "lucide-react";
import { Link } from "wouter";

function img(src: string) {
  return import.meta.env.BASE_URL.replace(/\/$/, "") + src;
}

/* ─── Reveal ──────────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── CountUp ─────────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = to / 90;
    const t = setInterval(() => {
      v += step;
      if (v >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(v));
    }, 1000 / 60);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Data ────────────────────────────────────────────────────── */
const ceoParagraphs = [
  "At Science Centre, we are committed to advancing Pakistan's healthcare and life sciences landscape by partnering with globally recognized leaders in Life Sciences, Transplant Diagnostics, Molecular Biology, and Immunology.",
  "Our mission is to introduce cutting-edge technologies and international best practices that empower laboratories, clinicians, and researchers to deliver accurate, timely, and impactful outcomes.",
  "Over the years, our dedicated team has played a pivotal role in strengthening key segments of the life sciences industry, contributing to improved diagnostics, innovation, and capacity building across the country.",
  "As we move forward, we remain focused on fostering strong collaborations, driving innovation, and creating sustainable growth opportunities for our partners and stakeholders.",
  "Together, we aim to shape a future where advanced healthcare solutions are accessible, reliable, and transformative for Pakistan.",
];

const stats = [
  { value: 39, suffix: "+", label: "Years of Excellence" },
  { value: 500, suffix: "+", label: "Clients Served" },
  { value: 8, suffix: "+", label: "Global Brands" },
  { value: 4, suffix: "", label: "Cities Nationwide" },
];

const values = [
  { icon: <Award className="h-5 w-5" />, title: "Excellence", desc: "Delivering only certified, internationally validated instruments and reagents to Pakistan's top institutions.", accent: "#0077C8" },
  { icon: <Globe className="h-5 w-5" />, title: "Partnership", desc: "Long-term relationships with global principals and local clients — built on trust, transparency, and shared purpose.", accent: "#2E7D32" },
  { icon: <Globe className="h-5 w-5" />, title: "Innovation", desc: "Continuously introducing cutting-edge technologies to elevate Pakistan's scientific and clinical landscape.", accent: "#7B2D8B" },
  { icon: <HeartPulse className="h-5 w-5" />, title: "Impact", desc: "Every instrument distributed has real consequences — faster diagnoses, more accurate results, better outcomes.", accent: "#E8262A" },
];

const timeline = [
  { year: "1985", title: "Founded", desc: "Science Centre established in Rawalpindi as a specialist distributor for clinical laboratory equipment." },
  { year: "1995", title: "First Global Deal", desc: "Secured first international partnership, bringing certified diagnostic instruments to Pakistan for the first time." },
  { year: "2005", title: "Luminex Partnership", desc: "Became official distributor for Luminex — bringing multiplexing technology to Pakistan's leading hospitals." },
  { year: "2010", title: "Merck Alliance", desc: "Partnered with Merck to distribute the full Guava® and Amnis® flow cytometry portfolio nationwide." },
  { year: "2015", title: "National Expansion", desc: "Opened regional offices in Karachi, Peshawar, and Lahore — covering the full country." },
  { year: "2024", title: "Today", desc: "Serving 500+ clients across hospitals, research institutes, universities and pharmaceutical companies." },
];

const focusAreas = [
  { icon: <HeartPulse className="h-4 w-4" />, label: "Transplant Diagnostics" },
  { icon: <Dna className="h-4 w-4" />, label: "Life Sciences" },
  { icon: <Microscope className="h-4 w-4" />, label: "Molecular Biology" },
  { icon: <FlaskConical className="h-4 w-4" />, label: "Immunology" },
  { icon: <FlaskConical className="h-4 w-4" />, label: "Cell Biology" },
  { icon: <FlaskConical className="h-4 w-4" />, label: "Pharmaceuticals" },
];

/* ─── Slide variants ──────────────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%", opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }),
};

/* ─── Panel 1: CEO ────────────────────────────────────────────── */
function CEOPanel() {
  return (
    <div className="relative w-full bg-[#0a0a0a]" style={{ height: "100dvh", display: "grid", gridTemplateRows: "auto 1fr" }}>

      {/* Name — centered at top */}
      <motion.div className="flex items-center justify-center" style={{ paddingTop: "108px", paddingBottom: "32px" }}
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <h1 className="text-xs font-semibold tracking-[0.5em] text-white/80 uppercase">Najam Iqbal</h1>
      </motion.div>

      {/* Body: photo left | message right */}
      <div style={{ display: "grid", gridTemplateColumns: "45% 1fr", paddingBottom: "48px", paddingLeft: "80px", paddingRight: "100px", gap: "80px", alignItems: "center", minHeight: 0 }}>

        {/* LEFT: full-height portrait photo */}
        <motion.div className="relative h-full" style={{ maxHeight: "480px" }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}>

          <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
            <img
              src={img("/images/ceo.png")}
              alt="Najam Iqbal — CEO Science Centre"
              className="w-full h-full object-cover object-top"
              style={{ filter: "contrast(1.05) brightness(0.88)" }}
            />
            {/* Extra left-side overlay to kill wall stripes */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to right, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.1) 40%, transparent 65%)" }} />
          </div>

          {/* Bleed right + bottom into black */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent 50%, #0a0a0a 100%)" }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent 80%, #0a0a0a 100%)" }} />
        </motion.div>

        {/* RIGHT: message paragraphs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <div className="space-y-5">
            {ceoParagraphs.map((para, i) => (
              <motion.p key={i} className="text-white/55 text-sm leading-[1.95] font-light"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 + i * 0.09 }}>
                {para}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Panel 2: Mission ────────────────────────────────────────── */
function MissionPanel() {
  return (
    <div className="relative bg-background flex items-center" style={{ height: "100dvh", paddingTop: "96px" }}>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 50%, hsl(var(--primary)/0.05), transparent 60%)" }} />

      <div className="container mx-auto px-6 md:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <div className="text-xs font-bold tracking-[0.22em] text-primary uppercase mb-5 flex items-center gap-3">
                <div className="w-5 h-px bg-primary" /> Who We Are
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-[var(--app-font-heading)] font-black text-foreground leading-[1.0] tracking-tight mb-8">
                Pakistan's Bridge to World-Class Science.
              </h2>
              <div className="w-12 h-0.5 bg-primary mb-8" />
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                For over 39 years, Science Centre has connected Pakistan's hospitals, research institutes, universities, and pharmaceutical companies with the world's most advanced laboratory instruments and diagnostic technologies.
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-8">
                {focusAreas.map((area, i) => (
                  <motion.div key={i}
                    className="flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all duration-300 cursor-default"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                    viewport={{ once: true }}>
                    <span className="text-primary">{area.icon}</span>
                    {area.label}
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {stats.map((s, i) => (
                  <motion.div key={i}
                    className="border border-border p-5 relative overflow-hidden group"
                    whileHover={{ y: -4, borderColor: "hsl(var(--primary)/0.5)" }}
                    transition={{ duration: 0.25 }}>
                    <div className="text-3xl font-[var(--app-font-heading)] font-black text-foreground mb-1">
                      <CountUp to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs font-semibold text-foreground mb-0.5">{s.label}</div>
                    <motion.div className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }} whileHover={{ width: "100%" }}
                      transition={{ duration: 0.35 }} />
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Panel 3: Timeline ───────────────────────────────────────── */
function TimelinePanel() {
  const [active, setActive] = useState(timeline.length - 1);

  return (
    <div className="relative bg-[#080810] flex items-center overflow-hidden" style={{ height: "100dvh", paddingTop: "96px" }}>
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="container mx-auto px-6 md:px-12 w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Header + timeline list */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="text-xs font-bold tracking-[0.22em] text-primary uppercase mb-4 flex items-center gap-3">
                <div className="w-5 h-px bg-primary" /> Our Journey
              </div>
              <h2 className="text-3xl md:text-4xl font-[var(--app-font-heading)] font-black text-white tracking-tight mb-8">
                39 Years of Scientific Excellence.
              </h2>
            </Reveal>

            <div className="relative">
              <div className="absolute left-[17px] top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-1">
                {timeline.map((item, i) => (
                  <motion.button key={i} onClick={() => setActive(i)}
                    className="flex items-start gap-5 w-full text-left group"
                    whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <motion.div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black z-10 relative flex-shrink-0 mt-2"
                      animate={{
                        borderColor: i === active ? "hsl(var(--primary))" : "rgba(255,255,255,0.1)",
                        backgroundColor: i === active ? "hsl(var(--primary))" : "transparent",
                        color: i === active ? "white" : "rgba(255,255,255,0.3)",
                      }}>
                      {i === timeline.length - 1 ? "★" : item.year.slice(2)}
                    </motion.div>
                    <div className="py-2 flex-1 border-b border-white/5">
                      <div className="text-[10px] font-bold tracking-widest text-white/30">{item.year}</div>
                      <div className={`font-[var(--app-font-heading)] font-bold text-sm transition-colors ${i === active ? "text-primary" : "text-white/60"}`}>
                        {item.title}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="border border-white/10 p-10 relative overflow-hidden">
                <div className="absolute right-6 top-6 text-8xl font-black text-white/[0.03] font-[var(--app-font-heading)] select-none pointer-events-none leading-none">
                  {timeline[active].year}
                </div>
                <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">{timeline[active].year}</div>
                <h3 className="text-3xl md:text-4xl font-[var(--app-font-heading)] font-black text-white mb-5 leading-tight">
                  {timeline[active].title}
                </h3>
                <p className="text-white/60 text-lg font-light leading-relaxed mb-8">{timeline[active].desc}</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}
                    className="w-10 h-10 border border-white/20 text-white/50 hover:text-white hover:border-white/50 disabled:opacity-20 transition-all text-sm font-bold flex items-center justify-center">←</button>
                  <button onClick={() => setActive(Math.min(timeline.length - 1, active + 1))} disabled={active === timeline.length - 1}
                    className="w-10 h-10 border border-white/20 text-white/50 hover:text-white hover:border-white/50 disabled:opacity-20 transition-all text-sm font-bold flex items-center justify-center">→</button>
                  <span className="ml-auto text-xs text-white/30 font-medium">
                    {String(active + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Panel 4: Values ─────────────────────────────────────────── */
function ValuesPanel() {
  return (
    <div className="relative bg-background flex items-center" style={{ height: "100dvh", paddingTop: "96px" }}>
      <div className="container mx-auto px-6 md:px-12 w-full">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-bold tracking-[0.22em] text-primary uppercase mb-4 flex items-center gap-3">
                <div className="w-5 h-px bg-primary" /> What Drives Us
              </div>
              <h2 className="text-4xl md:text-5xl font-[var(--app-font-heading)] font-black text-foreground tracking-tight">Our Core Values</h2>
            </div>
            <p className="text-muted-foreground text-sm font-light max-w-xs leading-relaxed md:text-right">
              The principles guiding every partnership, product choice, and client interaction.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <motion.div className="p-7 border border-border relative overflow-hidden group h-full flex flex-col"
                whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                <div className="w-11 h-11 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ color: v.accent, background: v.accent + "15", border: `1px solid ${v.accent}30` }}>
                  {v.icon}
                </div>
                <h4 className="font-[var(--app-font-heading)] font-black text-xl text-foreground mb-3">{v.title}</h4>
                <p className="text-muted-foreground text-sm font-light leading-relaxed flex-1">{v.desc}</p>
                <motion.div className="mt-5 h-0.5 rounded-full"
                  style={{ backgroundColor: v.accent }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  viewport={{ once: true }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${v.accent}08, transparent 70%)` }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Panel 5: CTA ────────────────────────────────────────────── */
function CTAPanel() {
  return (
    <div className="relative bg-foreground flex items-center justify-center text-center overflow-hidden" style={{ height: "100dvh" }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(var(--primary)/0.15), transparent 70%)" }} />

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-xs font-bold tracking-[0.22em] text-primary uppercase mb-6">Work With Us</div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-[var(--app-font-heading)] font-black text-white leading-tight tracking-tight mb-8 max-w-4xl mx-auto">
            Let's Shape Pakistan's Scientific Future Together.
          </h2>
          <p className="text-white/50 text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed">
            Whether you're a hospital, research institute, university, or laboratory — we're ready to bring the right solutions to your door.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#contact"
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 text-sm font-bold tracking-wide uppercase hover:bg-primary/90 transition-all duration-300 group">
              Get in Touch <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-wide uppercase hover:border-white/50 hover:bg-white/5 transition-all duration-300">
              Browse Products
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ─── Main About Page ─────────────────────────────────────────── */
const PANEL_NAMES = ["CEO", "Mission", "Journey", "Values", "Contact"];

export default function About() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [navVisible, setNavVisible] = useState(false);
  const cooldown = useRef(false);

  const panels = [
    <CEOPanel key="ceo" />,
    <MissionPanel key="mission" />,
    <TimelinePanel key="timeline" />,
    <ValuesPanel key="values" />,
    <CTAPanel key="cta" />,
  ];

  const goTo = (index: number) => {
    if (cooldown.current || index === current) return;
    cooldown.current = true;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setTimeout(() => { cooldown.current = false; }, 900);
  };

  // Hover-to-reveal navbar on CEO panel, always visible on others
  useEffect(() => {
    if (current !== 0) {
      setNavVisible(true);
      return;
    }
    setNavVisible(false);
    const onMouseMove = (e: MouseEvent) => {
      setNavVisible(e.clientY < 80);
    };
    const onMouseLeave = () => setNavVisible(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [current]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    return () => { document.body.style.overflow = ""; document.body.style.height = ""; };
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown.current) return;
      if (e.deltaY > 20) goTo(Math.min(current + 1, panels.length - 1));
      else if (e.deltaY < -20) goTo(Math.max(current - 1, 0));
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); goTo(Math.min(current + 1, panels.length - 1)); }
      if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(Math.max(current - 1, 0)); }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("wheel", onWheel); window.removeEventListener("keydown", onKey); };
  }, [current]);

  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 60) return;
      if (diff > 0) goTo(Math.min(current + 1, panels.length - 1));
      else goTo(Math.max(current - 1, 0));
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); };
  }, [current]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background">
      <SiteNavbar visible={navVisible} />

      {/* Panels */}
      <div className="relative w-full overflow-hidden" style={{ height: "100dvh" }}>
        <AnimatePresence custom={direction} mode="sync">
          <motion.div key={current} custom={direction}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            className="absolute inset-0 w-full" style={{ height: "100dvh" }}>
            {panels[current]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot nav — right side */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {PANEL_NAMES.map((name, i) => (
          <button key={i} onClick={() => goTo(i)} className="group flex items-center gap-2 justify-end" title={name}>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-background/95 text-foreground px-2 py-1 border border-border opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-sm">
              {name}
            </span>
            <motion.div className="rounded-full"
              animate={{
                width: i === current ? 10 : 5,
                height: i === current ? 10 : 5,
                backgroundColor: i === current ? "hsl(var(--primary))" : "hsl(var(--border))",
                boxShadow: i === current ? "0 0 8px hsl(var(--primary)/0.6)" : "none",
              }}
              transition={{ duration: 0.3 }} />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-border/50 z-50">
        <motion.div className="h-full bg-primary"
          animate={{ width: `${(current / (panels.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
      </div>

      {/* Section label */}
      <div className="fixed bottom-4 left-6 z-50">
        <AnimatePresence mode="wait">
          <motion.span key={current}
            className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}>
            {String(current + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")} — {PANEL_NAMES[current]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
