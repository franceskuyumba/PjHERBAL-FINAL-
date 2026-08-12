import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Send,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { SITE, WHATSAPP_LINK } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppButton";
import { categories } from "@/lib/data/categories";

const payments = ["M-Pesa", "Tigo Pesa", "Airtel Money", "HaloPesa", "CRDB", "NMB"];

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-950 text-brand-100">
      {/* Newsletter */}
      <div className="border-b border-brand-800/60 bg-gradient-to-r from-brand-900 to-brand-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-10 md:flex-row">
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              Get health tips & exclusive offers
            </h3>
            <p className="mt-1 text-sm text-brand-300">
              Join our newsletter for discounts, new products and expert wellness advice.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-full border border-brand-700 bg-brand-900/70 px-5 text-sm text-white placeholder:text-brand-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            />
            <button
              type="submit"
              className="flex h-12 items-center gap-2 rounded-full bg-gold-500 px-6 text-sm font-semibold text-white transition hover:bg-gold-600"
            >
              <Send className="h-4 w-4" /> Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold text-white">
              Afya<span className="text-gold-400">Plus</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-brand-300">
            Premium, authentic health supplements delivered to your doorstep anywhere in
            Tanzania. Order easily via website or WhatsApp.
          </p>
          <div className="mt-5 flex gap-2">
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-brand-200 transition hover:bg-brand-600 hover:text-white">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-brand-200 transition hover:bg-brand-600 hover:text-white">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={WHATSAPP_LINK()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-brand-200 transition hover:bg-brand-600 hover:text-white">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-brand-200 transition hover:bg-brand-600 hover:text-white">
              <Send className="h-4 w-4" />
            </a>
            <a href={SITE.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-brand-200 transition hover:bg-brand-600 hover:text-white">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Categories
          </h4>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/category/${c.slug}`}
                  className="flex items-center gap-1 text-brand-300 transition hover:text-gold-400"
                >
                  <ChevronRight className="h-3.5 w-3.5" /> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Quick Links
          </h4>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {[
              { label: "Shop All Products", href: "/shop" },
              { label: "About Us", href: "/about" },
              { label: "Health Blog", href: "/blog" },
              { label: "Contact Us", href: "/contact" },
              { label: "My Account", href: "/customer-dashboard" },
              { label: "Track Order", href: "/customer-dashboard" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms" },
            ].map((l) => (
              <li key={l.href + l.label}>
                <Link
                  href={l.href}
                  className="flex items-center gap-1 text-brand-300 transition hover:text-gold-400"
                >
                  <ChevronRight className="h-3.5 w-3.5" /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Contact
          </h4>
          <ul className="mt-4 grid gap-3 text-sm text-brand-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {SITE.address}
            </li>
            <li>
              <a href={SITE.phoneHref} className="flex items-center gap-2.5 transition hover:text-gold-400">
                <Phone className="h-4 w-4 shrink-0 text-gold-400" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2.5 transition hover:text-gold-400">
                <Mail className="h-4 w-4 shrink-0 text-gold-400" /> {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {SITE.hours}
            </li>
          </ul>
          <div className="mt-5">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              We Accept
            </h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {payments.map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-brand-700 bg-brand-900/60 px-2 py-1 text-[11px] font-semibold text-brand-200"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-800/60 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-brand-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
          </p>
          <p>
            Supplements are not a substitute for a balanced diet. Consult your doctor before use.
          </p>
        </div>
      </div>
    </footer>
  );
}
