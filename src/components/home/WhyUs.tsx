import { CheckCircle2, FlaskConical, Leaf, PackageCheck } from "lucide-react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: <Leaf className="h-6 w-6" />,
    title: "Pure natural ingredients",
    description: "Carefully sourced herbs and botanicals, free from harmful additives.",
  },
  {
    icon: <FlaskConical className="h-6 w-6" />,
    title: "Quality tested",
    description: "Every batch is checked for purity, safety and consistent strength.",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Specialist guidance",
    description: "Talk to a real naturopath on WhatsApp before you buy.",
  },
  {
    icon: <PackageCheck className="h-6 w-6" />,
    title: "Genuine products",
    description: "No fakes, no shortcuts — the authentic formula you were promised.",
  },
];

export function WhyUs() {
  return (
    <section className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="Why PJHERBAL Clinic"
        title="Wellness you can trust"
        subtitle="For over a decade, families across Tanzania have trusted us for honest guidance and genuine supplements."
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
