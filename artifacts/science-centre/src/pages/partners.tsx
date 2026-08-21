import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Globe2,
  Handshake,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { PageSlideDeck } from "@/components/page-slide-deck";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { brands, productsByBrand } from "@/lib/catalogue";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function asset(path?: string) {
  if (!path) return "";
  return path.startsWith("/") ? `${BASE}${path}` : path;
}

const partnerActions = [
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Global portfolios",
    body: "Specialist scientific brands made easier to compare for Pakistani hospitals, labs, universities and industry teams.",
  },
  {
    icon: <Route className="h-5 w-5" />,
    title: "Workflow routing",
    body: "A product request is mapped to the right instrument, reagent, kit, consumable or source catalogue family.",
  },
  {
    icon: <Boxes className="h-5 w-5" />,
    title: "Catalogue clarity",
    body: "Customers can move from a brand name to relevant product areas without digging through hundreds of variants.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Local coordination",
    body: "Quotations, documentation, delivery planning and after-sales conversations stay aligned locally.",
  },
];

const brandLanes = [
  ["Diagnostics", ["One Lambda", "Luminex", "Sugentech", "Ngenebio"]],
  ["Water and lab systems", ["Merck", "REX", "HKM"]],
  ["Cell analysis", ["Cytek", "BioLegend"]],
];

function LogoImage({ logo, name, className }: { logo?: string; name: string; className?: string }) {
  return <img src={asset(logo)} alt={name} className={cn("max-h-14 max-w-[170px] object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.25)]", className)} loading="lazy" />;
}

function SlideShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("relative h-[100dvh] overflow-hidden pt-24", className)}>
      <div className="absolute inset-0 opacity-[0.055]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      {children}
    </section>
  );
}

