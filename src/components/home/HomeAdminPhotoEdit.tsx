"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useI18n } from "@/context/LanguageContext";

export function HomeAdminPhotoEdit({ isAdmin }: { isAdmin: boolean }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);

  if (!isAdmin) return null;

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/admin/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.urls?.[0]) throw new Error(data.error || "Upload failed");
      const save = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ heroImage: data.urls[0] }) });
      if (!save.ok) throw new Error("Could not save homepage photo");
      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : t("admin.media.uploading"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="absolute right-4 top-4 z-10 flex gap-2">
      <label className="cursor-pointer rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-800 shadow-card hover:bg-white">
        {busy ? "Uploading..." : "Change hero photo"}

        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={onPick} />
      </label>
      <label className="cursor-pointer rounded-full bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-card hover:bg-brand-700">
        Take photo

        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick} />
      </label>
    </div>
  );
}
