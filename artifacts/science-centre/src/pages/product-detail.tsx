import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ArrowLeft, CheckCircle2, ChevronRight,
  FlaskConical, Tag, FileText, Layers
} from "lucide-react";
import {
  productById, brandById, categoryById, productsByBrand,
  type Product
} from "@/lib/catalogue";

/* ─── Helpers ─────────────────────────────────────────────────── */
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}>
    {children}
  </motion.div>
);

/* ─── Related Product Card ─────────────────────────────────────── */
function RelatedCard({ product }: { product: Product }) {
  const brand = brandById(product.brand);
  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        className="border border-border p-6 cursor-pointer group relative overflow-hidden"
        whileHover={{ y: -4, borderColor: brand?.accent || "hsl(var(--primary))" }}
        transition={{ duration: 0.25 }}>
        <div className="text-xs font-bold tracking-wide uppercase mb-3 px-2 py-1 inline-block"
          style={{ color: brand?.accent, background: (brand?.accent || "#000") + "18" }}>
          {brand?.short}
        </div>
        <h4 className="font-[var(--app-font-heading)] font-bold text-foreground text-sm leading-snug mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h4>
        <p className="text-muted-foreground text-xs font-light leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center gap-1 mt-4 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          View Product <ArrowRight className="h-3 w-3" />
        </div>
        <motion.div className="absolute bottom-0 left-0 h-0.5"
          style={{ backgroundColor: brand?.accent }}
          initial={{ width: 0 }} whileHover={{ width: "100%" }}
          transition={{ duration: 0.35 }} />
      </motion.div>
    </Link>
  );
}

