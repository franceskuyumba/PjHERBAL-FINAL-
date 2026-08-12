import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE, GOOGLE_MAPS } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getLocale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with PJHERBAL Clinic – Segerea Branch. Visit us, call, email or chat on WhatsApp.",
};

export default function ContactPage() {
  const lang = getLocale();
  return (
    <div className="bg-cream">
      <section className="bg-brand-950 py-16 text-white">
        <div className="container-site text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-300">{t(lang, "contact.helpEyebrow")}</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{t(lang, "contact.title")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
            {t(lang, "contact.subtitle")}
          </p>
        </div>
      </section>

      <section className="container-site grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <ContactCard
            icon={<MapPin className="h-5 w-5" />}
            title={t(lang, "contact.visitUs")}
            lines={[SITE.address, t(lang, "contact.openHours")]}
          />
          <ContactCard
            icon={<Phone className="h-5 w-5" />}
            title={t(lang, "contact.callUs")}
            lines={[SITE.phone]}
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
          />
          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            title={t(lang, "contact.emailUs")}
            lines={[SITE.email]}
            href={`mailto:${SITE.email}`}
          />
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex w-full items-center justify-center"
          >
            <MessageCircle className="mr-2 h-4 w-4" /> {t(lang, "contact.chatWhatsApp")}
          </a>
        </div>

        <div className="rounded-3xl border border-ink/5 bg-white p-8 shadow-card">
          <h2 className="font-display text-2xl font-bold text-brand-950">{t(lang, "contact.sendMessage")}</h2>
          <p className="mt-1 text-sm text-ink/55">{t(lang, "contact.replyTime")}</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="container-site pb-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-brand-950">{t(lang, "contact.findMap")}</h2>
          {GOOGLE_MAPS.businessUrl && (
            <a
              href={GOOGLE_MAPS.businessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline btn-sm"
            >
              <Navigation className="h-4 w-4" /> {t(lang, "contact.directions")}
            </a>
          )}
        </div>
        <div className="mt-5 overflow-hidden rounded-3xl border border-ink/5 shadow-card">
          <iframe
            title={`${SITE.name} location map`}
            src={GOOGLE_MAPS.embedUrl}
            className="h-80 w-full sm:h-96"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  lines,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  href?: string;
}) {
  const body = (
    <div className="flex gap-4 rounded-3xl border border-ink/5 bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        {icon}
      </span>
      <div>
        <p className="font-display text-base font-bold text-brand-950">{title}</p>
        {lines.map((l) => (
          <p key={l} className="mt-0.5 text-sm text-ink/60">
            {l}
          </p>
        ))}
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block">
      {body}
    </a>
  ) : (
    body
  );
}
