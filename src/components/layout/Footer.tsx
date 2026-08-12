import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone, Twitter } from "lucide-react";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "Men's Health", href: "/category/mens-health" },
  { label: "Weight Management", href: "/category/weight-management" },
  { label: "Energy & Immunity", href: "/category/energy-immunity" },
  { label: "Women's Wellness", href: "/category/womens-wellness" },
  { label: "Brain & Focus", href: "/category/brain-focus" },
  { label: "Detox & Digestion", href: "/category/detox-digestion" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "My Orders", href: "/customer-dashboard/orders" },
  { label: "My Account", href: "/login" },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-brand-950 text-white">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/images/logo.svg" alt="PJHERBAL Clinic" width={180} height={40} className="mb-4 h-10 w-auto" />
          <p className="max-w-xs text-sm leading-6 text-white/60">
            Premium natural herbal supplements from Segerea, Dar es Salaam. Trusted quality, honest care.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-600">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-600">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-600">
              <Music2 className="h-4 w-4" />
            </a>
            <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-600">
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#25D366]"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold-300">Shop</h3>
          <ul className="space-y-2.5">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold-300">Company</h3>
          <ul className="space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold-300">Visit Us</h3>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              {SITE.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" />
              {SITE.phone}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" />
              {SITE.email}
            </li>
          </ul>
          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Business hours</p>
            <p className="mt-1 text-xs text-white/60">Mon – Sat: 8:00 AM – 8:00 PM</p>
            <p className="text-xs text-white/60">Sunday: 10:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} PJHERBAL Clinic – Segerea Branch. All rights reserved.</p>
          <p>
            <Link href="/shop" className="hover:text-gold-300">Shop</Link>
            <span className="mx-2">·</span>
            <Link href="/about" className="hover:text-gold-300">About</Link>
            <span className="mx-2">·</span>
            <Link href="/contact" className="hover:text-gold-300">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
