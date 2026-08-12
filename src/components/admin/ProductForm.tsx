"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormValues {
  name: string;
  slug: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  status: string;
  shortDescription: string;
  description: string;
  ingredients: string;
  usage: string;
  benefits: string;
  precautions: string;
  sku: string;
  image: string;
  isBestSeller: boolean;
  isFeatured: boolean;
}

const emptyForm: ProductFormValues = {
  name: "",
  slug: "",
  categoryId: "",
  price: "",
  compareAtPrice: "",
  stock: "10",
  status: "ACTIVE",
  shortDescription: "",
  description: "",
  ingredients: "",
  usage: "",
  benefits: "",
  precautions: "",
  sku: "",
  image: "",
  isBestSeller: false,
  isFeatured: false,
};

export function ProductForm({
  categories,
  editing,
}: {
  categories: CategoryOption[];
  editing?: Partial<ProductFormValues> & { id?: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValues>({
    ...emptyForm,
    ...(editing || {}),
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof ProductFormValues, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(editing?.id ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
        method: editing?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Unable to save product.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">
            {editing?.id ? `Edit: ${form.name || "product"}` : "New product"}
          </h1>
          <p className="mt-1 text-sm text-ink/55">Products marked ACTIVE appear in the shop.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {editing?.id ? "Save changes" : "Create product"}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Section title="Basic details">
            <Field label="Product name *">
              <Input
                required
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!editing?.id) set("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Slug *">
              <Input
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              />
            </Field>
            <Field label="Category *">
              <select
                required
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Short description *">
              <textarea
                required
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                rows={2}
                placeholder="One or two lines shown on the product card."
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </Field>
            <Field label="Full description *">
              <textarea
                required
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={6}
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </Field>
          </Section>

          <Section title="Detail blocks (optional)">
            <Field label="Ingredients">
              <textarea value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} rows={3} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </Field>
            <Field label="Usage">
              <textarea value={form.usage} onChange={(e) => set("usage", e.target.value)} rows={3} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </Field>
            <Field label="Benefits">
              <textarea value={form.benefits} onChange={(e) => set("benefits", e.target.value)} rows={3} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </Field>
            <Field label="Precautions">
              <textarea value={form.precautions} onChange={(e) => set("precautions", e.target.value)} rows={3} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </Field>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Pricing & inventory">
            <Field label="Price (TZS) *">
              <Input required type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} />
            </Field>
            <Field label="Compare-at price (TZS)">
              <Input type="number" min={0} value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} placeholder="Optional, shown struck through" />
            </Field>
            <Field label="Stock *">
              <Input required type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
            </Field>
            <Field label="SKU">
              <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="Auto-generated if empty" />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                {PRODUCT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Marketing">
            <Field label="Image path">
              <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="/images/products/slug.svg" />
            </Field>
            <div className="space-y-3 pt-1">
              <Toggle checked={form.isBestSeller} onChange={(v) => set("isBestSeller", v)} label="Mark as Best Seller" />
              <Toggle checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} label="Mark as Featured" />
            </div>
          </Section>
        </div>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
      <h2 className="mb-4 font-display text-lg font-bold text-brand-950">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-brand-950">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm font-medium text-brand-950">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-brand-700" />
    </label>
  );
}
