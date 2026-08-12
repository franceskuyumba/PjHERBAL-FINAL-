"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/context/LanguageContext";

function getRemaining(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - now.getTime());
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function CountdownTimer() {
  const { t } = useI18n();
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const timer = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  const boxes = time
    ? (["hours", "minutes", "seconds"] as const).map((unit) => pad(time[unit]))
    : ["--", "--", "--"];

  return (
    <div className="flex items-center gap-1.5" role="timer" aria-label={t("home.countdownTimer.label")}>
      {boxes.map((value, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-base font-black text-gold-300">:</span>}
          <span className="flex h-10 min-w-11 items-center justify-center rounded-lg bg-brand-950 px-2 font-mono text-lg font-bold text-gold-300 shadow-inner">
            {value}
          </span>
        </span>
      ))}
      <span className="ml-1 hidden text-[10px] font-bold uppercase tracking-widest text-white/50 sm:block">
        {t("home.countdownTimer.left")}
      </span>
    </div>
  );
}
