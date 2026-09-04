"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Plus, Pencil, Star, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

interface Post {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  scheduledFor: string | null;
}

function statusLabel(p: Post, t: (key: string) => string): { label: string; cls: string } {
  if (!p.isPublished) return { label: t("admin2.blogManager.statusDraft"), cls: "bg-slate-100 text-slate-600" };
  if (p.scheduledFor && new Date(p.scheduledFor) > new Date()) {
    return { label: t("admin2.blogManager.statusScheduled").replace("{date}", formatDate(p.scheduledFor)), cls: "bg-blue-100 text-blue-700" };
  }
  return { label: t("admin2.blogManager.statusPublished"), cls: "bg-green-100 text-green-700" };
}

export function AdminBlogManager() {
  const { t } = useI18n();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/admin/blog");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onToggle = async (p: Post) => {
    await fetch(`/api/admin/blog/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !p.isPublished }),
    });
    load();
  };

  const onToggleFeatured = async (p: Post) => {
    await fetch(`/api/admin/blog/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !p.isFeatured }),
    });
    load();
  };

  const onDelete = async (p: Post) => {
    if (!confirm(t("admin2.blogManager.deleteConfirm").replace("{title}", p.title))) return;
    await fetch(`/api/admin/blog/${p.id}`, { method: "DELETE" });
    load();
  };

  const replaceCover = async (post: Post, file: File) => {
    const form = new FormData();
    form.append("files", file);
    const upload = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const uploadData = await upload.json();
    if (!upload.ok || !uploadData.urls?.[0]) { alert(uploadData.error || "Cover photo upload failed."); return; }
    const save = await fetch(`/api/admin/blog/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coverImage: uploadData.urls[0] }) });
    if (!save.ok) { const data = await save.json(); alert(data.error || "Could not save cover photo."); return; }
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin2.blogManager.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin2.blogManager.postCount").replace("{count}", String(posts.length))}</p>
        </div>
        <a href="/admin/blog/new" className="btn-primary btn-sm">
          <Plus className="h-4 w-4" /> {t("admin2.blogManager.newPost")}
        </a>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin2.blogManager.loading")}</p>
        ) : posts.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink/50">{t("admin2.blogManager.empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-5 py-3 font-semibold">{t("admin2.blogManager.thPost")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.blogManager.thCategory")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.blogManager.thStatus")}</th>
                  <th className="px-5 py-3 font-semibold">{t("admin2.blogManager.thLive")}</th>
                  <th className="px-5 py-3 text-right font-semibold">{t("admin2.blogManager.thActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {posts.map((p) => {
                  const st = statusLabel(p, t);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-brand-950">{p.title}</p>
                        <p className="text-xs text-ink/40">/{p.slug}</p>
                      </td>
                      <td className="px-5 py-3 text-ink/70">{p.category}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onToggle(p)}
                            className={`relative h-6 w-11 rounded-full transition-colors ${p.isPublished ? "bg-brand-600" : "bg-slate-200"}`}
                            aria-label={`Toggle publish ${p.slug}`}
                          >
                            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${p.isPublished ? "left-[22px]" : "left-0.5"}`} />
                          </button>
                          <button
                            onClick={() => onToggleFeatured(p)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${p.isFeatured ? "bg-gold-100 text-gold-700" : "text-ink/35 hover:bg-gold-50 hover:text-gold-600"}`}
                            aria-label={p.isFeatured ? "Unfeature" : "Feature"}
                            title={p.isFeatured ? t("admin2.blogManager.unfeatureTitle") : t("admin2.blogManager.featureTitle")}
                          >
                            <Star className="h-4 w-4" fill={p.isFeatured ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/admin/blog/${p.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-brand-50 hover:text-brand-700"
                            aria-label="Edit post"
                          >
                            <Pencil className="h-4 w-4" />
                          </a>
                          <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-ink/50 hover:bg-brand-50 hover:text-brand-700" aria-label="Change cover photo" title="Change cover photo">
                            <ImagePlus className="h-4 w-4" />
                            <input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) replaceCover(p, file); }} />
                          </label>
                          <button
                            onClick={() => onDelete(p)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete post"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
