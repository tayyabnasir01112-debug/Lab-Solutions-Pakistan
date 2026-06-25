import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Grid3X3,
  Image as ImageIcon,
  MapPin,
  Play,
  Search,
  Sparkles,
  UserRound,
  X,
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
  type EventMedia,
  type ScienceEvent,
} from "@/lib/events";

type ViewMode = "all" | "upcoming" | "past";

function mediaCount(event: ScienceEvent) {
  return Math.max(event.media.length, event.coverImage ? 1 : 0);
}

function EventMediaThumb({
  media,
  onOpen,
}: {
  media: EventMedia;
  onOpen: (media: EventMedia) => void;
}) {
  return (
    <button
      onClick={() => onOpen(media)}
      className="group relative min-h-[220px] overflow-hidden bg-muted text-left"
      aria-label={`Open ${media.alt}`}
    >
      {media.type === "video" ? (
        <video src={media.src} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
      ) : (
        <img src={media.src} alt={media.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      {media.type === "video" && (
        <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center bg-white text-foreground">
          <Play className="h-4 w-4 fill-current" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="line-clamp-2 text-sm font-semibold text-white">{media.caption || media.alt}</p>
      </div>
    </button>
  );
}

function EventCard({
  event,
  index,
  onMediaOpen,
}: {
  event: ScienceEvent;
  index: number;
  onMediaOpen: (media: EventMedia) => void;
}) {
  const upcoming = eventIsUpcoming(event);
  const firstMedia = event.media[0] || {
    id: `${event.id}-cover`,
    type: "image" as const,
    src: event.coverImage,
    alt: event.title,
    caption: event.summary,
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.28), ease: [0.16, 1, 0.3, 1] }}
      className="group grid overflow-hidden border border-border bg-background lg:grid-cols-[minmax(280px,0.9fr)_1.1fr]"
    >
      <button onClick={() => onMediaOpen(firstMedia)} className="relative min-h-[280px] overflow-hidden bg-muted text-left">
        <img src={event.coverImage} alt={event.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={`px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white ${upcoming ? "bg-[#1f9fd0]" : "bg-foreground/80"}`}>
            {upcoming ? "Upcoming" : "Past"}
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-1 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-foreground">
              <Sparkles className="h-3 w-3" /> Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Grid3X3 className="h-4 w-4" />
            {mediaCount(event)} media item{mediaCount(event) === 1 ? "" : "s"}
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] opacity-80">View gallery</span>
        </div>
      </button>

      <div className="flex flex-col p-6 md:p-8">
        <div className="mb-5 flex flex-wrap gap-3 text-[12px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#1f9fd0]" />{formatEventDate(event)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#4fbf93]" />{event.time}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#f0b64c]" />{event.city}</span>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#1f9fd0]">{event.type}</div>
          <h2 className="font-[var(--app-font-heading)] text-2xl font-black leading-tight text-foreground md:text-3xl">{event.title}</h2>
        </div>

        <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">{event.summary}</p>

        <div className="mb-5 grid gap-3 text-sm md:grid-cols-2">
          <div className="border border-border p-3">
            <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Venue</div>
            <div className="font-semibold text-foreground">{event.venue}</div>
          </div>
          <div className="border border-border p-3">
            <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Audience</div>
            <div className="line-clamp-2 font-semibold text-foreground">{event.audience}</div>
          </div>
        </div>

        {event.agenda.length > 0 && (
          <div className="mb-6 space-y-2">
            {event.agenda.slice(0, 3).map((item) => (
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
          <Button variant="outline" className="rounded-none" onClick={() => onMediaOpen(firstMedia)}>
            <ImageIcon className="mr-2 h-4 w-4" /> Open media
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
  const [activeMedia, setActiveMedia] = useState<EventMedia | null>(null);

  useEffect(() => {
    const sync = () => setEvents(sortEvents(readEvents()).filter((event) => event.status === "published"));
    window.addEventListener("storage", sync);
    window.addEventListener("science-centre-events-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("science-centre-events-updated", sync);
    };
  }, []);

  const types = useMemo(() => ["all", ...Array.from(new Set(events.map((event) => event.type)))], [events]);
  const featured = events.find((event) => event.featured) || events[0];
  const galleryMedia = events.flatMap((event) =>
    (event.media.length ? event.media : [{ id: `${event.id}-cover`, type: "image" as const, src: event.coverImage, alt: event.title, caption: event.summary }]).map((media) => ({
      ...media,
      caption: media.caption || event.title,
    }))
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((event) => {
      if (mode === "upcoming" && !eventIsUpcoming(event)) return false;
      if (mode === "past" && eventIsUpcoming(event)) return false;
      if (activeType !== "all" && event.type !== activeType) return false;
      if (!q) return true;
      return [event.title, event.summary, event.details, event.city, event.venue, event.audience, ...event.speakers].join(" ").toLowerCase().includes(q);
    });
  }, [activeType, events, mode, query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar forceSolid />

      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-border bg-[#f8fbfc]">
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#0b4a72 1px, transparent 1px), linear-gradient(90deg, #0b4a72 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
          <div className="container relative mx-auto grid min-h-[620px] gap-10 px-6 py-16 md:px-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 border border-[#1f9fd0]/25 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#1f9fd0]">
                <CalendarDays className="h-4 w-4" /> Science Centre Events
              </div>
              <h1 className="font-[var(--app-font-heading)] text-5xl font-black leading-[0.95] tracking-normal text-foreground md:text-7xl">
                Events, demos, and training moments.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Explore upcoming workshops and browse media from Science Centre sessions across clinical diagnostics, laboratory instruments, and research workflows.
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
              <button onClick={() => setActiveMedia(featured.media[0] || { id: `${featured.id}-cover`, type: "image", src: featured.coverImage, alt: featured.title })} className="group relative min-h-[520px] overflow-hidden border border-border bg-white text-left">
                <img src={featured.coverImage} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute left-5 top-5 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-foreground">Featured event</div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="mb-3 flex flex-wrap gap-3 text-sm font-semibold opacity-90">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatEventDate(featured)}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{featured.city}</span>
                  </div>
                  <h2 className="font-[var(--app-font-heading)] text-3xl font-black leading-tight">{featured.title}</h2>
                  <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80">{featured.summary}</p>
                </div>
              </button>
            )}
          </div>
        </section>

        <section id="upcoming" className="container mx-auto px-6 py-12 md:px-12">
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

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} onMediaOpen={setActiveMedia} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="border border-border p-12 text-center">
                <h3 className="font-[var(--app-font-heading)] text-2xl font-bold">No events match this view</h3>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">Try a different filter or contact Science Centre for upcoming training dates.</p>
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border bg-[#f8fbfc]">
          <div className="container mx-auto px-6 py-12 md:px-12">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">Gallery</div>
                <h2 className="font-[var(--app-font-heading)] text-3xl font-black md:text-5xl">Event media wall</h2>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <ImageIcon className="h-4 w-4" /> {galleryMedia.length} published media items
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryMedia.slice(0, 12).map((media, index) => (
                <div key={`${media.id}-${index}`} className={index % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
                  <EventMediaThumb media={media} onOpen={setActiveMedia} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-14 md:px-12">
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
        </section>
      </main>

      <SiteFooter />

      <AnimatePresence>
        {activeMedia && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMedia(null)}
          >
            <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center bg-white text-foreground" onClick={() => setActiveMedia(null)} aria-label="Close media viewer">
              <X className="h-5 w-5" />
            </button>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="max-h-[88vh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
              {activeMedia.type === "video" ? (
                <video src={activeMedia.src} controls autoPlay className="max-h-[78vh] w-full bg-black object-contain" />
              ) : (
                <img src={activeMedia.src} alt={activeMedia.alt} className="max-h-[78vh] w-full bg-black object-contain" />
              )}
              {(activeMedia.caption || activeMedia.alt) && (
                <div className="bg-white p-4 text-sm font-semibold text-foreground">{activeMedia.caption || activeMedia.alt}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
