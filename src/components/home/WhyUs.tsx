import { CheckCircle2, FlaskConical, Leaf, PackageCheck } from "lucide-react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLocale, t } from "@/lib/i18n";

export function WhyUs() {
  const lang = getLocale();

  const reasons = [
    {
      icon: <Leaf className="h-6 w-6" />,
      title: t(lang, "home.whyUs.r1.title"),
      description: t(lang, "home.whyUs.r1.description"),
    },
    {
      icon: <FlaskConical className="h-6 w-6" />,
      title: t(lang, "home.whyUs.r2.title"),
      description: t(lang, "home.whyUs.r2.description"),
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: t(lang, "home.whyUs.r3.title"),
      description: t(lang, "home.whyUs.r3.description"),
    },
    {
      icon: <PackageCheck className="h-6 w-6" />,
      title: t(lang, "home.whyUs.r4.title"),
      description: t(lang, "home.whyUs.r4.description"),
    },
  ];

  return (
    <section className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow={t(lang, "home.whyUs.eyebrow")}
        title={t(lang, "home.whyUs.title")}
        subtitle={t(lang, "home.whyUs.subtitle")}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {reasons.map((reason, i) => (
          <AnimatedReveal key={reason.title} delay={i * 0.08}>
            <div className="card flex h-full items-start gap-4 p-6 transition-shadow hover:shadow-lift">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-50 text-gold-600">
                {reason.icon}
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-brand-950">{reason.title}</h3>
                <p className="mt-1 text-sm leading-6 text-ink/55">{reason.description}</p>
              </div>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}
