import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
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
import { Button } from "@/components/ui/button";
import { PageSlideDeck } from "@/components/page-slide-deck";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function img(path: string) {
  return `${BASE}${path}`;
}

const solutionAreas = [
  {
    title: "Transplant diagnostics",
    label: "HLA, antibody and post-transplant monitoring",
    icon: <HeartPulse className="h-5 w-5" />,
    accent: "#e85d4a",
    image: "/images/sc-diagnostics.png",
    points: ["HLA antibody screening and identification", "Molecular typing and NGS workflows", "Crossmatch and donor-specific monitoring"],
  },
  {
    title: "Molecular and genomics labs",
    label: "PCR, NGS and sample-to-result workflows",
    icon: <Dna className="h-5 w-5" />,
    accent: "#7c3aed",
    image: "/images/sc-instruments.png",
    points: ["Clinical and research molecular panels", "Extraction, amplification and analysis tools", "Training for repeatable lab adoption"],
  },
  {
    title: "Flow cytometry and immunology",
    label: "High-parameter cell analysis",
    icon: <Activity className="h-5 w-5" />,
    accent: "#0891b2",
    image: "/images/sc-hero.png",
    points: ["Full-spectrum cytometry platforms", "Antibodies, panels and assay reagents", "Application support for complex workflows"],
  },
  {
    title: "Analytical chemistry",
    label: "Water, reagents, chromatography and QC",
    icon: <Beaker className="h-5 w-5" />,
    accent: "#0f766e",
    image: "/images/sc-diagnostics.png",
    points: ["Sigma-Aldrich and Merck sourcing support", "Reference materials and analytical reagents", "Routine QC and specialized testing needs"],
  },
  {
    title: "Water purification systems",
    label: "Type 1, Type 2, RO and clinical analyzer feed",
    icon: <Droplets className="h-5 w-5" />,
    accent: "#2563eb",
    image: "/images/sc-instruments.png",
    points: ["System selection by daily water demand", "Clinical laboratory reagent water support", "Consumables planning and service coordination"],
  },
  {
    title: "Lab operations and service",
    label: "Procurement, installation and after-sales care",
    icon: <Wrench className="h-5 w-5" />,
    accent: "#f59e0b",
    image: "/images/sc-hero.png",
    points: ["Product matching and quote preparation", "Delivery coordination across Pakistan", "Installation, training and continuity support"],
  },
];

const workflow = [
  ["01", "Understand the lab", "We map sample volume, regulatory needs, current instruments, budget and timeline before proposing a system."],
  ["02", "Shortlist the right mix", "Science Centre matches instruments, reagents, kits and consumables from suitable global brands."],
  ["03", "Deploy with confidence", "The team coordinates quotation, delivery, installation, training and service handover."],
  ["04", "Keep the workflow running", "Consumables, accessories and technical coordination stay aligned after the first purchase."],
];

export default function SolutionsPage() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground">
      <SiteNavbar forceSolid />
      <PageSlideDeck names={["Overview", "Focus Areas", "Process", "Next Step", "Contact"]} accent="#2EA3F2">
        <section className="relative min-h-[100dvh] overflow-hidden pt-28">
          <img src={img("/images/sc-hero.png")} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          <div className="container relative z-10 mx-auto grid min-h-[calc(100dvh-7rem)] items-center gap-10 px-6 pb-10 md:px-12 lg:grid-cols-[1fr_0.85fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="mb-5 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Solution design for modern labs
              </div>
              <h1 className="max-w-4xl font-[var(--app-font-heading)] text-5xl font-black leading-[0.98] text-white md:text-7xl">
                Build the lab workflow around the result you need.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                Science Centre helps hospitals, research institutes, diagnostic labs and industry teams source the right instruments, kits, reagents and support from trusted scientific brands.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-none">
                  <Link href="/contact">Discuss a Requirement <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-white/35 bg-white/5 text-white hover:bg-white hover:text-foreground">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </motion.div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Clinical diagnostics", "Research workflows", "Analytical QC", "Water systems"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.08 }}
                  className="border border-white/15 bg-white/10 p-5 backdrop-blur-md"
                >
                  <CheckCircle2 className="mb-4 h-5 w-5 text-primary" />
                  <div className="font-[var(--app-font-heading)] text-xl font-black text-white">{item}</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">Selection, sourcing and support aligned to local lab realities.</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="min-h-[100dvh] py-28">
          <div className="container mx-auto px-6 md:px-12">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">Focus areas</div>
                <h2 className="max-w-3xl font-[var(--app-font-heading)] text-4xl font-black md:text-5xl">Practical solution lanes for Pakistan's laboratories.</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Each area is treated as a complete workflow, not a single catalogue item.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {solutionAreas.map(area => (
                <Link key={area.title} href="/products" className="group block overflow-hidden border border-border bg-background">
                  <div className="relative h-44 overflow-hidden">
                    <img src={img(area.image)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent, ${area.accent}dd)` }} />
                    <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center bg-white text-foreground">{area.icon}</div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 text-xs font-bold" style={{ color: area.accent }}>{area.label}</div>
                    <h3 className="font-[var(--app-font-heading)] text-2xl font-black">{area.title}</h3>
                    <ul className="mt-5 space-y-3">
                      {area.points.map(point => (
                        <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: area.accent }} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="min-h-[100dvh] bg-muted/35 py-28">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr]">
              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">How we work</div>
                <h2 className="font-[var(--app-font-heading)] text-4xl font-black leading-tight md:text-5xl">From requirement to running workflow.</h2>
                <p className="mt-5 text-muted-foreground">
                  The strongest solution is the one your team can actually run, maintain and reorder.
                </p>
              </div>
              <div className="grid gap-4">
                {workflow.map(([num, title, body]) => (
                  <div key={num} className="grid gap-4 border border-border bg-background p-5 sm:grid-cols-[88px_1fr]">
                    <div className="font-[var(--app-font-heading)] text-3xl font-black text-primary">{num}</div>
                    <div>
                      <h3 className="font-[var(--app-font-heading)] text-xl font-black">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[100dvh] items-center py-24">
          <div className="container mx-auto px-6 md:px-12">
            <div className="border border-border bg-foreground p-8 text-background md:p-12">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">Need a recommendation?</div>
                  <h2 className="font-[var(--app-font-heading)] text-3xl font-black md:text-4xl">Send the test menu, sample volume or lab goal. We will shape the product shortlist.</h2>
                </div>
                <Button asChild size="lg" className="rounded-none bg-background text-foreground hover:bg-background/90">
                  <Link href="/contact">Start a Conversation <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="min-h-[100dvh] bg-background">
          <SiteFooter variant="slide" />
        </section>
      </PageSlideDeck>
    </div>
  );
}
