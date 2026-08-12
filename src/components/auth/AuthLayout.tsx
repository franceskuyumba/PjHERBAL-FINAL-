import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, Leaf, ShieldCheck, Truck } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-cream">
      <div className="container-site grid min-h-[calc(100vh-5rem)] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16">
        <div className="hidden lg:block">
          <Link href="/" className="relative mb-8 block h-14 w-64">
            <Image src="/images/logo.svg" alt="PJHERBAL Clinic" fill className="object-contain object-left" />
          </Link>
          <h1 className="font-display text-4xl font-bold leading-tight text-brand-950">
            Natural wellness, delivered to your door.
          </h1>
          <p className="mt-4 max-w-md text-ink/60">
            Trusted herbal supplements from PJHERBAL Clinic – Segerea Branch. Shop with confidence, track your
            orders, and chat with our specialists on WhatsApp.
          </p>
          <ul className="mt-8 space-y-4">
            <Benefit icon={<ShieldCheck className="h-5 w-5" />} text="Authentic, quality-tested natural products" />
            <Benefit icon={<Truck className="h-5 w-5" />} text="Fast delivery across Tanzania" />
            <Benefit icon={<Leaf className="h-5 w-5" />} text="Free delivery on orders over TZS 200,000" />
            <Benefit icon={<CheckCircle2 className="h-5 w-5" />} text="Real-time order tracking & support" />
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="relative mb-8 block h-12 w-56 lg:hidden">
            <Image src="/images/logo.svg" alt="PJHERBAL Clinic" fill className="object-contain object-left" />
          </Link>
          <div className="rounded-3xl border border-ink/5 bg-white p-8 shadow-lift">
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
