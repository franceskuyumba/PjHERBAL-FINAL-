"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

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
  images: string;
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
  images: "",
  isBestSeller: false,
  isFeatured: false,
};

async function prepareImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size <= 2_500_000) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) return file;
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
}

export function ProductForm({
  categories,
  editing,
}: {
  categories: CategoryOption[];
  editing?: Partial<ProductFormValues> & { id?: string };
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [form, setForm] = useState<ProductFormValues>({
    ...emptyForm,
    ...(editing || {}),
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const set = (key: keyof ProductFormValues, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const removeImage = async (url: string) => {
    if (url.startsWith("/uploads/")) await fetch("/api/admin/uploads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    set("images", form.images.split(/[\n,]+/).map((value) => value.trim()).filter((value) => value && value !== url).join("\n"));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      let images = form.images;
      if (selectedFiles.length > 0) {
        setUploading(true);
        const uploadData = new FormData();
        const preparedFiles = await Promise.all(selectedFiles.map(prepareImageFile));
        preparedFiles.forEach((file) => uploadData.append("files", file));
        const uploadResponse = await fetch("/api/admin/uploads", { method: "POST", body: uploadData });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "Image upload failed.");
        images = [...images.split(/[\n,]+/).map((value) => value.trim()).filter(Boolean), ...(uploadResult.urls || [])].join("\n");
        setUploading(false);
      }
      const res = await fetch(editing?.id ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
        method: editing?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || t("admin2.productForm.saveError"));
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setErrorMsg(t("admin2.productForm.networkError"));
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">
            {editing?.id
              ? t("admin2.productForm.editTitle").replace("{title}", form.name || t("admin2.productForm.productFallback"))
              : t("admin2.productForm.newProduct")}
          </h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin2.productForm.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            {t("admin2.productForm.cancel")}
          </Button>
          <Button type="submit" loading={loading}>
            {editing?.id ? t("admin2.productForm.saveChanges") : t("admin2.productForm.createProduct")}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Section title={t("admin2.productForm.basicDetails")}>
            <Field label={t("admin2.productForm.nameLabel")}>
              <Input
                required
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!editing?.id) set("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <Field label={t("admin2.productForm.slugLabel")}>
              <Input
                required
                value={form.slug}
                onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
              />
            </Field>
            <Field label={t("admin2.productForm.categoryLabel")}>
              <select
                required
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">{t("admin2.productForm.selectCategory")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("admin2.productForm.shortDescLabel")}>
              <textarea
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                rows={2}
                placeholder={t("admin2.productForm.shortDescPlaceholder")}
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </Field>
            <Field label={t("admin2.productForm.fullDescLabel")}>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={6}
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </Field>
          </Section>

          <Section title={t("admin2.productForm.detailBlocks")}>
            <Field label={t("admin2.productForm.ingredientsLabel")}>
              <textarea value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} rows={3} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </Field>
            <Field label={t("admin2.productForm.usageLabel")}>
              <textarea value={form.usage} onChange={(e) => set("usage", e.target.value)} rows={3} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </Field>
            <Field label={t("admin2.productForm.benefitsLabel")}>
              <textarea value={form.benefits} onChange={(e) => set("benefits", e.target.value)} rows={3} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </Field>
            <Field label={t("admin2.productForm.precautionsLabel")}>
              <textarea value={form.precautions} onChange={(e) => set("precautions", e.target.value)} rows={3} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </Field>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title={t("admin2.productForm.pricingInventory")}>
            <Field label={t("admin2.productForm.priceLabel")}>
              <Input required type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} />
            </Field>
            <Field label={t("admin2.productForm.compareAtLabel")}>
              <Input type="number" min={0} value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} placeholder={t("admin2.productForm.compareAtPlaceholder")} />
            </Field>
            <Field label={t("admin2.productForm.stockLabel")}>
              <Input required type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
            </Field>
            <Field label={t("admin2.productForm.skuLabel")}>
              <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder={t("admin2.productForm.skuPlaceholder")} />
            </Field>
            <Field label={t("admin2.productForm.statusLabel")}>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                {PRODUCT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.value === "ACTIVE"
                      ? t("admin2.productForm.statusActive")
                      : s.value === "INACTIVE"
                        ? t("admin2.productForm.statusInactive")
                        : s.value === "OUT_OF_STOCK"
                          ? t("admin2.productForm.statusOutOfStock")
                          : t("admin2.productForm.statusDraft")}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title={t("admin2.productForm.marketing")}>
            <Field label={t("admin.media.photos")}>
              <textarea
                value={form.images}
                onChange={(e) => set("images", e.target.value)}
                rows={4}
                placeholder={t("admin.media.photoPlaceholder")}
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <p className="mt-1 text-xs text-ink/50">{t("admin.media.photoHint")}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.images.split(/[\n,]+/).map((value) => value.trim()).filter(Boolean).map((url) => (
                  <div key={url} className="relative overflow-hidden rounded-lg border border-ink/10 bg-cream">
                    <img src={url} alt="Product" className="aspect-square w-full object-cover" />
                    <button type="button" onClick={() => removeImage(url)} className="absolute inset-x-1 bottom-1 rounded bg-red-600/90 px-1 py-1 text-[10px] font-semibold text-white">{t("admin.media.remove")}</button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className="btn-outline btn-sm cursor-pointer">
                  {t("admin.media.chooseFiles")}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="sr-only" onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))} />
                </label>
                <label className="btn-outline btn-sm cursor-pointer">

                  <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => setSelectedFiles((current) => [...current, ...Array.from(event.target.files || [])])} />
                </label>
                {selectedFiles.length > 0 && <span className="self-center text-xs text-ink/55">{selectedFiles.length} {t("admin.media.selected")}</span>}
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {selectedFiles.map((file, index) => <img key={`${file.name}-${index}`} src={URL.createObjectURL(file)} alt={file.name} className="aspect-square rounded-lg object-cover" />)}
                </div>
              )}
              {uploading && <p className="mt-2 text-xs font-semibold text-brand-700">{t("admin.media.uploading")}</p>}
            </Field>
            <div className="space-y-3 pt-1">
              <Toggle checked={form.isBestSeller} onChange={(v) => set("isBestSeller", v)} label={t("admin2.productForm.bestSellerToggle")} />
              <Toggle checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} label={t("admin2.productForm.featuredToggle")} />
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
