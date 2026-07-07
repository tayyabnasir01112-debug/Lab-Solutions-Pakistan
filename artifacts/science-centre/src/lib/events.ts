export type EventStatus = "published" | "draft";
export type EventType = "workshop" | "seminar" | "training" | "exhibition" | "webinar" | "meeting";
export type EventMediaType = "image" | "video";

export type EventMedia = {
  id: string;
  type: EventMediaType;
  src: string;
  alt: string;
  caption?: string;
};

export type ScienceEvent = {
  id: string;
  title: string;
  type?: EventType;
  status: EventStatus;
  featured: boolean;
  date?: string;
  endDate?: string;
  time?: string;
  venue?: string;
  city?: string;
  audience?: string;
  summary?: string;
  details?: string;
  agenda?: string[];
  speakers?: string[];
  registrationUrl?: string;
  contactEmail?: string;
  coverImage?: string;
  media?: EventMedia[];
  createdAt: string;
  updatedAt: string;
};

export const EVENTS_STORAGE_KEY = "science-centre-events-v1";
export const EVENTS_AUTH_KEY = "science-centre-events-admin-auth";
export const EVENTS_ADMIN_PIN = "SCP-2026";

const nowIso = () => new Date().toISOString();

export const defaultEvents: ScienceEvent[] = [
  {
    id: "clinical-systems-demo",
    title: "Clinical Systems Demonstration Day",
    type: "training",
    status: "published",
    featured: true,
    date: "2026-08-12",
    time: "10:00 AM - 3:30 PM",
    venue: "Science Centre Experience Lab",
    city: "Lahore",
    audience: "Clinical laboratory managers, biomedical engineers, and procurement teams",
    summary: "A practical demonstration day for clinical diagnostic workflows, analyzer support, and laboratory water quality planning.",
    details: "Guests will walk through live instrument use cases, sample-to-result workflow planning, and maintenance conversations with the Science Centre technical team. The session is designed for teams evaluating new laboratory systems or upgrading existing analyzer support infrastructure.",
    agenda: [
      "Welcome briefing and workflow mapping",
      "Clinical analyzer support and water quality planning",
      "Hands-on product stations with application specialists",
      "Procurement, installation, and after-sales support discussion",
    ],
    speakers: ["Science Centre Applications Team", "Technical Service Lead"],
    registrationUrl: "/#contact",
    contactEmail: "info@sciencecentre.com.pk",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "water-purification-workshop",
    title: "Water Purification Systems Workshop",
    type: "workshop",
    status: "published",
    featured: true,
    date: "2026-09-04",
    time: "11:00 AM - 2:00 PM",
    venue: "Science Centre Training Suite",
    city: "Karachi",
    audience: "QC labs, research facilities, hospitals, and university laboratories",
    summary: "A focused workshop on selecting, maintaining, and validating laboratory water purification systems for critical applications.",
    details: "This workshop helps teams compare water grades, understand system sizing, and prepare for installation and validation. Attendees can bring their water usage profile for a guided consultation after the session.",
    agenda: [
      "Water quality requirements by application",
      "System selection and daily usage calculations",
      "Preventive maintenance and consumable planning",
      "One-to-one consultation slots",
    ],
    speakers: ["Water Purification Product Specialist", "Service Operations Team"],
    registrationUrl: "/#contact",
    contactEmail: "info@sciencecentre.com.pk",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "flow-cytometry-demo",
    title: "Flow Cytometry Reagent Selection Clinic",
    type: "seminar",
    status: "published",
    featured: false,
    date: "2026-10-18",
    time: "2:00 PM - 5:00 PM",
    venue: "Hybrid Event",
    city: "Islamabad / Online",
    audience: "Researchers, immunology teams, and cell-analysis laboratories",
    summary: "An application-led clinic for selecting reagent families, fluorophore panels, and workflow support for flow cytometry users.",
    details: "The session covers common panel design constraints, reagent selection questions, and enquiry-led sourcing workflows. Participants can submit current panel challenges ahead of time for discussion.",
    agenda: [
      "Common flow cytometry panel design issues",
      "Reagent family and fluorophore selection",
      "Clinical and research workflow Q&A",
      "How to request sourced variants through Science Centre",
    ],
    speakers: ["Reagents Portfolio Team"],
    registrationUrl: "/#contact",
    contactEmail: "info@sciencecentre.com.pk",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

export function createBlankEvent(): ScienceEvent {
  const id = `event-${Date.now()}`;
  const timestamp = nowIso();
  return {
    id,
    title: "New Science Centre Event",
    type: undefined,
    status: "draft",
    featured: false,
    date: "",
    time: "",
    venue: "",
    city: "",
    audience: "",
    summary: "",
    details: "",
    agenda: [],
    speakers: [],
    registrationUrl: "",
    contactEmail: "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function readEvents(): ScienceEvent[] {
  if (typeof window === "undefined") return defaultEvents;
  const raw = window.localStorage.getItem(EVENTS_STORAGE_KEY);
  if (!raw) return defaultEvents;
  try {
    const parsed = JSON.parse(raw) as ScienceEvent[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultEvents;
  } catch {
    return defaultEvents;
  }
}

export function saveEvents(events: ScienceEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent("science-centre-events-updated"));
}

export function resetEvents() {
  saveEvents(defaultEvents);
}

export function sortEvents(events: ScienceEvent[]) {
  return [...events].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const aDate = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
    const bDate = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
    return aDate - bDate;
  });
}

export function formatEventDate(event: Pick<ScienceEvent, "date" | "endDate">) {
  if (!event.date) return "Date to be announced";
  const start = new Date(`${event.date}T12:00:00`);
  const fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });
  if (!event.endDate) return fmt.format(start);
  const end = new Date(`${event.endDate}T12:00:00`);
  return `${fmt.format(start)} - ${fmt.format(end)}`;
}

export function eventIsUpcoming(event: Pick<ScienceEvent, "date" | "endDate">) {
  if (!event.date) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const comparable = new Date(`${event.endDate || event.date}T23:59:59`);
  return comparable >= today;
}
