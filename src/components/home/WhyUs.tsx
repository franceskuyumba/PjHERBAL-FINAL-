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
    <section className="bg-surface-muted py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow={t(lang, "home.whyUs.eyebrow")}
          title={t(lang, "home.whyUs.title")}
          subtitle={t(lang, "home.whyUs.subtitle")}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {reasons.map((reason, i) => (
            <AnimatedReveal key={reason.title} delay={i * 0.08}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-ink/[0.04] bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-lift">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-50 text-gold-600">
                  {reason.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">{reason.description}</p>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
