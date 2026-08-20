"use client";

import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/context/LanguageContext";
import { TANZANIA_REGIONS } from "@/lib/constants";

export function CustomerDiscoveryBar() {
  const router = useRouter();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (region) params.set("region", region);
    router.push(`/shop${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="container-site relative z-10 -mt-7 pb-4 sm:-mt-10 sm:pb-8">
      <div className="rounded-3xl border border-ink/5 bg-white p-4 shadow-lift sm:p-6">
        <p className="eyebrow">{t("home.discovery.eyebrow")}</p>
        <h2 className="mt-1 font-display text-xl font-bold text-brand-950 sm:text-2xl">{t("home.discovery.title")}</h2>
        <form onSubmit={submit} className="mt-4 grid gap-3 lg:grid-cols-[1fr_220px_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("home.discovery.searchPlaceholder")} className="input h-12 w-full rounded-2xl pl-12" />
          </label>
          <label className="relative block">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-600" />
            <select value={region} onChange={(event) => setRegion(event.target.value)} className="input h-12 w-full appearance-none rounded-2xl pl-12">
              <option value="">{t("home.discovery.allTanzania")}</option>
              {TANZANIA_REGIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <button type="submit" className="btn-primary h-12 rounded-2xl px-6"><Search className="h-4 w-4" />{t("home.discovery.search")}</button>
        </form>
      </div>
    </section>
  );
}
