"use client";

import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-cream px-4">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-brand-950">{t("ui.error.defaultTitle")}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">{t("ui.error.desc")}</p>
        <button onClick={reset} className="btn-primary mt-6">
          {t("ui.error.retry")}
        </button>
      </div>
    </div>
  );
}
