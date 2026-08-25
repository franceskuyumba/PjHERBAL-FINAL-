import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, Leaf, ShieldCheck, Truck } from "lucide-react";
import { getLocale, t } from "@/lib/i18n";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const lang = getLocale();
  return (
    <div className="bg-cream">
      <div className="container-site grid min-h-[calc(100vh-5rem)] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16">
        <div className="hidden lg:block">
          <div className="relative mb-8 h-20 w-64">
            <span className="absolute -left-3 -top-3 h-20 w-20 animate-pulse rounded-full border border-gold-300/60" />
            <span className="absolute -left-1 -top-1 h-16 w-16 motion-safe:animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <Link href="/" className="relative z-10 block h-14 w-64 pt-3">
              <Image src="/images/logo.svg" alt="PJHERBAL Clinic" fill className="object-contain object-left" />
            </Link>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-brand-950">
            {t(lang, "auth.benefits.heading")}
          </h1>
          <p className="mt-4 max-w-md text-ink/60">
            {t(lang, "auth.benefits.subtitle")}
          </p>
          <ul className="mt-8 space-y-4">
            <Benefit icon={<ShieldCheck className="h-5 w-5" />} text={t(lang, "auth.benefits.authentic")} />
            <Benefit icon={<Truck className="h-5 w-5" />} text={t(lang, "auth.benefits.fastDelivery")} />
            <Benefit icon={<Leaf className="h-5 w-5" />} text={t(lang, "auth.benefits.freeDelivery")} />
            <Benefit icon={<CheckCircle2 className="h-5 w-5" />} text={t(lang, "auth.benefits.tracking")} />
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md">
           <Link href="/" className="relative mb-8 block h-12 w-56 lg:hidden">
             <span className="absolute -left-2 -top-2 h-14 w-14 animate-pulse rounded-full border border-gold-300/60" />
             <Image src="/images/logo.svg" alt="PJHERBAL Clinic" fill className="relative z-10 object-contain object-left" />
           </Link>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-brand-950">{title}</h2>
            <p className="mt-1 text-sm text-ink/55">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Benefit({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm font-medium text-brand-950">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">{icon}</span>
      {text}
    </li>
  );
}
