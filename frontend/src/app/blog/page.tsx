import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/data/blog";
import PageHero from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Health Blog",
  description:
    "Expert wellness articles, health tips and supplement guides written for Tanzanians by health professionals.",
  path: "/blog",
});

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="bg-cream pb-16">
      <PageHero
        title="Health & Wellness Blog"
        subtitle="Expert advice, health tips and supplement guides to help you live better."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <div className="mx-auto max-w-7xl px-4 pt-10">
        {/* Featured post */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card transition hover:shadow-lift lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <div className="flex items-center gap-3 text-xs text-brand-500">
              <span className="rounded-full bg-gold-100 px-3 py-1 font-semibold text-gold-700">
                Featured
              </span>
              <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-600">
                {featured.category}
              </span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-brand-950 transition group-hover:text-brand-700 sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-600 sm:text-base">
              {featured.excerpt}
            </p>
            <div className="mt-5 flex items-center gap-4 text-xs text-brand-400">
              <span>{featured.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {featured.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {featured.readTime}
              </span>
            </div>
            <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-brand-700">
              Read Article <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-brand-50">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-brand-500">
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-600">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="mt-3 line-clamp-2 font-display text-base font-bold text-brand-950 transition group-hover:text-brand-700">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm text-brand-500">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-brand-400">{post.author}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900"
                  >
                    Read More <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
