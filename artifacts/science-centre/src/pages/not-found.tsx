import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar forceSolid />
      <main className="flex min-h-[70vh] items-center pt-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary">
              Page not found
            </div>
            <h1 className="font-[var(--app-font-heading)] text-5xl font-black leading-tight text-foreground md:text-7xl">
              This page is outside the catalogue.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Browse the product catalogue or contact Science Centre and we will route you to the right product family.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex items-center bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                Browse Catalogue <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary">
                Contact Team
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
