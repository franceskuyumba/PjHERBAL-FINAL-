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
    <section className="bg-white py-16 sm:py-24">
      <div className="container-site">
        <SectionHeading
          eyebrow={t(lang, "home.howItWorks.eyebrow")}
          title={t(lang, "home.howItWorks.title")}
          subtitle={t(lang, "home.howItWorks.subtitle")}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <AnimatedReveal key={step.title} delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-ink/[0.04] bg-white p-7 text-center shadow-soft transition-all duration-300 hover:shadow-lift">
                <div className="absolute right-5 top-5 font-display text-5xl font-black text-sage-50">
                  {i + 1}
                </div>
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-50 text-sage-700">
                  {step.icon}
                </div>
                <h3 className="relative mt-5 font-display text-lg font-bold text-ink">
                  {step.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-6 text-ink-muted">{step.description}</p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
