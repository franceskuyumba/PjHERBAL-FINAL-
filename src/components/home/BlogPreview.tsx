import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard, type BlogCardData } from "@/components/blog/BlogCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLocale, t } from "@/lib/i18n";

export function BlogPreview({ posts }: { posts: BlogCardData[] }) {
  const lang = getLocale();
  if (!posts.length) return null;

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-site">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t(lang, "home.blogPreview.eyebrow")}
            title={t(lang, "home.blogPreview.title")}
            subtitle={t(lang, "home.blogPreview.subtitle")}
            align="left"
            className="mb-0"
          />
          <Link href="/blog" className="btn-outline btn-md hidden shrink-0 sm:inline-flex">
            {t(lang, "home.blogPreview.allArticles")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/blog" className="btn-outline btn-md">
            {t(lang, "home.blogPreview.allArticles")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
