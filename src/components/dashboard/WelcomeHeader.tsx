"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/context/LanguageContext";

function greeting(t: (path: string) => string): string {
  const h = new Date().getHours();
  if (h < 5) return t("dash.welcome.workingLate");
  if (h < 12) return t("dash.welcome.goodMorning");
  if (h < 17) return t("dash.welcome.goodAfternoon");
  return t("dash.welcome.goodEvening");
}

export function WelcomeHeader({ firstName }: { firstName: string }) {
  const { t } = useI18n();
  const [greet, setGreet] = useState(t("dash.welcome.title"));

  useEffect(() => {
    setGreet(greeting(t));
  }, [t]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">
        {greet}, {firstName} 👋
      </h1>
      <p className="mt-1 text-sm text-ink/55">{t("dash.welcome.subtitle")}</p>
    </div>
  );
}
