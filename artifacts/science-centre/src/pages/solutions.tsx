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
    eyebrow: "Clinical and research core",
    title: "From discovery work to transplant and cell analysis.",
    summary: "The first layer connects high-value diagnostic and research workflows with the instruments, kits, reagents and panel support needed to run them reliably.",
    areas: solutionAreas.slice(0, 4),
  },
  {
    eyebrow: "Systems and molecular infrastructure",
    title: "The systems layer that keeps specialist labs moving.",
    summary: "Water, NGS, allergy and routine biochemistry needs are treated as complete workflows, not isolated catalogue picks.",
    areas: solutionAreas.slice(4, 8),
  },
  {
    eyebrow: "Consumables and continuity",
    title: "The supplies that protect daily lab throughput.",
    summary: "Filtration, antibodies and general consumables are planned around reordering, compatibility and practical lab continuity.",
    areas: solutionAreas.slice(8),
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

function SolutionMiniCard({ area, index, compact = false }: { area: SolutionArea; index: number; compact?: boolean }) {
  return (
    <Link
      href={`/products?q=${encodeURIComponent(area.title)}`}
      className={cn(
        "group relative flex min-h-0 overflow-hidden border border-border bg-background shadow-sm transition-transform duration-300 hover:-translate-y-1",
        compact ? "h-full" : "h-full"
      )}
    >
      <img src={img(area.image)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.14] transition-transform duration-700 group-hover:scale-105" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/94 to-background/76" />
      <div className="relative z-10 flex h-full w-full flex-col p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="flex h-10 w-10 items-center justify-center border bg-background shadow-sm" style={{ color: area.accent, borderColor: `${area.accent}55` }}>
            {area.icon}
          </span>
          <span className="font-[var(--app-font-heading)] text-xs font-black tracking-[0.22em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: area.accent }}>{area.label}</div>
        <h3 className="mt-2 font-[var(--app-font-heading)] text-[clamp(1.35rem,2.1vw,2rem)] font-black leading-[0.98] text-foreground">
          {area.title}
        </h3>
        <div className="mt-3 grid grid-cols-[auto_1fr] gap-3 border-y border-border/80 py-2.5">
          <div className="font-[var(--app-font-heading)] text-lg font-black" style={{ color: area.accent }}>{area.metric}</div>
          <div className="text-xs font-semibold leading-snug text-muted-foreground">{area.role}</div>
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-snug text-muted-foreground">
          {area.points.map(point => (
            <li key={point} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: area.accent }} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <span className="mt-auto inline-flex items-center gap-2 pt-3 text-xs font-black uppercase tracking-[0.18em] opacity-70 transition-opacity group-hover:opacity-100" style={{ color: area.accent }}>
          Browse relevant catalogue <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function SolutionBoardSlide({ group, groupIndex }: { group: typeof groupedSlides[number]; groupIndex: number }) {
  const spotlight = group.areas[0];
  const isContinuity = group.areas.length === 3;

  return (
    <SlideShell className={groupIndex % 2 === 0 ? "bg-background text-foreground" : "bg-[#07111f] text-white"}>
      <div className="container relative z-10 mx-auto grid h-[calc(100dvh-6rem)] min-h-0 gap-5 px-6 py-6 md:px-12 lg:grid-cols-[0.62fr_1.38fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className={cn(
            "relative flex min-h-0 flex-col overflow-hidden border p-6",
            groupIndex % 2 === 0 ? "border-border bg-muted/25" : "border-white/12 bg-white/[0.055]"
          )}
        >
          <img src={img(spotlight.image)} alt="" className="absolute inset-x-0 bottom-0 h-1/2 w-full object-cover opacity-[0.18]" loading="lazy" />
          <div className={cn("absolute inset-0 bg-gradient-to-b from-transparent via-transparent", groupIndex % 2 === 0 ? "to-background/70" : "to-[#07111f]/80")} />
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]" style={{ color: spotlight.accent }}>
              <ShieldCheck className="h-4 w-4" /> {group.eyebrow}
            </div>
            <h2 className="font-[var(--app-font-heading)] text-[clamp(2.25rem,4.3vw,5rem)] font-black leading-[0.92]">
              {group.title}
            </h2>
            <p className={cn("mt-5 max-w-xl text-sm leading-relaxed md:text-base", groupIndex % 2 === 0 ? "text-muted-foreground" : "text-white/64")}>
              {group.summary}
            </p>
          </div>
          <div className="relative z-10 mt-auto grid grid-cols-2 gap-3">
            {group.areas.map(area => (
              <div key={area.title} className={cn("border px-3 py-3", groupIndex % 2 === 0 ? "border-border bg-background/80" : "border-white/12 bg-black/[0.18]")}>
                <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: area.accent }}>{area.metric}</div>
                <div className="mt-1 text-sm font-bold leading-tight">{area.title}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className={cn("grid min-h-0 gap-4", isContinuity ? "lg:grid-cols-[1fr_1fr_0.9fr]" : "md:grid-cols-2")}>
          {group.areas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.07 }}
              className="min-h-0"
            >
              <SolutionMiniCard area={area} index={groupIndex * 4 + index} compact={isContinuity} />
            </motion.div>
          ))}
          {isContinuity && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="flex min-h-0 flex-col justify-between border border-primary/35 bg-primary p-5 text-primary-foreground"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] opacity-75">Next step</div>
                <h3 className="mt-4 font-[var(--app-font-heading)] text-3xl font-black leading-none">
                  Send the lab goal. We will shape the shortlist.
                </h3>
                <p className="mt-4 text-sm leading-relaxed opacity-80">
                  Share a test menu, sample volume, brand preference or catalogue number and Science Centre will route it to the right workflow family.
                </p>
              </div>
              <Link href="/contact" className="mt-6 inline-flex items-center justify-between border border-white/30 bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-foreground">
                Start a conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </SlideShell>
  );
}

