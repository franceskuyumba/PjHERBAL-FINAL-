"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Save, Settings } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

export function AdminSettingsManager() {
  const [form, setForm] = useState({ facebook: "", instagram: "", tiktok: "", x: "", heroImage: "", heroTitle: "", heroSubtitle: "", promoText: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((response) => response.json())
      .then((data) => setForm((current) => ({ ...current, ...(Object.fromEntries(Object.entries(data.settings || {}).map(([key, value]) => [key.replace("social.", "").replace("homepage.", ""), value])) as Partial<typeof current>) })))
      .finally(() => setLoading(false));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    setMessage(response.ok ? t("admin.settings.saved") : data.error || "Could not save settings.");
    setSaving(false);
  };

  if (loading) return <p className="py-12 text-center text-sm text-ink/50">{t("admin.settings.loading")}</p>;

  return (
    <form onSubmit={save} className="max-w-2xl">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-brand-600" />
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.settings.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin.settings.subtitle")}</p>
        </div>
      </div>
      <div className="mt-6 space-y-4 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
        {(["facebook", "instagram", "tiktok", "x"] as const).map((key) => (
          <label key={key} className="block text-sm font-semibold capitalize text-brand-950">
            {key === "x" ? t("admin.settings.twitter") : t(`admin.settings.${key}`)}
            <input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} placeholder={`https://${key === "x" ? "x.com" : key + ".com"}/your-account`} className="input mt-1 w-full" />
          </label>
        ))}
        <div className="border-t border-ink/10 pt-5">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-950"><ImagePlus className="h-4 w-4 text-brand-600" /> Homepage content</div>
          <div className="mt-3 space-y-3">
            {(["heroTitle", "heroSubtitle", "promoText"] as const).map((key) => (
              <label key={key} className="block text-sm font-semibold text-brand-950">
                {key === "heroTitle" ? "Hero title" : key === "heroSubtitle" ? "Hero subtitle" : "Homepage promotion"}
                <textarea value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} rows={key === "heroTitle" ? 2 : 3} className="input mt-1 w-full" placeholder="Leave blank to use the default" />
              </label>
            ))}
            <p className="text-xs text-ink/50">Use the homepage photo control to replace the hero image.</p>
          </div>
        </div>
        {message && <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800">{message}</p>}
        <button type="submit" disabled={saving} className="btn-primary"><Save className="h-4 w-4" />{saving ? t("admin.settings.saving") : t("admin.settings.save")}</button>
      </div>
    </form>
  );
}
