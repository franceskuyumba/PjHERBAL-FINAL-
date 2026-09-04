"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  isActive: boolean;
}

export function AdminCategoriesManager() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch("/api/admin/categories");
    const data = await response.json();
    if (response.ok) setCategories(data.categories || []);
    else toast(data.error || "Could not load categories.", "error");
  };

  useEffect(() => { load(); }, []);

  const update = async (category: Category, changes: Partial<Category>) => {
    setSaving(category.id);
    const response = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: category.id, ...changes }),
    });
    const data = await response.json();
    if (!response.ok) toast(data.error || "Could not save category.", "error");
    else {
      setCategories((current) => current.map((item) => item.id === category.id ? { ...item, ...changes } : item));
      toast("Category updated.", "success");
    }
    setSaving(null);
  };

  const upload = async (category: Category, file: File) => {
    setSaving(category.id);
    const form = new FormData();
    form.append("files", file);
    const uploadResponse = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok || !uploadData.urls?.[0]) {
      toast(uploadData.error || "Photo upload failed.", "error");
      setSaving(null);
      return;
    }
    await update(category, { image: uploadData.urls[0] });
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">Category photos</h1>
      <p className="mt-1 text-sm text-ink/55">Replace the category image and edit the customer-facing description.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="rounded-3xl border border-ink/5 bg-white p-5 shadow-card">
            <div className="flex gap-4">
              <img src={category.image} alt={category.name} className="h-24 w-24 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <input value={category.name} onChange={(event) => setCategories((current) => current.map((item) => item.id === category.id ? { ...item, name: event.target.value } : item))} className="input font-semibold" />
                <textarea value={category.description} onChange={(event) => setCategories((current) => current.map((item) => item.id === category.id ? { ...item, description: event.target.value } : item))} rows={2} className="input mt-2 text-sm" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <label className="btn-outline btn-sm cursor-pointer"><ImagePlus className="h-4 w-4" /> Change photo<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(category, file); }} /></label>
              <button type="button" disabled={saving === category.id} onClick={() => update(category, { name: category.name, description: category.description })} className="btn-primary btn-sm"><Save className="h-4 w-4" /> Save details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
