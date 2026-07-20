import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Beaker,
  CheckCircle2,
  Dna,
  Droplets,
  HeartPulse,
  Microscope,
  ShieldCheck,
  TestTube,
  Wrench,
} from "lucide-react";
import { PageSlideDeck } from "@/components/page-slide-deck";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function img(path: string) {
  return `${BASE}${path}`;
}

type SolutionArea = {
  title: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  image: string;
  metric: string;
  role: string;
  points: string[];
};

const solutionAreas: SolutionArea[] = [
  {
    title: "Life Sciences",
    label: "Research reagents, assays and instruments",
    icon: <Dna className="h-5 w-5" />,
    accent: "#2EA3F2",
    image: "/images/sc-lab-hero-optimized.webp",
    metric: "Research",
    role: "Discovery and validation support",
    points: ["Research reagents and kits", "Antibodies and assay support", "Laboratory systems for academic and industrial teams"],
  },
  {
    title: "Transplant Diagnostics",
    label: "HLA, antibody and post-transplant monitoring",
    icon: <HeartPulse className="h-5 w-5" />,
    accent: "#e85d4a",
    image: "/images/sc-diagnostics-optimized.webp",
    metric: "HLA",
    role: "Pre and post-transplant workflows",
    points: ["HLA antibody screening and identification", "Molecular typing and NGS workflows", "Crossmatch and donor-specific monitoring"],
  },
  {
    title: "Flow Cytometry Solutions",
    label: "Cell analysis and immune profiling",
    icon: <Activity className="h-5 w-5" />,
    accent: "#06b6d4",
    image: "/images/sc-diagnostics-optimized.webp",
    metric: "Cells",
    role: "Platforms, panels and analysis",
    points: ["Flow cytometry platforms", "Cell analysis workflow guidance", "Assay and panel support"],
  },
  {
    title: "Cell Culture Solutions",
    label: "Media, reagents and lab support",
    icon: <Microscope className="h-5 w-5" />,
    accent: "#10b981",
    image: "/images/sc-lab-hero-optimized.webp",
    metric: "Culture",
    role: "Routine cell workflow continuity",
    points: ["Cell culture media and supplements", "Culture plastics and consumables", "Repeatable cellular workflow support"],
  },
  {
    title: "Water Purification Systems",
    label: "Type 1, Type 2, RO and analyzer feed",
    icon: <Droplets className="h-5 w-5" />,
    accent: "#2563eb",
    image: "/images/sc-instruments-optimized.webp",
    metric: "Type 1/2",
    role: "Pure water system selection",
    points: ["System selection by daily water demand", "Clinical laboratory reagent water support", "Consumables planning and service coordination"],
  },
  {
    title: "NGS Solutions",
    label: "Sequencing panels and workflows",
    icon: <Dna className="h-5 w-5" />,
    accent: "#7c3aed",
    image: "/images/ol-alltype-ngs.jpeg",
    metric: "NGS",
    role: "Panels, prep and adoption",
    points: ["NGS kits and panels", "Library preparation and analysis tools", "Clinical and research adoption support"],
  },
  {
    title: "Allergen Solutions",
    label: "Allergy screening and panels",
    icon: <Activity className="h-5 w-5" />,
    accent: "#f59e0b",
    image: "/images/sugentech/sug-sgti-allergy-screen-plus.png",
    metric: "Allergy",
    role: "Screening panel coordination",
    points: ["Allergen testing workflows", "Screening panels and supporting reagents", "Immunology lab coordination"],
  },
  {
    title: "Biochemistry Instruments",
    label: "Routine analytical instruments",
    icon: <Beaker className="h-5 w-5" />,
    accent: "#0f766e",
    image: "/images/featured/rex-ph510t.webp",
    metric: "Routine",
    role: "Daily measurement systems",
    points: ["Biochemistry analyzers and instruments", "Routine measurement systems", "Daily testing workflow support"],
  },
  {
    title: "Filtration Solutions",
    label: "Membranes, filters and manifolds",
    icon: <TestTube className="h-5 w-5" />,
    accent: "#0891b2",
    image: "/images/hkm/hkm-multi-branch-manifold-membrane-filtration-system.jpg",
    metric: "Prep",
    role: "Sample and water filtration",
    points: ["Membrane filtration products", "Water and microbiology testing support", "Sample preparation and manifold systems"],
  },
  {
    title: "Flow Antibody Solutions",
    label: "Antibodies and panel design",
    icon: <TestTube className="h-5 w-5" />,
    accent: "#c026d3",
    image: "/images/biolegend/biolegend-antibodies.svg",
    metric: "Panels",
    role: "Flow antibody matching",
    points: ["Flow antibodies and reagents", "Panel design support", "Cell analysis and immune monitoring workflows"],
  },
  {
    title: "General Lab Consumables",
    label: "Everyday lab essentials",
    icon: <Wrench className="h-5 w-5" />,
    accent: "#64748b",
    image: "/images/hkm/hkm-disposable-pipette.jpg",
    metric: "Supply",
    role: "Everyday lab continuity",
    points: ["Plasticware, glassware and pipettes", "Swabs, test papers and routine supplies", "Consumables planning for lab continuity"],
  },
];

