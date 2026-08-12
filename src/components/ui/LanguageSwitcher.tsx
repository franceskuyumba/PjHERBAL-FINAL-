"use client";

import { useI18n } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { lang, setLang } = useI18n();

  const buttonClass = (active: boolean) =>
    cn(
      "rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors",
      active
        ? variant === "dark"
          ? "bg-gold-400 text-brand-950"
          : "bg-brand-600 text-white"
        : variant === "dark"
          ? "text-white/70 hover:text-white"
          : "text-ink/55 hover:text-ink"
    );

  return (
    <div
      className={cn(
        "flex shrink-0 items-center rounded-full border p-0.5",
        variant === "dark" ? "border-white/15 bg-white/5" : "border-ink/10 bg-white"
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
