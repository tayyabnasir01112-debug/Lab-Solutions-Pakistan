import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

const offices = [
  {
    city: "Rawalpindi",
    label: "Head office",
    address: "3287 Adamjee Road Saddar, Rawalpindi, Pakistan",
    phone: "+92 51-5568464 | 5568498",
    email: "info@sciencecentre.com.pk",
  },
  {
    city: "Nationwide support",
    label: "Client coordination",
    address: "Serving hospitals, universities, research institutes and industry labs across Pakistan.",
    phone: "Request routing by city",
    email: "info@sciencecentre.com.pk",
  },
];

const enquiryTypes = [
  "Product quote",
  "Instrument recommendation",
  "Consumables and kits",
  "Service or installation",
  "Partnership discussion",
  "Events and training",
];

const responseSteps = [
  ["Share the need", "Product name, catalogue number, test menu, sample volume or lab application."],
  ["We clarify details", "Our team checks configuration, variants, accessories and documentation requirements."],
  ["Receive a clear path", "You get a quote direction, product shortlist or next technical conversation."],
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar forceSolid />
      <main>
        <section className="relative overflow-hidden pt-32">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#eef8ff_0%,#ffffff_45%,#f7fff8_100%)]" />
          <div className="container relative mx-auto grid min-h-[82vh] items-center gap-12 px-6 py-16 md:px-12 lg:grid-cols-[0.88fr_1.12fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <div className="mb-5 inline-flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-primary">
                <MessageSquare className="h-3.5 w-3.5" /> Contact Science Centre
              </div>
              <h1 className="font-[var(--app-font-heading)] text-5xl font-black leading-[0.98] md:text-7xl">
                Tell us what your lab needs next.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Send a product name, catalogue number, application, test menu or broad requirement. We will help route it to the right product family and commercial conversation.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {["Fast product routing", "Variant guidance", "Local support"].map(item => (
                  <div key={item} className="flex items-center gap-2 border border-border bg-background/80 px-3 py-3 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="border border-border bg-background p-6 shadow-sm md:p-8">
              <div className="mb-6">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-primary">Start an enquiry</div>
                <h2 className="mt-2 font-[var(--app-font-heading)] text-3xl font-black">Request a quote or technical call</h2>
              </div>
              <form className="grid gap-4" action="mailto:info@sciencecentre.com.pk" method="post" encType="text/plain">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="Name" className="mt-2 rounded-none" placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" name="Organization" className="mt-2 rounded-none" placeholder="Hospital, university, lab..." />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="Email" className="mt-2 rounded-none" placeholder="name@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="Phone" className="mt-2 rounded-none" placeholder="+92 ..." />
                  </div>
                </div>
                <div>
                  <Label htmlFor="type">What do you need?</Label>
                  <select id="type" name="Enquiry type" className="mt-2 h-10 w-full border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    {enquiryTypes.map(type => <option key={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="message">Requirement</Label>
                  <Textarea id="message" name="Requirement" className="mt-2 min-h-36 rounded-none" placeholder="Mention product, brand, catalogue number, application, quantity, test menu, or timeline." />
                </div>
                <Button type="submit" className="rounded-none">
                  Send Enquiry <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid gap-5 lg:grid-cols-[0.75fr_1fr]">
              <div className="border border-border bg-foreground p-8 text-background">
                <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">Direct contact</div>
                <h2 className="font-[var(--app-font-heading)] text-4xl font-black">Speak with the right team.</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  For urgent product or quotation needs, email or call with the brand, catalogue number and required quantity if available.
                </p>
                <div className="mt-8 grid gap-4">
                  <a href="mailto:info@sciencecentre.com.pk" className="flex items-center gap-3 border border-white/12 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>info@sciencecentre.com.pk</span>
                  </a>
                  <a href="tel:+92515568464" className="flex items-center gap-3 border border-white/12 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+92 51-5568464 | 5568498</span>
                  </a>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {offices.map(office => (
                  <div key={office.city} className="border border-border bg-background p-7">
                    <Building2 className="mb-5 h-6 w-6 text-primary" />
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">{office.label}</div>
                    <h3 className="mt-2 font-[var(--app-font-heading)] text-2xl font-black">{office.city}</h3>
                    <div className="mt-5 space-y-4 text-sm text-muted-foreground">
                      <div className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" /> {office.address}</div>
                      <div className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0" /> {office.phone}</div>
                      <div className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0" /> {office.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/35 py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-primary">What happens next</div>
                <h2 className="font-[var(--app-font-heading)] text-4xl font-black">A simple, useful response flow.</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Response routing depends on product complexity and documentation needs.
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {responseSteps.map(([title, body], index) => (
                <div key={title} className="border border-border bg-background p-7">
                  <div className="mb-7 font-[var(--app-font-heading)] text-4xl font-black text-primary">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="font-[var(--app-font-heading)] text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="border border-border p-8 md:p-10">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <h2 className="font-[var(--app-font-heading)] text-3xl font-black">Already browsing products?</h2>
                  <p className="mt-2 text-muted-foreground">Open the catalogue and send us the product name or link for a faster quote conversation.</p>
                </div>
                <Button asChild size="lg" variant="outline" className="rounded-none">
                  <Link href="/products">Go to Catalogue <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