export default function SolutionsPage() {
  const allLabels = solutionAreas.map(area => area.title);

  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground">
      <SiteNavbar forceSolid />
      <PageSlideDeck names={["Overview", "Clinical Core", "Systems", "Continuity", "Contact"]} accent="#2EA3F2">
        <SlideShell className="bg-[#07111f] text-white">
          <img src={img("/images/sc-lab-hero-optimized.webp")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,17,31,0.96),rgba(7,17,31,0.78)_48%,rgba(7,17,31,0.42))]" />
          <div className="container relative z-10 mx-auto grid h-[calc(100dvh-6rem)] min-h-0 gap-6 px-6 py-6 md:px-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="mb-5 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Solution design for modern labs
              </div>
              <h1 className="max-w-5xl font-[var(--app-font-heading)] text-[clamp(3.1rem,6.5vw,7.4rem)] font-black leading-[0.9] text-white">
                Practical solution lanes for Pakistan's laboratories.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
                Science Centre helps hospitals, research institutes, diagnostic labs and industry teams source the right instruments, kits, reagents and consumables from trusted scientific brands.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {allLabels.map(label => (
                  <Link key={label} href={`/products?q=${encodeURIComponent(label)}`} className="border border-white/16 bg-white/[0.08] px-3 py-2 text-xs font-bold text-white/72 transition-colors hover:border-primary hover:text-primary">
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.65 }}
              className="grid min-h-0 gap-4"
            >
              <div className="border border-white/14 bg-white/[0.07] p-5 backdrop-blur-md">
                <div className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-primary">Coverage model</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["11", "Solution areas"],
                    ["9", "Brand portfolios"],
                    ["500+", "Lab conversations"],
                  ].map(([value, label]) => (
                    <div key={label} className="border border-white/12 bg-black/[0.18] p-4">
                      <div className="font-[var(--app-font-heading)] text-3xl font-black text-white">{value}</div>
                      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/[0.48]">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {["Requirement routing", "Brand matching", "Consumable planning", "Technical coordination"].map((item, index) => (
                  <div key={item} className="border border-white/14 bg-white/[0.07] p-5 backdrop-blur-md">
                    <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
                    <div className="font-[var(--app-font-heading)] text-xl font-black text-white">{item}</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {index === 0 && "Start from the test menu, application, sample volume or desired outcome."}
                      {index === 1 && "Compare relevant product families across the active Science Centre catalogue."}
                      {index === 2 && "Keep reagents, filters, kits and everyday supplies aligned with usage."}
                      {index === 3 && "Coordinate quotation, guidance and handover with a practical local team."}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                  Discuss a Requirement <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/products" className="inline-flex items-center border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-foreground">
                  Browse Products
                </Link>
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
