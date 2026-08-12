"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  authorRole?: string | null;
  publishedAt: Date | string;
  readingTime: number;
}

export function BlogCard({ post, index = 0 }: { post: BlogCardData; index?: number }) {
  const { t } = useI18n();
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3) }}
      whileHover={{ y: -4 }}
      className="group card overflow-hidden transition-shadow hover:shadow-lift"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-brand-50">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="badge absolute left-3 top-3 bg-brand-900/80 text-gold-300 backdrop-blur">
            {post.category}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-ink/45">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span>{t("blog.minRead").replace("{n}", String(post.readingTime))}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold text-brand-950 transition-colors group-hover:text-brand-700">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/55">{post.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
            {t("blog.readArticle")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