export default function PartnersPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeBrands = brands;
  const totalEntries = activeBrands.reduce((sum, brand) => sum + productsByBrand(brand.id).length, 0);
  const navTone = currentSlide === 0 || currentSlide === 3 ? "dark" : "light";

  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground">
      <SiteNavbar forceSolid tone={navTone} />
      <PageSlideDeck names={["Network", "Role", "Ecosystem", "Contact"]} accent="#2EA3F2" onCurrentChange={setCurrentSlide}>
        <SlideShell className="bg-[#07111f] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(46,163,242,0.18),transparent_34%),linear-gradient(115deg,#07111f_0%,#0b1727_52%,#07111f_100%)]" />
          <div className="container relative z-10 mx-auto grid h-[calc(100dvh-6rem)] min-h-0 gap-8 px-6 py-8 md:px-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="mb-5 inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white/70">
                <Handshake className="h-3.5 w-3.5 text-primary" /> Scientific sourcing network
              </div>
              <h1 className="max-w-4xl font-[var(--app-font-heading)] text-[clamp(3.2rem,6vw,6.8rem)] font-black leading-[0.9]">
                Specialist science brands, under one local conversation.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/64 md:text-lg">
                Science Centre connects Pakistan's laboratories with trusted international product families across diagnostics, life sciences, microbiology, water systems and routine lab workflows.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="inline-flex items-center bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                  Explore Brand Catalogue <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-foreground">
                  Partner With Us
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="relative flex min-h-[520px] items-center justify-center"
            >
              <div className="absolute h-[78%] w-[78%] rounded-full border border-white/10" />
              <div className="absolute h-[54%] w-[54%] rounded-full border border-primary/25" />
              <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
              <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />

              {activeBrands.map((brand, index) => {
                const angle = (index / activeBrands.length) * Math.PI * 2 - Math.PI / 2;
                const radius = index % 2 === 0 ? 210 : 165;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <Link
                    key={brand.id}
                    href={`/products?brand=${brand.id}`}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-300 hover:scale-110"
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                    title={brand.name}
                  >
                    <LogoImage logo={brand.logo} name={brand.name} className="max-h-12 max-w-[145px] md:max-h-14 md:max-w-[160px]" />
                  </Link>
                );
              })}

              <div className="relative z-10 flex h-36 w-36 flex-col items-center justify-center rounded-full border border-primary/30 bg-[#07111f]/90 text-center shadow-[0_0_60px_rgba(46,163,242,0.22)]">
                <Sparkles className="mb-2 h-5 w-5 text-primary" />
                <div className="font-[var(--app-font-heading)] text-3xl font-black">{activeBrands.length}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-white/46">active brand portfolios</div>
              </div>
            </motion.div>
          </div>
        </SlideShell>

        <SlideShell className="bg-background text-foreground">
          <div className="container relative z-10 mx-auto grid h-[calc(100dvh-6rem)] min-h-0 gap-8 px-6 py-8 md:px-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-primary">Our role</div>
              <h2 className="max-w-3xl font-[var(--app-font-heading)] text-[clamp(2.8rem,5.4vw,6rem)] font-black leading-[0.9]">
                A bridge between global innovation and local lab work.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                The goal is not to show every variant on one page. It is to guide customers from a real lab need to the right brand family, catalogue area and next commercial conversation.
              </p>
            </motion.div>

            <div className="grid min-h-0 grid-rows-4 gap-4">
              {partnerActions.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.06 }}
                  className="grid min-h-0 grid-cols-[72px_1fr] items-center gap-5 border-b border-border py-4"
                >
                  <div className="flex h-14 w-14 items-center justify-center bg-primary/10 text-primary">{item.icon}</div>
                  <div>
                    <h3 className="font-[var(--app-font-heading)] text-2xl font-black leading-tight">{item.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SlideShell>

        <SlideShell className="bg-[#f5fbff] text-foreground">
          <div className="container relative z-10 mx-auto grid h-[calc(100dvh-6rem)] min-h-0 gap-8 px-6 py-8 md:px-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-primary">Brand ecosystem</div>
              <h2 className="max-w-3xl font-[var(--app-font-heading)] text-[clamp(2.8rem,5vw,5.7rem)] font-black leading-[0.9]">
                One enquiry can touch several specialist catalogues.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                Science Centre keeps the brand network visible without turning the page into a catalogue wall. Customers can start from the workflow, then move into the right product family.
              </p>
              <div className="mt-8 grid max-w-lg grid-cols-2 gap-5 border-t border-border pt-6">
                <div>
                  <div className="font-[var(--app-font-heading)] text-5xl font-black">{totalEntries}</div>
                  <div className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">catalogue entries</div>
                </div>
                <div>
                  <div className="font-[var(--app-font-heading)] text-5xl font-black">{activeBrands.length}</div>
                  <div className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">brand portfolios</div>
                </div>
              </div>
            </motion.div>

            <div className="grid min-h-0 gap-7">
              {brandLanes.map(([lane, names], laneIndex) => (
                <motion.div
                  key={lane}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + laneIndex * 0.08 }}
                  className="border-b border-border pb-6 last:border-b-0"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-10 bg-primary" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{lane}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-11 gap-y-7">
                    {names.map(name => {
                      const brand = activeBrands.find(item => item.short.toLowerCase() === name.toLowerCase() || item.name.toLowerCase().includes(name.toLowerCase()));
                      if (!brand) return null;
                      return (
                        <Link key={brand.id} href={`/products?brand=${brand.id}`} className="group inline-flex flex-col gap-2">
                          <LogoImage logo={brand.logo} name={brand.name} className="max-h-12 max-w-[155px] transition-transform duration-300 group-hover:scale-105" />
                          <span className="text-xs font-bold text-muted-foreground transition-colors group-hover:text-primary">
                            {productsByBrand(brand.id).length} entries
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SlideShell>

        <section className="h-[100dvh] overflow-hidden bg-background">
          <SiteFooter variant="slide" />
        </section>
      </PageSlideDeck>
    </div>
  );
}