const groupedSlides = [
  {
    eyebrow: "Research and clinical core",
    title: "Research, transplant and flow workflows.",
    summary: "Focused support for high-value clinical and research labs where product choice depends on workflow, sample type and reporting needs.",
    areas: solutionAreas.slice(0, 3),
  },
  {
    eyebrow: "Controlled lab systems",
    title: "Culture, water and sequencing infrastructure.",
    summary: "Core systems are matched around daily use, capacity, purity, repeatability and the consumables needed after installation.",
    areas: solutionAreas.slice(3, 6),
  },
  {
    eyebrow: "Diagnostics and analytical testing",
    title: "Allergy, biochemistry and filtration support.",
    summary: "Routine testing areas are organised around panels, instruments, sample preparation and daily throughput.",
    areas: solutionAreas.slice(6, 9),
  },
  {
    eyebrow: "Daily lab continuity",
    title: "Antibodies and consumables without the clutter.",
    summary: "Everyday supply lines stay useful when they are easy to reorder, compatible with the workflow and backed by clear guidance.",
    areas: solutionAreas.slice(9),
  },
];

function SlideShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("relative h-[100dvh] overflow-hidden pt-24", className)}>
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      {children}
    </section>
  );
}

function SolutionMiniCard({ area, index, tone = "light" }: { area: SolutionArea; index: number; tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <Link
      href={`/products?q=${encodeURIComponent(area.title)}`}
      className={cn(
        "group relative flex h-full min-h-0 overflow-hidden border shadow-sm transition-transform duration-300 hover:-translate-y-1",
        dark ? "border-white/12 bg-white/[0.055] text-white" : "border-border bg-background"
      )}
    >
      <div className="relative hidden w-[34%] overflow-hidden md:block">
        <img src={img(area.image)} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent, ${area.accent}cc)` }} />
      </div>
      <div className={cn("relative z-10 flex h-full min-w-0 flex-1 flex-col p-5", dark && "bg-gradient-to-br from-white/[0.03] to-transparent")}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className={cn("flex h-10 w-10 items-center justify-center border", dark ? "bg-black/20" : "bg-background shadow-sm")} style={{ color: area.accent, borderColor: `${area.accent}55` }}>
            {area.icon}
          </span>
          <span className={cn("font-[var(--app-font-heading)] text-xs font-black tracking-[0.22em]", dark ? "text-white/32" : "text-muted-foreground")}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: area.accent }}>{area.label}</div>
        <h3 className={cn("mt-2 font-[var(--app-font-heading)] text-[clamp(1.45rem,2.2vw,2.2rem)] font-black leading-[0.98]", dark ? "text-white" : "text-foreground")}>
          {area.title}
        </h3>
        <p className={cn("mt-3 text-sm font-semibold leading-relaxed", dark ? "text-white/58" : "text-muted-foreground")}>{area.role}</p>
        <ul className={cn("mt-4 grid gap-2.5 text-sm leading-snug", dark ? "text-white/62" : "text-muted-foreground")}>
          {area.points.slice(0, 2).map(point => (
            <li key={point} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: area.accent }} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-black uppercase tracking-[0.16em] opacity-70 transition-opacity group-hover:opacity-100" style={{ color: area.accent }}>
          View catalogue <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function SolutionBoardSlide({ group, groupIndex }: { group: typeof groupedSlides[number]; groupIndex: number }) {
  const spotlight = group.areas[0];
  const dark = groupIndex % 2 === 1;
  const hasCta = group.areas.length === 2;

  return (
    <SlideShell className={dark ? "bg-[#07111f] text-white" : "bg-background text-foreground"}>
      <div className="container relative z-10 mx-auto grid h-[calc(100dvh-6rem)] min-h-0 gap-6 px-6 py-8 md:px-12 lg:grid-cols-[0.82fr_1.18fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className={cn(
            "relative flex min-h-0 flex-col justify-end overflow-hidden border p-7",
            dark ? "border-white/12 bg-white/[0.055]" : "border-border bg-muted/20"
          )}
        >
          <img src={img(spotlight.image)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.24]" loading="lazy" />
          <div className={cn("absolute inset-0", dark ? "bg-gradient-to-b from-[#07111f]/42 via-[#07111f]/72 to-[#07111f]" : "bg-gradient-to-b from-background/30 via-background/80 to-background")} />
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: spotlight.accent }}>
              <ShieldCheck className="h-4 w-4" /> {group.eyebrow}
            </div>
            <h2 className="max-w-xl font-[var(--app-font-heading)] text-[clamp(2.6rem,4.8vw,5.5rem)] font-black leading-[0.9]">
              {group.title}
            </h2>
            <p className={cn("mt-5 max-w-lg text-sm leading-relaxed md:text-base", dark ? "text-white/64" : "text-muted-foreground")}>
              {group.summary}
            </p>
          </div>
        </motion.div>

        <div className={cn("grid min-h-0 gap-4", group.areas.length === 3 ? "grid-rows-3" : "grid-rows-3")}>
          {group.areas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.07 }}
              className="min-h-0"
            >
              <SolutionMiniCard area={area} index={groupIndex * 3 + index} tone={dark ? "dark" : "light"} />
            </motion.div>
          ))}
          {hasCta && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className={cn("flex min-h-0 items-center justify-between gap-6 border p-6", dark ? "border-white/12 bg-white/[0.055]" : "border-border bg-muted/25")}
            >
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-primary">Need guidance?</div>
                <h3 className="mt-3 font-[var(--app-font-heading)] text-2xl font-black leading-tight">Send the lab goal, test menu or catalogue number.</h3>
                <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-white/58" : "text-muted-foreground")}>We will route it to the right product family without overwhelming the team.</p>
              </div>
              <Link href="/contact" className="shrink-0 border border-primary bg-primary px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-primary-foreground">
                Start <ArrowRight className="ml-2 inline h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </SlideShell>
  );
}

export default function SolutionsPage() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground">
      <SiteNavbar forceSolid />
      <PageSlideDeck names={["Overview", "Research", "Systems", "Diagnostics", "Supply", "Contact"]} accent="#2EA3F2">
        <SlideShell className="bg-[#07111f] text-white">
          <img src={img("/images/sc-lab-hero-optimized.webp")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,17,31,0.96),rgba(7,17,31,0.78)_48%,rgba(7,17,31,0.42))]" />
          <div className="container relative z-10 mx-auto grid h-[calc(100dvh-6rem)] min-h-0 gap-8 px-6 py-8 md:px-12 lg:grid-cols-[1.05fr_0.72fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="mb-5 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Solution design for modern labs
              </div>
              <h1 className="max-w-5xl font-[var(--app-font-heading)] text-[clamp(3.1rem,6vw,6.5rem)] font-black leading-[0.9] text-white">
                Practical solution lanes for Pakistan's laboratories.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
                Science Centre helps hospitals, research institutes, diagnostic labs and industry teams source the right instruments, kits, reagents and consumables from trusted scientific brands.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                  Discuss a Requirement <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/products" className="inline-flex items-center border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-foreground">
                  Browse Products
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.65 }}
              className="min-h-0"
            >
              <div className="border border-white/14 bg-white/[0.07] p-7 backdrop-blur-md">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-primary">Coverage model</div>
                <div className="mt-8 grid grid-cols-[auto_1fr] gap-5 border-b border-white/12 pb-7">
                  <div className="font-[var(--app-font-heading)] text-7xl font-black leading-none text-white">11</div>
                  <div>
                    <h2 className="font-[var(--app-font-heading)] text-3xl font-black leading-tight text-white">solution lanes, grouped for easier decisions.</h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/58">Each following slide focuses on a smaller set of workflows so the page is easier to read and easier to act on.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {[
                    "Start from the test menu, sample volume or application.",
                    "Match the right brand portfolio without overloading the page.",
                    "Plan instruments, kits, reagents and repeat consumables together.",
                  ].map(item => (
                    <div key={item} className="flex gap-3 text-sm leading-relaxed text-white/68">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </SlideShell>

        {groupedSlides.map((group, index) => (
          <SolutionBoardSlide key={group.eyebrow} group={group} groupIndex={index} />
        ))}

        <section className="h-[100dvh] overflow-hidden bg-background">
          <SiteFooter variant="slide" />
        </section>
      </PageSlideDeck>
    </div>
  );
}
