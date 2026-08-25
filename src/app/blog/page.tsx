import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { normaliseCategory, publishedWhere } from "@/lib/blog";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import type { BlogCardData } from "@/components/blog/BlogCard";
import { getLocale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Wellness Journal",
  description:
    "Practical health tips, herbal supplement guides and wellness advice from the PJHERBAL Clinic – Segerea Branch team. Read, learn and shop.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Wellness Journal | PJHERBAL Clinic",
    description:
      "Health tips, herbal supplement guides and wellness advice from the PJHERBAL Clinic – Segerea Branch team.",
    images: [{ url: "/images/blog/immunity.svg" }],
  },
};

export default async function BlogPage() {
  const lang = getLocale();
  const rows = await prisma.blogPost.findMany({
    where: publishedWhere(),
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
  });

  const posts: BlogCardData[] = rows.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    category: normaliseCategory(p.category),
    author: p.author,
    authorRole: p.authorRole,
    publishedAt: p.publishedAt,
    readingTime: p.readingTime,
  }));

  if (posts.length === 0) {
    return (
      <div className="bg-brand-950 py-24 text-center text-white">
        <div className="container-site">
          <p className="eyebrow">PJHERBAL Journal</p>
          <h1 className="mt-3 font-display text-3xl font-bold">{t(lang, "blog.emptyTitle")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            {t(lang, "blog.emptyText")}
          </p>
        </div>
      </div>
    );
  }

  const featured = posts[0];
  const rest = posts.slice(1);

  const countMap = new Map<string, number>();
  for (const p of posts) countMap.set(p.category, (countMap.get(p.category) || 0) + 1);
  const categories = Array.from(countMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="bg-cream">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-[#0f3d1f] to-brand-800 py-12 text-white sm:py-16">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="flex h-[400px] w-[400px] items-center justify-center rounded-full border border-gold-400/20 bg-white/5 backdrop-blur animate-[pulse_2s_ease-in-out_infinite]">
            <img src="/images/logo.svg" alt="PJHERBAL Clinic" className="h-48 w-48 object-contain drop-shadow-2xl" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 via-transparent to-transparent" />
        <div className="container-site relative text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-200">
            Karibu PJ Herbal Clinic
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">{t(lang, "blog.title")}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/70 sm:text-base">{t(lang, "blog.intro")}</p>
        </div>
      </section>

      <div className="relative -mt-8">
        <div className="container-site">
          <FeaturedPost post={featured} />
        </div>
      </div>

      <BlogExplorer posts={rest} categories={categories} />
    </div>
  );
}
