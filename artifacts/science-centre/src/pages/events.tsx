import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import {
  eventIsUpcoming,
  formatEventDate,
  readEvents,
  sortEvents,
  type ScienceEvent,
} from "@/lib/events";

type ViewMode = "all" | "upcoming" | "past";

function titleFor(event: ScienceEvent) {
  return event.title?.trim() || "Science Centre Event";
}

function descriptionFor(event: ScienceEvent) {
  return event.summary?.trim() || event.details?.trim() || "Event details will be shared soon. Contact Science Centre for registration and availability.";
}

function fieldList(event: ScienceEvent) {
  return [
    event.date ? { icon: <CalendarDays className="h-4 w-4 text-[#1f9fd0]" />, value: formatEventDate(event) } : null,
    event.time ? { icon: <Clock className="h-4 w-4 text-[#4fbf93]" />, value: event.time } : null,
    event.city || event.venue ? { icon: <MapPin className="h-4 w-4 text-[#f0b64c]" />, value: [event.venue, event.city].filter(Boolean).join(", ") } : null,
  ].filter(Boolean) as { icon: React.ReactNode; value: string }[];
}

function EventCard({
  event,
  index,
}: {
  event: ScienceEvent;
  index: number;
}) {
  const upcoming = eventIsUpcoming(event);
  const meta = fieldList(event);
  const agenda = event.agenda || [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.28), ease: [0.16, 1, 0.3, 1] }}
      className="group overflow-hidden border border-border bg-background"
    >
      <div className="flex flex-col p-6 md:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <span className={`px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white ${upcoming ? "bg-[#1f9fd0]" : "bg-foreground/80"}`}>
            {upcoming ? "Upcoming" : "Past"}
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-1 border border-[#f0b64c]/30 bg-[#fff7e7] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
              <Sparkles className="h-3 w-3 text-[#f0b64c]" /> Featured
            </span>
          )}
          {event.type && (
            <span className="border border-border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">{event.type}</span>
          )}
        </div>

        <div className="mb-4">
          <h2 className="font-[var(--app-font-heading)] text-2xl font-black leading-tight text-foreground md:text-4xl">{titleFor(event)}</h2>
        </div>

        <p className="mb-5 max-w-4xl text-[15px] leading-relaxed text-muted-foreground">{descriptionFor(event)}</p>

        {meta.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-3 text-[13px] font-semibold text-muted-foreground">
            {meta.map((item) => (
              <span key={item.value} className="inline-flex items-center gap-1.5 border border-border px-3 py-2">
                {item.icon}{item.value}
              </span>
            ))}
          </div>
        )}

        {event.audience && (
          <div className="mb-5 border-l-2 border-[#1f9fd0] pl-4 text-sm font-semibold text-foreground">
            {event.audience}
          </div>
        )}

        {agenda.length > 0 && (
          <div className="mb-6 space-y-2">
            {agenda.slice(0, 3).map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4fbf93]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-none bg-foreground text-background hover:bg-foreground/90">
            <Link href={event.registrationUrl || "/#contact"}>
              Request invitation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<ScienceEvent[]>(() => sortEvents(readEvents()).filter((event) => event.status === "published"));
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ViewMode>("all");
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    const sync = () => setEvents(sortEvents(readEvents()).filter((event) => event.status === "published"));
    window.addEventListener("storage", sync);
    window.addEventListener("science-centre-events-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("science-centre-events-updated", sync);
    };
  }, []);

  const types = useMemo(() => ["all", ...Array.from(new Set(events.map((event) => event.type).filter(Boolean)))], [events]);
  const featured = events.find((event) => event.featured) || events[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((event) => {
      if (mode === "upcoming" && !eventIsUpcoming(event)) return false;
      if (mode === "past" && eventIsUpcoming(event)) return false;
      if (activeType !== "all" && event.type !== activeType) return false;
      if (!q) return true;
      return [event.title, event.summary, event.details, event.city, event.venue, event.audience, ...(event.speakers || [])].join(" ").toLowerCase().includes(q);
    });
  }, [activeType, events, mode, query]);

  return (
    <div className="h-[100dvh] overflow-hidden bg-background text-foreground">
      <SiteNavbar forceSolid />

      <main className="product-scroll-snap">
        <section className="product-slide-section relative overflow-hidden border-b border-border bg-[#f8fbfc]">
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#0b4a72 1px, transparent 1px), linear-gradient(90deg, #0b4a72 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="container relative mx-auto grid min-h-[100dvh] gap-10 px-6 pb-16 pt-32 md:px-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 border border-[#1f9fd0]/25 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#1f9fd0]">
                <CalendarDays className="h-4 w-4" /> Science Centre Events
              </div>
              <h1 className="font-[var(--app-font-heading)] text-5xl font-black leading-[0.95] tracking-normal text-foreground md:text-7xl">
                Events, demos, and training moments.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Explore upcoming workshops, demos, and technical sessions from Science Centre. Every listing adapts to the details available, from a simple announcement to a full programme.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-none bg-foreground text-background hover:bg-foreground/90">
                  <a href="#upcoming">View events <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-none">
                  <Link href="/admin/events">Admin access</Link>
                </Button>
              </div>
            </div>

            {featured && (
              <div className="relative overflow-hidden border border-border bg-foreground p-8 text-background lg:p-10">
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
                <div className="relative">
                  <div className="mb-10 inline-flex items-center gap-2 bg-background px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-[#f0b64c]" /> Featured event
                  </div>
                  <div className="mb-5 flex flex-wrap gap-3 text-sm font-semibold text-background/75">
                    {featured.date && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatEventDate(featured)}</span>}
                    {featured.city && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{featured.city}</span>}
                    {featured.time && <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{featured.time}</span>}
                  </div>
                  <h2 className="font-[var(--app-font-heading)] text-4xl font-black leading-tight md:text-5xl">{titleFor(featured)}</h2>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-background/75">{descriptionFor(featured)}</p>
                  <Button asChild className="mt-8 rounded-none bg-background text-foreground hover:bg-background/90">
                    <Link href={featured.registrationUrl || "/#contact"}>Request invitation <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="upcoming" className="product-slide-section bg-background">
          <div className="container mx-auto px-6 pb-12 pt-28 md:px-12">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">Programme</div>
              <h2 className="font-[var(--app-font-heading)] text-3xl font-black md:text-5xl">Upcoming and recent events</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-[260px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" className="h-11 rounded-none pl-10" />
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {(["all", "upcoming", "past"] as ViewMode[]).map((item) => (
              <button key={item} onClick={() => setMode(item)} className={`border px-4 py-2 text-sm font-bold capitalize transition-colors ${mode === item ? "border-foreground bg-foreground text-background" : "border-border bg-background hover:bg-muted"}`}>
                {item}
              </button>
            ))}
            <span className="mx-1 hidden h-10 w-px bg-border sm:block" />
            {types.map((type) => (
              <button key={type} onClick={() => setActiveType(type)} className={`border px-4 py-2 text-sm font-bold capitalize transition-colors ${activeType === type ? "border-[#1f9fd0] bg-[#1f9fd0] text-white" : "border-border bg-background hover:bg-muted"}`}>
                {type}
              </button>
            ))}
          </div>

          <div className="max-h-[calc(100dvh-330px)] space-y-6 overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="border border-border p-12 text-center">
                <h3 className="font-[var(--app-font-heading)] text-2xl font-bold">No events match this view</h3>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">Try a different filter or contact Science Centre for upcoming training dates.</p>
              </div>
            )}
          </div>
          </div>
        </section>

        <section className="product-slide-section flex min-h-[100dvh] items-center bg-background">
          <div className="container mx-auto px-6 py-28 md:px-12">
          <div className="grid gap-8 border border-border bg-foreground p-8 text-background md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-background/50">Host with Science Centre</div>
              <h2 className="font-[var(--app-font-heading)] text-3xl font-black">Need a technical session for your laboratory team?</h2>
              <p className="mt-3 max-w-2xl text-background/70">Request a workshop, demo day, product clinic, or training session tailored to your lab workflow.</p>
            </div>
            <Button asChild size="lg" className="rounded-none bg-background text-foreground hover:bg-background/90">
              <Link href="/#contact">Plan an event <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          </div>
        </section>

        <section className="product-slide-section">
          <SiteFooter />
        </section>
      </main>
    </div>
  );
}
