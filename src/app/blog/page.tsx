import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { normaliseCategory, publishedWhere } from "@/lib/blog";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import type { BlogCardData } from "@/components/blog/BlogCard";

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
          <h1 className="mt-3 font-display text-3xl font-bold">Wellness Journal</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Articles coming soon. Check back for practical wellness guidance from the Segerea clinic team.
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
      <section className="bg-brand-950 pb-16 pt-14 text-white sm:pb-20 sm:pt-20">
        <div className="container-site text-center">
          <p className="eyebrow">PJHERBAL Journal</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            The Wellness Journal
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Practical, honest guidance for healthier living — written by the Segerea clinic team and
            paired with the products we genuinely recommend.
          </p>
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
