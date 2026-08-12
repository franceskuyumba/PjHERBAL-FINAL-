"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Pencil, Eye, Trash2, Search } from "lucide-react";
import { blogPosts } from "@/lib/data/blog";
import Badge from "@/components/ui/Badge";

export default function AdminBlogPage() {
  const [query, setQuery] = useState("");

  const filtered = blogPosts.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Blog Management</h1>
          <p className="mt-1 text-sm text-brand-500">
            Publish SEO-optimized health articles to drive organic traffic.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
          <Plus className="h-4 w-4" /> New Article
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full rounded-full border border-brand-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <FileText className="h-5 w-5" />
              </span>
              <div className="flex items-center gap-1">
                <Badge variant="outline">{post.category}</Badge>
                <Badge variant="green">Published</Badge>
              </div>
            </div>
            <h3 className="mt-3 font-display text-base font-bold text-brand-950">
              {post.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-brand-500">{post.excerpt}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-brand-400">
              <span>
                {post.author} • {post.date} • {post.readTime}
              </span>
              <span className="font-semibold text-brand-600">{post.slug.length} SEO</span>
            </div>
            <div className="mt-4 flex gap-2 border-t border-brand-100 pt-4">
              <button className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
              >
                <Eye className="h-3.5 w-3.5" /> View
              </Link>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-5 text-sm text-brand-500">
        SEO tip: Each article auto-generates meta tags, Open Graph images and schema.org
        Article markup. Target long-tail keywords like &quot;how to boost immunity in Tanzania&quot;
        for best rankings.
      </div>
    </div>
  );
}
