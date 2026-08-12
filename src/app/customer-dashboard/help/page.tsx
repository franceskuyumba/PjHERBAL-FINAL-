import Link from "next/link";
import { Clock, LifeBuoy, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { HelpFaq } from "@/components/dashboard/HelpFaq";

export const metadata = { title: "Help & Support", robots: { index: false, follow: false } };

export default function HelpPage() {
  const supportCards = [
    {
      icon: MessageCircle,
      title: "Chat on WhatsApp",
      body: "Fastest way to reach a specialist. We usually reply within minutes during working hours.",
      cta: "Start chat",
      href: buildWhatsAppUrl({ message: "Hello PJHERBAL Clinic, I need help with my account." }),
      external: true,
    },
    {
      icon: Mail,
      title: "Email us",
      body: "For detailed questions, receipts or documentation.",
      cta: SITE.email,
      href: `mailto:${SITE.email}`,
      external: false,
    },
    {
      icon: Phone,
      title: "Call the clinic",
      body: "Talk to our Segerea branch team during opening hours.",
      cta: SITE.phone,
      href: `tel:${SITE.phone.replace(/\s/g, "")}`,
      external: false,
    },
    {
      icon: MapPin,
      title: "Visit the store",
      body: SITE.address,
      cta: "Get directions",
      href: "https://maps.google.com/?q=Segerea,Dar es Salaam,Tanzania",
      external: true,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-6 w-6 text-brand-700" />
        <h1 className="font-display text-2xl font-bold text-brand-950">Help & support</h1>
      </div>
      <p className="mt-1 text-sm text-ink/55">We are here to make your wellness journey smooth.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {supportCards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noopener noreferrer" : undefined}
            className="card group flex items-start gap-4 p-5 transition-all hover:shadow-lift"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <c.icon className="h-5 w-5" />
            </span>
            <span>
              <p className="font-display text-base font-bold text-brand-950">{c.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink/55">{c.body}</p>
              <p className="mt-2 text-sm font-semibold text-brand-700">{c.cta}</p>
            </span>
          </a>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-3xl bg-gold-50 p-5 text-sm text-ink/70">
        <Clock className="h-5 w-5 shrink-0 text-gold-600" />
        <p>
          <span className="font-semibold text-brand-950">Opening hours:</span> Monday – Saturday, 8:00 AM – 8:00 PM.
          WhatsApp support continues after hours.
        </p>
      </div>

      <div className="mt-8">
        <HelpFaq />
      </div>

      <div className="mt-6">
        <Link href="/about" className="text-sm font-semibold text-brand-700 hover:underline">
          Learn more about PJHERBAL Clinic →
        </Link>
      </div>
    </div>
  );
}
