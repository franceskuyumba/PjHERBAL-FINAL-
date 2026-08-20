"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { slugify } from "@/lib/utils";
import { BLOG_CATEGORIES } from "@/lib/blog";
import { useI18n } from "@/context/LanguageContext";

interface BlogValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  authorRole: string;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  readingTime: number;
  scheduledFor: string;
}

const empty: BlogValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "",
  author: "",
  authorRole: "",
  isPublished: true,
  isFeatured: false,
  seoTitle: "",
  seoDescription: "",
  readingTime: 4,
  scheduledFor: "",
};

export function BlogForm({ editing }: { editing?: Partial<BlogValues> & { id?: string } }) {
  const router = useRouter();
  const { t } = useI18n();
  const [form, setForm] = useState<BlogValues>({ ...empty, ...(editing || {}) });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const set = <K extends keyof BlogValues>(k: K, v: BlogValues[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
        let coverImage = form.coverImage;
        if (coverFile) {
          const upload = new FormData();
          upload.append("files", coverFile);
          const uploadResponse = await fetch("/api/admin/uploads", { method: "POST", body: upload });
          const uploadData = await uploadResponse.json();
          if (!uploadResponse.ok) throw new Error(uploadData.error || "Cover image upload failed.");
          coverImage = uploadData.urls?.[0] || coverImage;
        }
        const res = await fetch(editing?.id ? `/api/admin/blog/${editing.id}` : "/api/admin/blog", {
        method: editing?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coverImage: coverImage || `/images/blog/${form.slug || "post"}.svg`,
          scheduledFor: form.scheduledFor ? new Date(form.scheduledFor).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("admin2.blogForm.saveError"));
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">
            {editing?.id
              ? t("admin2.blogForm.editTitle").replace("{title}", form.title || t("admin2.blogForm.postFallback"))
              : t("admin2.blogForm.newPost")}
          </h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin2.blogForm.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
            {t("admin2.blogForm.cancel")}
          </Button>
          <Button type="submit" loading={loading}>
            {editing?.id ? t("admin2.blogForm.saveChanges") : t("admin2.blogForm.createPost")}
          </Button>
        </div>
      </div>

      {errorMsg && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</div>}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
          <Field label={t("admin2.blogForm.titleLabel")}>
            <Input
              required
              value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!editing?.id) set("slug", slugify(e.target.value));
              }}
            />
          </Field>
          <Field label={t("admin2.blogForm.slugLabel")}>
            <Input required value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
          </Field>
          <Field label={t("admin2.blogForm.excerptLabel")}>
            <textarea
              required
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              maxLength={300}
              className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <p className="text-right text-xs text-ink/40">{form.excerpt.length}/300</p>
          </Field>
          <Field label={t("admin2.blogForm.contentLabel")}>
            <textarea
              required
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={14}
              className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <p className="text-xs text-ink/45">
              {t("admin2.blogForm.mdUse")}{" "}
              <code className="rounded bg-brand-50 px-1">## Heading</code>{" "}
              {t("admin2.blogForm.mdForSections")},{" "}
              <code className="rounded bg-brand-50 px-1">### Sub-heading</code>,{" "}
              <code className="rounded bg-brand-50 px-1">- list</code>,{" "}
              <code className="rounded bg-brand-50 px-1">&gt; highlight</code>{" "}
              {t("admin2.blogForm.mdAnd")}{" "}
              <code className="rounded bg-brand-50 px-1">**bold**</code>.
            </p>
          </Field>
        </div>

        <div className="space-y-4">
          <div className="space-y-4 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <Field label={t("admin2.blogForm.categoryLabel")}>
              <select
                required
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm"
              >
                <option value="" disabled>{t("admin2.blogForm.selectCategory")}</option>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label={t("admin2.blogForm.authorLabel")}>
              <Input required value={form.author} onChange={(e) => set("author", e.target.value)} />
            </Field>
            <Field label={t("admin2.blogForm.authorRoleLabel")}>
              <Input value={form.authorRole} onChange={(e) => set("authorRole", e.target.value)} placeholder={t("admin2.blogForm.authorRolePlaceholder")} />
            </Field>
            <Field label={t("admin2.blogForm.coverImageLabel")}>
              <Input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder={t("admin2.blogForm.coverImagePlaceholder")} />
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setCoverFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm" />
              {form.coverImage && <div className="relative mt-3 max-w-xs overflow-hidden rounded-lg border border-ink/10"><img src={form.coverImage} alt="Cover preview" className="aspect-video w-full object-cover" /><button type="button" onClick={async () => { if (form.coverImage.startsWith("/uploads/")) await fetch("/api/admin/uploads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: form.coverImage }) }); set("coverImage", ""); }} className="absolute bottom-2 left-2 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">Remove photo</button></div>}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t("admin2.blogForm.readingTimeLabel")}>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={form.readingTime}
                  onChange={(e) => set("readingTime", Number(e.target.value) || 1)}
                />
              </Field>
              <Field label={t("admin2.blogForm.scheduleForLabel")}>
                <Input
                  type="datetime-local"
                  value={form.scheduledFor}
                  onChange={(e) => set("scheduledFor", e.target.value)}
                />
              </Field>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-ink/10 bg-cream px-4 py-3">
                <span>
                  <span className="block text-sm font-medium text-brand-950">{t("admin2.blogForm.publishNow")}</span>
                  <span className="block text-xs text-ink/45">{t("admin2.blogForm.publishNowHint")}</span>
                </span>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => {
                    set("isPublished", e.target.checked);
                    if (e.target.checked) set("scheduledFor", "");
                  }}
                  className="h-4 w-4 accent-brand-700"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gold-300 bg-gold-50 px-4 py-3">
                <span>
                  <span className="block text-sm font-medium text-brand-950">{t("admin2.blogForm.featureHome")}</span>
                  <span className="block text-xs text-ink/45">{t("admin2.blogForm.featureHomeHint")}</span>
                </span>
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => set("isFeatured", e.target.checked)}
                  className="h-4 w-4 accent-gold-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
            <p className="text-sm font-bold text-brand-950">{t("admin2.blogForm.seoSettings")}</p>
            <Field label={t("admin2.blogForm.seoTitleLabel")}>
              <Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} maxLength={160} placeholder={t("admin2.blogForm.seoTitlePlaceholder")} />
            </Field>
            <Field label={t("admin2.blogForm.seoDescriptionLabel")}>
              <textarea
                value={form.seoDescription}
                onChange={(e) => set("seoDescription", e.target.value)}
                rows={3}
                maxLength={300}
                className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                placeholder={t("admin2.blogForm.seoDescriptionPlaceholder")}
              />
            </Field>
          </div>
        </div>
      </div>
    </form>
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
