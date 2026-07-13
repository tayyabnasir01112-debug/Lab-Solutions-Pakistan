import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Globe2,
  Handshake,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageSlideDeck } from "@/components/page-slide-deck";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { brands, productsByBrand } from "@/lib/catalogue";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
function asset(path?: string) {
  if (!path) return "";
  return path.startsWith("/") ? `${BASE}${path}` : path;
}

const capabilities = [
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Global portfolio access",
    body: "A carefully built catalogue spanning diagnostics, life sciences, analytical chemistry, microbiology, water purification and lab equipment.",
  },
  {
    icon: <Boxes className="h-5 w-5" />,
    title: "Product-to-workflow matching",
    body: "We help customers navigate product families, variants and consumables so the final selection fits the lab's actual use case.",
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Local procurement coordination",
    body: "Quotations, documentation, delivery planning and after-sales coordination are handled with a Pakistan-first operating rhythm.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Continuity after purchase",
    body: "Consumables, accessories, replacements and support conversations stay connected to the original workflow.",
  },
];

const textLogoBrands = new Set(["luminex", "diasorin", "sugentech"]);

function PartnerWordmark({ name, dark = false }: { name: string; dark?: boolean }) {
  return (
    <span className={`font-[var(--app-font-heading)] text-xl font-black tracking-tight ${dark ? "text-white" : "text-foreground"}`}>
      {name}
    </span>
  );
}

export default function PartnersPage() {
  const featured = brands.slice(0, 10);

  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground">
      <SiteNavbar forceSolid />
      <PageSlideDeck names={["Network", "Role", "Brands", "Scale", "Contact"]} accent="#2EA3F2">
        <section className="relative min-h-[100dvh] overflow-hidden bg-foreground pt-28 text-background">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="container relative mx-auto grid min-h-[calc(100dvh-7rem)] items-center gap-10 px-6 pb-10 md:px-12 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="mb-5 inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white/70">
                <Handshake className="h-3.5 w-3.5 text-primary" /> Scientific sourcing network
              </div>
              <h1 className="font-[var(--app-font-heading)] text-5xl font-black leading-[0.98] md:text-7xl">
                Partnerships that make advanced science accessible.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/62">
                Science Centre works with respected international brands and product families to support laboratories across Pakistan with instruments, reagents, kits, consumables and technical coordination.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-none">
                  <Link href="/products">Explore Brand Catalogue <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none border-white/25 bg-white/5 text-white hover:bg-white hover:text-foreground">
                  <Link href="/contact">Partner With Us</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.12 }} className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {featured.map((brand, index) => (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.id}`}
                  className="group relative flex min-h-32 flex-col justify-between border border-white/12 bg-white/[0.06] p-4 transition-all hover:-translate-y-1 hover:bg-white/[0.1]"
                >
                  <div className="flex h-12 items-center">
                    {brand.logo && !textLogoBrands.has(brand.id) ? (
                      <span className="flex h-12 min-w-36 items-center justify-center border border-white/10 bg-white px-3">
                        <img src={asset(brand.logo)} alt={brand.name} className="max-h-8 max-w-[120px] object-contain" />
                      </span>
                    ) : (
                      <PartnerWordmark name={brand.short} dark />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">{productsByBrand(brand.id).length} catalogue entries</div>
                    <div className="mt-1 text-sm font-bold text-white">{brand.short}</div>
                  </div>
                  <div className="absolute right-3 top-3 text-[10px] text-white/25">{String(index + 1).padStart(2, "0")}</div>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="min-h-[100dvh] py-28">
          <div className="container mx-auto px-6 md:px-12">
            <div className="mb-12 grid gap-6 md:grid-cols-[0.7fr_1fr] md:items-end">
              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">Our role</div>
                <h2 className="font-[var(--app-font-heading)] text-4xl font-black md:text-5xl">A bridge between global innovation and local laboratory work.</h2>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                We present product families transparently, provide source references where relevant, and guide customers to the right brand, configuration and consumable path for their requirement.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {capabilities.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.06 }}
                  className="border border-border bg-background p-6"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">{item.icon}</div>
                  <h3 className="font-[var(--app-font-heading)] text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="min-h-[100dvh] bg-muted/35 py-28">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr]">
              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">Brand ecosystem</div>
                <h2 className="font-[var(--app-font-heading)] text-4xl font-black leading-tight md:text-5xl">One partner conversation, many specialist catalogues.</h2>
                <p className="mt-5 text-muted-foreground">
                  From a single enquiry, Science Centre can help compare solutions across diagnostics, analytical chemistry, microbiology, water systems and research reagent portfolios.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {brands.map(brand => (
                  <Link key={brand.id} href={`/products?brand=${brand.id}`} className="group grid grid-cols-[86px_1fr_auto] items-center gap-4 border border-border bg-background p-4">
                    <div className="flex h-14 items-center justify-center border border-border bg-muted/30 p-2">
                      {brand.logo && !textLogoBrands.has(brand.id) ? <img src={asset(brand.logo)} alt={brand.name} className="max-h-9 max-w-full object-contain" /> : <PartnerWordmark name={brand.short} />}
                    </div>
                    <div>
                      <div className="font-[var(--app-font-heading)] font-black">{brand.name}</div>
                      <div className="text-xs text-muted-foreground">{productsByBrand(brand.id).length} entries in catalogue</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[100dvh] items-center py-24">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["30+", "Years of market presence", "Long-term familiarity with hospital, academic and industrial procurement needs."],
                ["10", "Global brand portfolios", "A broad scientific product mix organized for easy sourcing."],
                ["500+", "Client conversations supported", "From routine consumables to major instrument workflows."],
              ].map(([value, label, body]) => (
                <div key={label} className="border border-border p-7">
                  <BadgeCheck className="mb-5 h-6 w-6 text-primary" />
                  <div className="font-[var(--app-font-heading)] text-4xl font-black">{value}</div>
                  <div className="mt-2 font-bold">{label}</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="min-h-[100dvh] bg-background">
          <SiteFooter />
        </section>
      </PageSlideDeck>
    </div>
  );
}
