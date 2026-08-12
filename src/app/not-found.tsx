import Link from "next/link";
import { SearchX } from "lucide-react";
import { getLocale, t } from "@/lib/i18n";

export default function NotFound() {
  const lang = getLocale();
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-cream px-4">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-brand-200">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-brand-950">{t(lang, "ui.notFound.title")}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">
          {t(lang, "ui.notFound.desc")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            {t(lang, "ui.notFound.backHome")}
          </Link>
          <Link href="/shop" className="btn-outline">
            <SearchX className="mr-2 h-4 w-4" /> {t(lang, "ui.notFound.browseProducts")}
          </Link>
        </div>
      </div>
    </div>
  );
}