/* ─── Main ─────────────────────────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = productById(id);

  if (!product) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <SiteNavbar />
        <main className="container mx-auto px-6 md:px-12 py-40 text-center">
          <h1 className="text-4xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button variant="outline">← Back to Products</Button>
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const brand = brandById(product.brand);
  const category = categoryById(product.category);
  const related = (product.relatedProducts || [])
    .map(id => productById(id))
    .filter(Boolean) as Product[];

  // Fill with brand products if not enough related
  const moreBrand = productsByBrand(product.brand)
    .filter(p => p.id !== product.id && !product.relatedProducts?.includes(p.id))
    .slice(0, 3 - related.length);
  const allRelated = [...related, ...moreBrand].slice(0, 3);

  return (
    <div className="min-h-[100dvh] bg-background">
      <SiteNavbar />
      <main className="pt-28 pb-24">

        {/* ── Breadcrumb ── */}
        <div className="container mx-auto px-6 md:px-12 mb-8">
          <Reveal>
            <nav className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{product.name}</span>
            </nav>
          </Reveal>
        </div>

        {/* ── Hero ── */}
        <div className="container mx-auto px-6 md:px-12 mb-16">
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* Left: Info */}
            <div className="lg:col-span-7">

              {/* Brand + Category tags */}
              <Reveal>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm"
                    style={{ color: brand?.accent, background: (brand?.accent || "#000") + "18", border: `1px solid ${brand?.accent || "#000"}30` }}>
                    {brand?.name}
                  </span>
                  {category && (
                    <span className="text-xs font-medium tracking-wide text-muted-foreground border border-border px-3 py-1.5 flex items-center gap-1.5">
                      {category.icon} {category.name}
                    </span>
                  )}
                  {product.featured && (
                    <span className="text-xs font-bold tracking-wide text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5">
                      ★ Featured
                    </span>
                  )}
                </div>
              </Reveal>

              {/* Title */}
              <Reveal delay={0.05}>
                <h1 className="text-3xl md:text-5xl font-[var(--app-font-heading)] font-black text-foreground leading-tight tracking-tight mb-6">
                  {product.name}
                </h1>
              </Reveal>

              {/* Description */}
              <Reveal delay={0.1}>
                <p className="text-muted-foreground text-lg font-light leading-relaxed mb-8 max-w-2xl">
                  {product.description}
                </p>
              </Reveal>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <Reveal delay={0.15}>
                  <div className="space-y-3 mb-10">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* CTA buttons */}
              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg"
                    className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 group">
                    <a href="/#contact">
                      Request a Quote
                      <motion.span className="ml-2 inline-flex"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}>
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg"
                    className="rounded-none border-border px-8">
                    <a href="/#contact">Talk to a Specialist</a>
                  </Button>
                  <Button asChild variant="ghost" size="lg"
                    className="rounded-none px-8 text-muted-foreground">
                    <Link href="/products">
                      <ArrowLeft className="mr-2 h-4 w-4" /> All Products
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Right: Catalogue number + quick specs card */}
            <div className="lg:col-span-5">
              <Reveal delay={0.15}>
                <div className="border border-border p-8 sticky top-28">
                  {/* Brand accent bar */}
                  <div className="h-1 w-full mb-8 -mt-8 -mx-8 px-0"
                    style={{ backgroundColor: brand?.accent || "hsl(var(--primary))", width: "calc(100% + 4rem)" }} />

                  {product.catalogueNumber && (
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-0.5">Catalogue Number</div>
                        <div className="font-mono font-bold text-foreground">{product.catalogueNumber}</div>
                      </div>
                    </div>
                  )}

                  {/* Quick specs preview */}
                  {product.specs && (
                    <div className="space-y-3">
                      <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">Key Specifications</div>
                      {Object.entries(product.specs).slice(0, 5).map(([key, val]) => (
                        <div key={key} className="flex items-start justify-between gap-4 text-sm py-2 border-b border-border/50">
                          <span className="text-muted-foreground font-medium shrink-0">{key}</span>
                          <span className="text-foreground font-semibold text-right">{val}</span>
                        </div>
                      ))}
                      {Object.entries(product.specs).length > 5 && (
                        <p className="text-xs text-muted-foreground pt-2">
                          + {Object.entries(product.specs).length - 5} more specifications below
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-6 pt-6 border-t border-border">
                      {product.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-1 bg-muted text-muted-foreground uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ── Detail sections ── */}
        <div className="border-t border-border">
          <div className="container mx-auto px-6 md:px-12 py-16 grid lg:grid-cols-3 gap-16">

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Reveal>
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Layers className="h-5 w-5 text-primary" />
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Features</h2>
                  </div>
                  <ul className="space-y-3">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <span className="text-foreground leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {/* Applications */}
            {product.applications && product.applications.length > 0 && (
              <Reveal delay={0.1}>
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <FlaskConical className="h-5 w-5 text-primary" />
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Applications</h2>
                  </div>
                  <ul className="space-y-3">
                    {product.applications.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <span className="text-foreground leading-relaxed">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {/* Full Specs */}
            {product.specs && (
              <Reveal delay={0.15}>
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Specifications</h2>
                  </div>
                  <div className="space-y-0">
                    {Object.entries(product.specs).map(([key, val], i) => (
                      <div key={key} className={`flex items-start justify-between gap-4 text-sm py-3 ${i < Object.entries(product.specs!).length - 1 ? "border-b border-border/50" : ""}`}>
                        <span className="text-muted-foreground font-medium min-w-0">{key}</span>
                        <span className="text-foreground font-semibold text-right min-w-0">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="bg-foreground py-16 mt-8">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">Get in Touch</div>
              <h3 className="text-2xl md:text-3xl font-[var(--app-font-heading)] font-black text-white leading-tight">
                Interested in {product.name.split(" ").slice(0, 3).join(" ")}™?
              </h3>
              <p className="text-white/50 text-sm font-light mt-2 max-w-md">
                Our technical specialists are ready to discuss your requirements, arrange a demo, or provide a quotation.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button asChild size="lg"
                className="rounded-none bg-primary text-white hover:bg-primary/90 px-8 font-bold tracking-wide">
                <a href="/#contact">Request a Quote <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {allRelated.length > 0 && (
          <div className="container mx-auto px-6 md:px-12 pt-16">
            <Reveal>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <div className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2">You May Also Need</div>
                  <h3 className="text-2xl font-[var(--app-font-heading)] font-black text-foreground">Related Products</h3>
                </div>
                <Link href="/products">
                  <Button variant="outline" className="rounded-none text-sm">
                    Browse All <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {allRelated.map((p, i) => (
                <Reveal key={p.id} delay={0.05 * i}>
                  <RelatedCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
