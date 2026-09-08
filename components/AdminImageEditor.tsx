"use client";
import { useState } from "react";

export function AdminImageEditor({ assetKey, currentUrl, label }: { assetKey: string; currentUrl: string; label: string }) {
  const [url, setUrl] = useState(currentUrl);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: assetKey, imageUrl: url }),
    });
    setSaving(false);
  }

  return (
    <div className="p-4 border rounded shadow-sm">
      <p className="font-bold">{label}</p>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 w-full my-2 rounded"
      />
      <button onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
        {saving ? "Saving..." : "Update Image"}
      </button>
    </div>
  );
}
