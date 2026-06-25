import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  Archive,
  CalendarDays,
  Check,
  Copy,
  Download,
  Eye,
  FileUp,
  ImagePlus,
  Lock,
  LogOut,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteNavbar } from "@/components/site-navbar";
import {
  createBlankEvent,
  EVENTS_ADMIN_PIN,
  EVENTS_AUTH_KEY,
  formatEventDate,
  readEvents,
  resetEvents,
  saveEvents,
  sortEvents,
  type EventMedia,
  type EventMediaType,
  type EventStatus,
  type EventType,
  type ScienceEvent,
} from "@/lib/events";

const eventTypes: EventType[] = ["workshop", "seminar", "training", "exhibition", "webinar", "meeting"];

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function lines(value: string[]) {
  return value.join("\n");
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function fieldClassName() {
  return "h-11 rounded-none border-border bg-background";
}

function labelClassName() {
  return "mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground";
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pin.trim() === EVENTS_ADMIN_PIN) {
      window.localStorage.setItem(EVENTS_AUTH_KEY, "1");
      onLogin();
      return;
    }
    setError("Incorrect admin PIN");
  }

  return (
    <div className="min-h-screen bg-[#f8fbfc] text-foreground">
      <SiteNavbar forceSolid />
      <main className="container mx-auto grid min-h-screen place-items-center px-6 pt-24 md:px-12">
        <form onSubmit={submit} className="w-full max-w-xl border border-border bg-background p-8 shadow-sm">
          <div className="mb-8 grid h-14 w-14 place-items-center bg-foreground text-background">
            <Lock className="h-6 w-6" />
          </div>
          <div className="mb-6">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#1f9fd0]">Events admin</div>
            <h1 className="font-[var(--app-font-heading)] text-4xl font-black leading-tight">Manage Science Centre events</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Create upcoming events, publish details, upload media, and manage the public gallery.
            </p>
          </div>
          <label className={labelClassName()} htmlFor="pin">Admin PIN</label>
          <Input id="pin" type="password" value={pin} onChange={(event) => setPin(event.target.value)} className="mb-3 h-12 rounded-none" placeholder="Enter admin PIN" />
          {error && <p className="mb-3 text-sm font-semibold text-red-600">{error}</p>}
          <Button type="submit" className="h-12 w-full rounded-none bg-foreground text-background hover:bg-foreground/90">
            Unlock dashboard
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Admin access is intended for Science Centre staff and approved client editors.
          </p>
        </form>
      </main>
    </div>
  );
}

