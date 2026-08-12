import { MessageCircle, Search, ShoppingBag, Truck } from "lucide-react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLocale, t } from "@/lib/i18n";

export function HowItWorks() {
  const lang = getLocale();

  const steps = [
    {
      icon: <Search className="h-6 w-6" />,
      title: t(lang, "home.howItWorks.step1.title"),
      description: t(lang, "home.howItWorks.step1.description"),
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: t(lang, "home.howItWorks.step2.title"),
      description: t(lang, "home.howItWorks.step2.description"),
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: t(lang, "home.howItWorks.step3.title"),
      description: t(lang, "home.howItWorks.step3.description"),
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: t(lang, "home.howItWorks.step4.title"),
      description: t(lang, "home.howItWorks.step4.description"),
    },
  ];

  return (
    <section className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow={t(lang, "home.howItWorks.eyebrow")}
        title={t(lang, "home.howItWorks.title")}
        subtitle={t(lang, "home.howItWorks.subtitle")}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <AnimatedReveal key={step.title} delay={i * 0.1}>
            <div className="card relative h-full p-6 text-center">
              <div className="absolute right-4 top-4 font-display text-5xl font-black text-brand-50">
                {i + 1}
              </div>
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                {step.icon}
              </div>
              <h3 className="relative mt-4 font-display text-lg font-bold text-brand-950">
                {step.title}
              </h3>
              <p className="relative mt-2 text-sm leading-6 text-ink/55">{step.description}</p>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}
