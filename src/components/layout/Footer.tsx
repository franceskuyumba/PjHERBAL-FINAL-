import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Twitter,
  Smartphone,
  Banknote,
  Building2,
} from "lucide-react";
import { SITE, PAYMENT_METHODS } from "@/lib/constants";
import { getSocialLinks } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getLocale, t } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const quickLinks = [
  { labelKey: "footer.aboutUs", href: "/about" },
  { labelKey: "footer.allProducts", href: "/shop" },
  { labelKey: "footer.contact", href: "/contact" },
];

const shopLinks = [
  { labelKey: "footer.allProducts", href: "/shop" },
  { labelKey: "footer.mensHealth", href: "/category/mens-health" },
  { labelKey: "footer.weightManagement", href: "/category/weight-management" },
  { labelKey: "footer.energyImmunity", href: "/category/energy-immunity" },
  { labelKey: "footer.womensWellness", href: "/category/womens-wellness" },
  { labelKey: "footer.brainFocus", href: "/category/brain-focus" },
  { labelKey: "footer.detoxDigestion", href: "/category/detox-digestion" },
];

const companyLinks = [
  { labelKey: "footer.aboutUs", href: "/about" },
  { labelKey: "footer.blog", href: "/blog" },
  { labelKey: "footer.contact", href: "/contact" },
  { labelKey: "footer.myOrders", href: "/customer-dashboard/orders" },
  { labelKey: "footer.myAccount", href: "/login" },
];

function paymentIcon(methodId: string) {
  switch (methodId) {
    case "CASH":
      return <Banknote className="h-3.5 w-3.5" />;
    case "CRDB":
    case "NMB":
      return <Building2 className="h-3.5 w-3.5" />;
    default:
      return <Smartphone className="h-3.5 w-3.5" />;
  }
}

export async function Footer() {
  const lang = getLocale();
  const socialLinks = await getSocialLinks();
  return (
    <footer className="mt-20 bg-brand-950 text-white">
      {/* ── Main footer grid ── */}
      <div className="container-site grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1 — Brand */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="PJHERBAL Clinic"
              width={48}
              height={48}
              className="h-11 w-auto rounded-xl bg-white p-1.5 shadow-card"
            />
            <div>
              <p className="font-display text-lg font-bold leading-none text-gold-300">PJHERBAL</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                Clinic &middot; Segerea
              </p>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            {t(lang, "footer.tagline")}
          </p>
          {/* Social icons */}
          <div className="mt-6 flex gap-2.5">
            <SocialIcon href={socialLinks.facebook} label="Facebook">
              <Facebook className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href={socialLinks.instagram} label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href={socialLinks.tiktok} label="TikTok">
              <Music2 className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href={socialLinks.x} label="X (Twitter)">
              <Twitter className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href={buildWhatsAppUrl()} label="WhatsApp" highlight>
              <MessageCircle className="h-4 w-4" />
            </SocialIcon>
          </div>
        </div>

        {/* Column 2 — Shop */}
        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            {t(lang, "footer.shopHeading")}
          </h3>
          <ul className="space-y-3">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/55 transition-colors duration-300 hover:text-gold-300"
                >
                  {t(lang, link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Company */}
        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            {t(lang, "footer.companyHeading")}
          </h3>
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/55 transition-colors duration-300 hover:text-gold-300"
                >
                  {t(lang, link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Contact & Hours */}
        <div>
          <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            {t(lang, "footer.visitUs")}
          </h3>
          <ul className="space-y-3 text-sm text-white/55">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" />
              {SITE.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold-500/70" />
              {SITE.phone}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold-500/70" />
              {SITE.email}
            </li>
          </ul>

          {/* Business hours card */}
          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-sm font-semibold text-white">{t(lang, "footer.businessHours")}</p>
            <p className="mt-1.5 text-xs text-white/50">{t(lang, "footer.monSat")}</p>
            <p className="text-xs text-white/50">{t(lang, "footer.sunday")}</p>
          </div>

          {/* Payment methods */}
          <div className="mt-5">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/40">
              <CreditCard className="h-3.5 w-3.5" />
              {t(lang, "footer.payments") || "Payments"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-white/50"
                  title={m.description}
                >
                  {paymentIcon(m.id)}
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Language switcher ── */}
      <div className="border-t border-white/[0.06]">
        <div className="container-site flex justify-center py-5">
          <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400/80">
              Language
            </span>
            <LanguageSwitcher variant="dark" />
            <span className="text-xs text-white/40">English &harr; Kiswahili</span>
          </div>
        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-white/[0.06]">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/40 sm:flex-row">
          <p>{t(lang, "footer.copyright").replace("{year}", String(new Date().getFullYear()))}</p>
          <p className="hidden items-center gap-2 sm:flex">
            <Link href="/shop" className="transition-colors hover:text-gold-300">
              {t(lang, "footer.shopHeading")}
            </Link>
            <span className="text-white/15">&middot;</span>
            <Link href="/about" className="transition-colors hover:text-gold-300">
              {t(lang, "footer.about")}
            </Link>
            <span className="text-white/15">&middot;</span>
            <Link href="/contact" className="transition-colors hover:text-gold-300">
              {t(lang, "footer.contact")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Social icon button ── */
function SocialIcon({
  href,
  label,
  highlight,
  children,
}: {
  href: string;
  label: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={
        highlight
          ? "flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition-colors duration-300 hover:bg-[#25D366] hover:text-white"
          : "flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition-colors duration-300 hover:bg-brand-600 hover:text-white"
      }
    >
      {children}
    </a>
  );
}