function EventPreview({ event }: { event: ScienceEvent }) {
  return (
    <div className="overflow-hidden border border-border bg-background">
      <div className="relative aspect-[16/10] bg-muted">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground"><ImagePlus className="h-10 w-10" /></div>
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white ${event.status === "published" ? "bg-[#1f9fd0]" : "bg-foreground/70"}`}>
            {event.status}
          </span>
          {event.featured && <span className="bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-foreground">Featured</span>}
        </div>
      </div>
      <div className="p-5">
        <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#1f9fd0]">{event.type}</div>
        <h3 className="font-[var(--app-font-heading)] text-2xl font-black leading-tight">{event.title}</h3>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
          <span>{formatEventDate(event)}</span>
          <span>{event.time}</span>
          <span>{event.city}</span>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{event.summary}</p>
      </div>
    </div>
  );
}

export default function EventsAdminPage() {
  const [authenticated, setAuthenticated] = useState(() => typeof window !== "undefined" && window.localStorage.getItem(EVENTS_AUTH_KEY) === "1");
  const [events, setEvents] = useState<ScienceEvent[]>(() => sortEvents(readEvents()));
  const [activeId, setActiveId] = useState(() => sortEvents(readEvents())[0]?.id || "");
  const [query, setQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const importRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  const activeEvent = events.find((event) => event.id === activeId) || events[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((event) => [event.title, event.city, event.venue, event.type, event.status].join(" ").toLowerCase().includes(q));
  }, [events, query]);

  function commit(nextEvents: ScienceEvent[], nextActiveId = activeId) {
    const sorted = sortEvents(nextEvents);
    setEvents(sorted);
    setActiveId(nextActiveId);
    saveEvents(sorted);
  }

  function updateActive(patch: Partial<ScienceEvent>) {
    if (!activeEvent) return;
    const updated = { ...activeEvent, ...patch, updatedAt: new Date().toISOString() };
    commit(events.map((event) => event.id === activeEvent.id ? updated : event), updated.id);
  }

  function addEvent() {
    const event = createBlankEvent();
    commit([event, ...events], event.id);
  }

  function duplicateEvent() {
    if (!activeEvent) return;
    const timestamp = new Date().toISOString();
    const copy: ScienceEvent = {
      ...activeEvent,
      id: `${activeEvent.id}-copy-${Date.now()}`,
      title: `${activeEvent.title} Copy`,
      status: "draft",
      featured: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    commit([copy, ...events], copy.id);
  }

  function deleteEvent() {
    if (!activeEvent || !window.confirm(`Delete "${activeEvent.title}"?`)) return;
    const next = events.filter((event) => event.id !== activeEvent.id);
    commit(next, next[0]?.id || "");
  }

  async function uploadMedia(files: FileList | null) {
    if (!activeEvent || !files?.length) return;
    const uploaded: EventMedia[] = [];
    for (const file of Array.from(files)) {
      const type: EventMediaType = file.type.startsWith("video") ? "video" : "image";
      const src = await fileToDataUrl(file);
      uploaded.push({
        id: `media-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type,
        src,
        alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      });
    }
    const coverImage = activeEvent.coverImage || uploaded.find((item) => item.type === "image")?.src || activeEvent.coverImage;
    updateActive({ media: [...activeEvent.media, ...uploaded], coverImage });
    if (mediaRef.current) mediaRef.current.value = "";
  }

  function removeMedia(id: string) {
    if (!activeEvent) return;
    const media = activeEvent.media.filter((item) => item.id !== id);
    const coverImage = activeEvent.coverImage === activeEvent.media.find((item) => item.id === id)?.src
      ? media.find((item) => item.type === "image")?.src || "/images/events/event-clinical-systems.svg"
      : activeEvent.coverImage;
    updateActive({ media, coverImage });
    setSelectedMedia((items) => items.filter((item) => item !== id));
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `science-centre-events-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as ScienceEvent[];
    if (!Array.isArray(parsed)) return;
    commit(parsed, parsed[0]?.id || "");
    if (importRef.current) importRef.current.value = "";
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  if (!activeEvent) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavbar forceSolid />
        <main className="container mx-auto px-6 py-36 text-center md:px-12">
          <h1 className="font-[var(--app-font-heading)] text-4xl font-black">No events yet</h1>
          <Button onClick={addEvent} className="mt-6 rounded-none bg-foreground text-background">Create first event</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbfc] text-foreground">
      <SiteNavbar forceSolid />
      <main className="pt-24">
        <section className="border-b border-border bg-background">
          <div className="container mx-auto flex flex-col gap-6 px-6 py-8 md:px-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#1f9fd0]">Client dashboard</div>
              <h1 className="font-[var(--app-font-heading)] text-4xl font-black md:text-5xl">Events and gallery admin</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Publish upcoming events, manage event details, upload media, and curate the public gallery.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-none"><Link href="/events"><Eye className="mr-2 h-4 w-4" /> Public page</Link></Button>
              <Button onClick={addEvent} className="rounded-none bg-foreground text-background hover:bg-foreground/90"><Plus className="mr-2 h-4 w-4" /> New event</Button>
              <Button variant="outline" className="rounded-none" onClick={() => { window.localStorage.removeItem(EVENTS_AUTH_KEY); setAuthenticated(false); }}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid gap-6 px-6 py-8 md:px-12 xl:grid-cols-[360px_1fr_360px]">
          <aside className="space-y-4">
            <div className="border border-border bg-background p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" className="h-11 rounded-none pl-10" />
              </div>
            </div>
            <div className="max-h-[calc(100vh-250px)] overflow-auto border border-border bg-background">
              {filtered.map((event) => (
                <button
                  key={event.id}
                  onClick={() => { setActiveId(event.id); setSelectedMedia([]); }}
                  className={`w-full border-b border-border p-4 text-left transition-colors last:border-b-0 ${activeEvent.id === event.id ? "bg-foreground text-background" : "hover:bg-muted"}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-[0.16em] ${activeEvent.id === event.id ? "text-background/60" : "text-[#1f9fd0]"}`}>{event.type}</span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.16em] ${event.status === "published" ? "text-[#4fbf93]" : "text-muted-foreground"}`}>{event.status}</span>
                  </div>
                  <div className="line-clamp-2 font-[var(--app-font-heading)] text-lg font-black leading-tight">{event.title}</div>
                  <div className={`mt-2 flex items-center gap-2 text-xs ${activeEvent.id === event.id ? "text-background/60" : "text-muted-foreground"}`}>
                    <CalendarDays className="h-3.5 w-3.5" /> {formatEventDate(event)}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="border border-border bg-background p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Editing</div>
                  <h2 className="font-[var(--app-font-heading)] text-2xl font-black">{activeEvent.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="rounded-none" onClick={duplicateEvent}><Copy className="mr-2 h-4 w-4" /> Duplicate</Button>
                  <Button variant="outline" className="rounded-none border-red-200 text-red-600 hover:bg-red-50" onClick={deleteEvent}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className={labelClassName()}>Event title</label>
                  <Input value={activeEvent.title} onChange={(event) => updateActive({ title: event.target.value })} className={fieldClassName()} />
                </div>
                <div>
                  <label className={labelClassName()}>Type</label>
                  <select value={activeEvent.type} onChange={(event) => updateActive({ type: event.target.value as EventType })} className={`${fieldClassName()} w-full px-3`}>
                    {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClassName()}>Status</label>
                  <select value={activeEvent.status} onChange={(event) => updateActive({ status: event.target.value as EventStatus })} className={`${fieldClassName()} w-full px-3`}>
                    <option value="published">published</option>
                    <option value="draft">draft</option>
                  </select>
                </div>
                <div>
                  <label className={labelClassName()}>Date</label>
                  <Input type="date" value={activeEvent.date} onChange={(event) => updateActive({ date: event.target.value })} className={fieldClassName()} />
                </div>
                <div>
                  <label className={labelClassName()}>End date</label>
                  <Input type="date" value={activeEvent.endDate || ""} onChange={(event) => updateActive({ endDate: event.target.value || undefined })} className={fieldClassName()} />
                </div>
                <div>
                  <label className={labelClassName()}>Time</label>
                  <Input value={activeEvent.time} onChange={(event) => updateActive({ time: event.target.value })} className={fieldClassName()} />
                </div>
                <div>
                  <label className={labelClassName()}>City</label>
                  <Input value={activeEvent.city} onChange={(event) => updateActive({ city: event.target.value })} className={fieldClassName()} />
                </div>
                <div>
                  <label className={labelClassName()}>Venue</label>
                  <Input value={activeEvent.venue} onChange={(event) => updateActive({ venue: event.target.value })} className={fieldClassName()} />
                </div>
                <div>
                  <label className={labelClassName()}>Contact email</label>
                  <Input value={activeEvent.contactEmail || ""} onChange={(event) => updateActive({ contactEmail: event.target.value })} className={fieldClassName()} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClassName()}>Registration URL</label>
                  <Input value={activeEvent.registrationUrl || ""} onChange={(event) => updateActive({ registrationUrl: event.target.value })} className={fieldClassName()} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClassName()}>Audience</label>
                  <Input value={activeEvent.audience} onChange={(event) => updateActive({ audience: event.target.value })} className={fieldClassName()} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClassName()}>Short summary</label>
                  <textarea value={activeEvent.summary} onChange={(event) => updateActive({ summary: event.target.value })} className="min-h-[90px] w-full rounded-none border border-border bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClassName()}>Full details</label>
                  <textarea value={activeEvent.details} onChange={(event) => updateActive({ details: event.target.value })} className="min-h-[150px] w-full rounded-none border border-border bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className={labelClassName()}>Agenda, one line per item</label>
                  <textarea value={lines(activeEvent.agenda)} onChange={(event) => updateActive({ agenda: splitLines(event.target.value) })} className="min-h-[160px] w-full rounded-none border border-border bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className={labelClassName()}>Speakers, one line per speaker</label>
                  <textarea value={lines(activeEvent.speakers)} onChange={(event) => updateActive({ speakers: splitLines(event.target.value) })} className="min-h-[160px] w-full rounded-none border border-border bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-ring" />
                </div>
              </div>
            </div>

            <div className="border border-border bg-background p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Media library</div>
                  <h2 className="font-[var(--app-font-heading)] text-2xl font-black">Gallery uploads</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input ref={mediaRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(event) => uploadMedia(event.target.files)} />
                  <Button className="rounded-none bg-foreground text-background hover:bg-foreground/90" onClick={() => mediaRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload media
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeEvent.media.map((media) => {
                  const checked = selectedMedia.includes(media.id);
                  return (
                    <div key={media.id} className={`overflow-hidden border bg-background ${checked ? "border-[#1f9fd0]" : "border-border"}`}>
                      <button onClick={() => setSelectedMedia((items) => checked ? items.filter((item) => item !== media.id) : [...items, media.id])} className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        {media.type === "video" ? (
                          <video src={media.src} className="h-full w-full object-cover" muted playsInline />
                        ) : (
                          <img src={media.src} alt={media.alt} className="h-full w-full object-cover" />
                        )}
                        <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-foreground">{media.type === "video" ? <Video className="inline h-3 w-3" /> : "Image"}</span>
                        {checked && <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center bg-[#1f9fd0] text-white"><Check className="h-4 w-4" /></span>}
                      </button>
                      <div className="space-y-2 p-3">
                        <Input value={media.caption || ""} onChange={(event) => updateActive({ media: activeEvent.media.map((item) => item.id === media.id ? { ...item, caption: event.target.value } : item) })} placeholder="Caption" className="h-9 rounded-none text-xs" />
                        <div className="flex gap-2">
                          {media.type === "image" && (
                            <Button variant="outline" className="h-9 flex-1 rounded-none text-xs" onClick={() => updateActive({ coverImage: media.src })}>
                              Cover
                            </Button>
                          )}
                          <Button variant="outline" className="h-9 rounded-none border-red-200 px-3 text-red-600 hover:bg-red-50" onClick={() => removeMedia(media.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {activeEvent.media.length === 0 && (
                  <button onClick={() => mediaRef.current?.click()} className="min-h-[220px] border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground sm:col-span-2 lg:col-span-3">
                    <ImagePlus className="mx-auto mb-3 h-8 w-8" />
                    Upload images or videos for this event
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <EventPreview event={activeEvent} />

            <div className="border border-border bg-background p-5">
              <div className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Publishing controls</div>
              <div className="space-y-3">
                <button onClick={() => updateActive({ status: activeEvent.status === "published" ? "draft" : "published" })} className="flex w-full items-center justify-between border border-border p-3 text-left hover:bg-muted">
                  <span className="font-semibold">Published</span>
                  <span className={`h-6 w-11 p-1 ${activeEvent.status === "published" ? "bg-[#1f9fd0]" : "bg-muted"}`}>
                    <span className={`block h-4 w-4 bg-white transition-transform ${activeEvent.status === "published" ? "translate-x-5" : ""}`} />
                  </span>
                </button>
                <button onClick={() => updateActive({ featured: !activeEvent.featured })} className="flex w-full items-center justify-between border border-border p-3 text-left hover:bg-muted">
                  <span className="inline-flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4 text-[#f0b64c]" /> Featured event</span>
                  <span className={`h-6 w-11 p-1 ${activeEvent.featured ? "bg-[#f0b64c]" : "bg-muted"}`}>
                    <span className={`block h-4 w-4 bg-white transition-transform ${activeEvent.featured ? "translate-x-5" : ""}`} />
                  </span>
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="border border-border p-3">
                  <div className="font-[var(--app-font-heading)] text-2xl font-black">{events.filter((event) => event.status === "published").length}</div>
                  <div className="text-muted-foreground">Published</div>
                </div>
                <div className="border border-border p-3">
                  <div className="font-[var(--app-font-heading)] text-2xl font-black">{events.reduce((sum, event) => sum + event.media.length, 0)}</div>
                  <div className="text-muted-foreground">Media</div>
                </div>
              </div>
            </div>

            <div className="border border-border bg-background p-5">
              <div className="mb-4 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Backup and restore</div>
              <div className="grid gap-2">
                <Button variant="outline" className="justify-start rounded-none" onClick={exportJson}><Download className="mr-2 h-4 w-4" /> Export JSON backup</Button>
                <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(event) => importJson(event.target.files?.[0])} />
                <Button variant="outline" className="justify-start rounded-none" onClick={() => importRef.current?.click()}><FileUp className="mr-2 h-4 w-4" /> Import JSON backup</Button>
                <Button variant="outline" className="justify-start rounded-none border-red-200 text-red-600 hover:bg-red-50" onClick={() => { if (window.confirm("Reset all events to demo content?")) { resetEvents(); const next = sortEvents(readEvents()); setEvents(next); setActiveId(next[0]?.id || ""); } }}>
                  <Archive className="mr-2 h-4 w-4" /> Reset demo content
                </Button>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Uploads are saved in this browser. Export JSON after major updates so the event data can be restored or moved to another machine.
              </p>
            </div>

            <div className="border border-border bg-foreground p-5 text-background">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-background/50">Admin note</div>
              <p className="text-sm leading-relaxed text-background/75">
                This dashboard is perfect for quick client editing on the current static site. A database-backed CMS can be added later for multi-user secure publishing.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
