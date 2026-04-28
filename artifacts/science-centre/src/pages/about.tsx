import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, Quote, Award, Users, Globe, Microscope, FlaskConical, HeartPulse, Dna, ChevronDown } from "lucide-react";
import { Link } from "wouter";

function img(src: string) {
  return import.meta.env.BASE_URL.replace(/\/$/, "") + src;
}

/* ─── Animated counter ────────────────────────────────────────── */
function CountUp({ to, duration = 2, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(t);
  }, [inView, to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Reveal wrapper ──────────────────────────────────────────── */
function Reveal({ children, delay = 0, direction = "up" }: {
  children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 32 : 0, x: direction === "left" ? -32 : direction === "right" ? 32 : 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? "visible" : "hidden"}>
      {children}
    </motion.div>
  );
}

/* ─── Data ────────────────────────────────────────────────────── */
const stats = [
  { value: 39, suffix: "+", label: "Years of Excellence", sub: "Established 1985" },
  { value: 500, suffix: "+", label: "Clients Served", sub: "Hospitals, labs & universities" },
  { value: 8, suffix: "+", label: "Global Partnerships", sub: "World-class brands" },
  { value: 4, suffix: "", label: "Cities Nationwide", sub: "Rawalpindi, Karachi, Peshawar, Lahore" },
];

const values = [
  {
    icon: <Award className="h-6 w-6" />,
    title: "Excellence",
    desc: "We hold ourselves to the highest standard — delivering only certified, internationally validated instruments and reagents.",
    accent: "#0077C8",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Partnership",
    desc: "We invest in long-term relationships with both our global principals and local clients, built on trust, transparency, and shared goals.",
    accent: "#2E7D32",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Innovation",
    desc: "We continuously introduce cutting-edge technologies and international best practices to elevate Pakistan's scientific landscape.",
    accent: "#7B2D8B",
  },
  {
    icon: <HeartPulse className="h-6 w-6" />,
    title: "Impact",
    desc: "Every instrument we distribute has real consequences — faster diagnoses, more accurate results, better patient outcomes.",
    accent: "#E8262A",
  },
];

const timeline = [
  { year: "1985", title: "Founded", desc: "Science Centre established in Rawalpindi, beginning as a specialist distributor for clinical laboratory equipment." },
  { year: "1995", title: "First Global Partnership", desc: "Secured first international partnership, bringing globally certified diagnostic instruments to Pakistan for the first time." },
  { year: "2005", title: "Luminex Partnership", desc: "Became official distributor for Luminex — bringing multiplexing technology to Pakistan's leading hospitals and research institutions." },
  { year: "2010", title: "Merck Alliance", desc: "Partnered with Merck to distribute the full Guava® and Amnis® flow cytometry portfolio nationwide." },
  { year: "2015", title: "National Expansion", desc: "Opened regional offices in Karachi, Peshawar, and Lahore to better serve clients across the country." },
  { year: "2024", title: "Today", desc: "Serving 500+ clients across hospitals, research institutes, universities and pharmaceutical companies throughout Pakistan." },
];

const focusAreas = [
  { icon: <Dna className="h-5 w-5" />, label: "Life Sciences" },
  { icon: <HeartPulse className="h-5 w-5" />, label: "Transplant Diagnostics" },
  { icon: <Microscope className="h-5 w-5" />, label: "Molecular Biology" },
  { icon: <FlaskConical className="h-5 w-5" />, label: "Immunology" },
  { icon: <FlaskConical className="h-5 w-5" />, label: "Cell Biology" },
  { icon: <FlaskConical className="h-5 w-5" />, label: "Pharmaceuticals" },
];

/* ─── Hero ────────────────────────────────────────────────────── */
function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-end overflow-hidden bg-foreground">
      {/* Parallax bg */}
      <motion.img
        src={img("/images/sc-diagnostics.png")}
        alt="Science Centre"
        style={{ y: imgY }}
        className="absolute inset-0 w-full h-[115%] object-cover opacity-30"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-transparent" />

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className="absolute top-0 bottom-0 w-px bg-white"
            style={{ left: `${(i + 1) * 12.5}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: i * 0.08, ease: "easeOut" }} />
        ))}
      </div>

      <motion.div style={{ y: textY }} className="relative z-10 container mx-auto px-6 md:px-12 pb-20 pt-40">
        {/* Eyebrow */}
        <motion.div className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="w-8 h-px bg-primary" />
          <span className="text-xs font-bold tracking-[0.25em] text-primary uppercase">Our Story</span>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1 className="text-6xl md:text-8xl lg:text-[9rem] font-[var(--app-font-heading)] font-black text-white leading-[0.9] tracking-tight"
            initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            About
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1 className="text-6xl md:text-8xl lg:text-[9rem] font-[var(--app-font-heading)] font-black leading-[0.9] tracking-tight"
            style={{ WebkitTextStroke: "2px white", color: "transparent" }}
            initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            Science Centre
          </motion.h1>
        </div>

        {/* Subtext + CTA */}
        <div className="flex flex-col md:flex-row md:items-end gap-8 max-w-5xl">
          <motion.p className="text-white/60 text-lg font-light leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}>
            Pakistan's most trusted partner in advanced laboratory solutions — connecting world-class science with the institutions that need it most, for over three decades.
          </motion.p>
          <motion.a href="#mission"
            className="flex-shrink-0 flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-primary border border-primary/40 px-6 py-4 hover:bg-primary/10 transition-all duration-300 group"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.9 }}>
            Explore Our Story
            <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
          </motion.a>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
        <motion.div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"
          animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} style={{ originY: 0 }} />
      </motion.div>
    </section>
  );
}

/* ─── Mission ─────────────────────────────────────────────────── */
function Mission() {
  return (
    <section id="mission" className="py-32 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 50%, hsl(var(--primary)/0.04), transparent 60%)" }} />

      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left: big statement */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center gap-3">
                <div className="w-5 h-px bg-primary" /> Our Mission
              </div>
              <h2 className="text-4xl md:text-5xl font-[var(--app-font-heading)] font-black text-foreground leading-tight tracking-tight mb-8">
                Bridging World-Class Science with Pakistan's Future.
              </h2>
              <div className="w-16 h-1 bg-primary mb-8" />
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                We exist at the intersection of global innovation and local need — ensuring Pakistan's laboratories, hospitals, and research institutes have access to the same precision instruments trusted by leading institutions worldwide.
              </p>
            </Reveal>
          </div>

          {/* Right: focus area tags + description */}
          <div className="lg:col-span-7 lg:pl-12">
            <Reveal delay={0.15}>
              <div className="flex flex-wrap gap-2 mb-10">
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
            </Reveal>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <Reveal key={i} delay={0.1 * i}>
                  <motion.div className="border border-border p-6 relative overflow-hidden group"
                    whileHover={{ borderColor: "hsl(var(--primary)/0.5)", y: -4 }}
                    transition={{ duration: 0.25 }}>
                    <div className="text-4xl md:text-5xl font-[var(--app-font-heading)] font-black text-foreground mb-2">
                      <CountUp to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-sm font-bold text-foreground mb-1">{s.label}</div>
                    <div className="text-xs text-muted-foreground font-light">{s.sub}</div>
                    <motion.div className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }} whileHover={{ width: "100%" }}
                      transition={{ duration: 0.4 }} />
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CEO Message ─────────────────────────────────────────────── */
function CEOMessage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const paragraphs = [
    "At Science Centre, we are committed to advancing Pakistan's healthcare and life sciences landscape by partnering with globally recognized leaders in Life Sciences, Transplant Diagnostics, Molecular Biology, and Immunology.",
    "Our mission is to introduce cutting-edge technologies and international best practices that empower laboratories, clinicians, and researchers to deliver accurate, timely, and impactful outcomes.",
    "Over the years, our dedicated team has played a pivotal role in strengthening key segments of the life sciences industry, contributing to improved diagnostics, innovation, and capacity building across the country.",
    "As we move forward, we remain focused on fostering strong collaborations, driving innovation, and creating sustainable growth opportunities for our partners and stakeholders.",
    "Together, we aim to shape a future where advanced healthcare solutions are accessible, reliable, and transformative for Pakistan.",
  ];

  return (
    <section className="py-32 bg-foreground text-background relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

      <div className="container mx-auto px-6 md:px-12" ref={ref}>
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left: CEO photo placeholder + info */}
          <div className="lg:col-span-4">
            <Reveal>
              {/* Photo placeholder */}
              <div className="relative mb-8">
                <div className="aspect-[3/4] w-full max-w-xs bg-white/5 border border-white/10 relative overflow-hidden">
                  {/* Placeholder for CEO photo */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                    <Users className="h-16 w-16 mb-3" />
                    <span className="text-xs tracking-widest uppercase font-medium">CEO Photo</span>
                    <span className="text-xs text-white/30 mt-1">Coming Soon</span>
                  </div>
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
                </div>
                {/* Decorative offset box */}
                <div className="absolute -bottom-4 -right-4 w-full max-w-xs aspect-[3/4] border border-primary/20 -z-10" />
              </div>

              {/* Name + title */}
              <div className="border-l-2 border-primary pl-5">
                <h3 className="text-2xl font-[var(--app-font-heading)] font-black text-white mb-1">Najam Iqbal</h3>
                <p className="text-primary text-sm font-bold tracking-wide uppercase">Chief Executive Officer</p>
                <p className="text-white/40 text-xs mt-2 font-light">Science Centre Pakistan</p>
              </div>
            </Reveal>
          </div>

          {/* Right: Message */}
          <div className="lg:col-span-8">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <Quote className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase">CEO's Message</div>
                  <div className="text-white/40 text-xs font-light mt-0.5">A word from our leadership</div>
                </div>
              </div>
            </Reveal>

            <div className="space-y-6">
              {paragraphs.map((para, i) => (
                <motion.p key={i}
                  className={`font-light leading-relaxed ${i === 0 ? "text-xl text-white" : "text-base text-white/70"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}>
                  {i === 0 && <span className="text-primary font-semibold">❝ </span>}
                  {para}
                  {i === paragraphs.length - 1 && <span className="text-primary font-semibold"> ❞</span>}
                </motion.p>
              ))}
            </div>

            {/* Signature */}
            <motion.div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-6"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}>
              <div>
                <div className="font-[var(--app-font-heading)] font-black text-white text-lg">Najam Iqbal</div>
                <div className="text-primary text-xs font-bold tracking-wider uppercase mt-0.5">CEO, Science Centre</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-white/30 text-xs font-light leading-relaxed">
                Serving Pakistan's scientific community<br />since 1985
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Timeline ────────────────────────────────────────────────── */
function Timeline() {
  const [active, setActive] = useState(timeline.length - 1);

  return (
    <section className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center gap-3">
            <div className="w-5 h-px bg-primary" /> Our Journey
          </div>
          <h2 className="text-4xl md:text-6xl font-[var(--app-font-heading)] font-black text-foreground tracking-tight mb-16">
            39 Years of<br />Scientific Excellence.
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: vertical timeline */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-0 bottom-0 w-px bg-border" />

              <div className="space-y-2">
                {timeline.map((item, i) => (
                  <motion.button key={i}
                    onClick={() => setActive(i)}
                    className="flex items-start gap-5 w-full text-left group"
                    whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    {/* Dot */}
                    <div className="relative flex-shrink-0 mt-4">
                      <motion.div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black z-10 relative transition-all duration-300"
                        animate={{
                          borderColor: i === active ? "hsl(var(--primary))" : "hsl(var(--border))",
                          backgroundColor: i === active ? "hsl(var(--primary))" : "hsl(var(--background))",
                          color: i === active ? "white" : "hsl(var(--muted-foreground))",
                        }}>
                        {i === timeline.length - 1 ? "★" : item.year.slice(2)}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className={`py-3 flex-1 border-b border-border transition-all duration-300 ${i === active ? "border-primary/30" : ""}`}>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold tracking-widest text-muted-foreground">{item.year}</span>
                        {i === timeline.length - 1 && (
                          <span className="text-[10px] bg-primary text-white px-2 py-0.5 font-bold tracking-wide uppercase">Present</span>
                        )}
                      </div>
                      <div className={`font-[var(--app-font-heading)] font-bold text-base transition-colors duration-300 ${i === active ? "text-primary" : "text-foreground"}`}>
                        {item.title}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-7">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div key={active}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border border-border p-10 relative overflow-hidden">

                  {/* Big year watermark */}
                  <div className="absolute right-6 top-6 text-8xl font-black text-foreground/[0.04] font-[var(--app-font-heading)] select-none pointer-events-none leading-none">
                    {timeline[active].year}
                  </div>

                  <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">{timeline[active].year}</div>
                  <h3 className="text-3xl md:text-4xl font-[var(--app-font-heading)] font-black text-foreground mb-6 leading-tight">
                    {timeline[active].title}
                  </h3>
                  <p className="text-muted-foreground text-lg font-light leading-relaxed mb-8">
                    {timeline[active].desc}
                  </p>

                  {/* Nav arrows */}
                  <div className="flex gap-3">
                    <button onClick={() => setActive(Math.max(0, active - 1))}
                      disabled={active === 0}
                      className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-30 transition-all duration-200 font-bold text-sm">
                      ←
                    </button>
                    <button onClick={() => setActive(Math.min(timeline.length - 1, active + 1))}
                      disabled={active === timeline.length - 1}
                      className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-30 transition-all duration-200 font-bold text-sm">
                      →
                    </button>
                    <div className="ml-auto text-xs text-muted-foreground self-center font-medium">
                      {String(active + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Values ──────────────────────────────────────────────────── */
function Values() {
  return (
    <section className="py-32 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-6 md:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center gap-3">
                <div className="w-5 h-px bg-primary" /> What Drives Us
              </div>
              <h2 className="text-4xl md:text-5xl font-[var(--app-font-heading)] font-black text-foreground tracking-tight leading-tight">
                Our Core Values
              </h2>
            </div>
            <p className="text-muted-foreground text-base font-light max-w-sm md:text-right leading-relaxed">
              The principles that guide every partnership, every product choice, and every conversation with our clients.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <motion.div className="p-8 bg-background border border-border relative overflow-hidden group cursor-default h-full flex flex-col"
                whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ color: v.accent, background: v.accent + "15", border: `1px solid ${v.accent}30` }}>
                  {v.icon}
                </div>

                <h4 className="font-[var(--app-font-heading)] font-black text-xl text-foreground mb-3">{v.title}</h4>
                <p className="text-muted-foreground text-sm font-light leading-relaxed flex-1">{v.desc}</p>

                {/* Accent line */}
                <motion.div className="mt-6 h-0.5 rounded-full"
                  style={{ backgroundColor: v.accent }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }} />

                {/* Hover glow */}
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${v.accent}08, transparent 70%)` }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ──────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-32 bg-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(var(--primary)/0.12), transparent 70%)" }} />

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <Reveal>
          <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6">Work With Us</div>
          <h2 className="text-4xl md:text-6xl font-[var(--app-font-heading)] font-black text-white leading-tight tracking-tight mb-8 max-w-3xl mx-auto">
            Let's Shape Pakistan's Scientific Future Together.
          </h2>
          <p className="text-white/50 text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed">
            Whether you're a hospital, research institute, university, or laboratory — we're ready to understand your needs and bring the right solutions to your door.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#contact"
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 text-sm font-bold tracking-wide uppercase hover:bg-primary/90 transition-all duration-300 group">
              Get in Touch
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-sm font-bold tracking-wide uppercase hover:border-white/50 hover:bg-white/5 transition-all duration-300">
              Browse Products
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function About() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <SiteNavbar />
      <main>
        <AboutHero />
        <Mission />
        <CEOMessage />
        <Timeline />
        <Values />
        <CTABanner />
      </main>
      <SiteFooter />
    </div>
  );
}
