"use client";

import { useI18n } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useI18n();

  const buttonClass = (active: boolean) =>
    cn(
      "rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-base",
      active
        ? variant === "dark"
          ? "bg-gold-500 text-brand-950 shadow-soft"
          : "bg-brand-600 text-white shadow-soft"
        : variant === "dark"
          ? "text-white/55 hover:text-white/90"
          : "text-ink-muted hover:text-ink"
    );

  return (
    <div
      className={cn(
        "flex shrink-0 items-center rounded-full border p-0.5",
        variant === "dark" ? "border-white/[0.08] bg-white/[0.04]" : "border-ink/[0.06] bg-white"
      )}
      role="group"
      aria-label="Language"
    >
      <button type="button" onClick={() => setLang("en")} className={buttonClass(lang === "en")}>
        EN
      </button>
      <button type="button" onClick={() => setLang("sw")} className={buttonClass(lang === "sw")}>
        SW
      </button>
    </div>
  );
}
