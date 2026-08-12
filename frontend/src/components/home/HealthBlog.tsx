import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { blogPosts } from "@/lib/data/blog";
import SectionHeading from "@/components/ui/SectionHeading";

export default function HealthBlog() {
  const posts = blogPosts.slice(0, 3);
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Health Blog"
            title="Expert Wellness Tips & Advice"
            description="Educational articles written by health professionals to help you make smarter health choices."
            className="mx-0"
          />
          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-50"
          >
            All Articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {posts.map((post) => (
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
                <p className="mt-2 line-clamp-2 text-sm text-brand-500">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
