import { cn } from "@/lib/utils";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", className }: SectionHeadingProps) {
  return (
    <AnimatedReveal className={cn("mb-10", align === "center" && "text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className={cn("section-subtitle", align === "center" && "mx-auto max-w-2xl")}>{subtitle}</p>}
    </AnimatedReveal>
  );
}
