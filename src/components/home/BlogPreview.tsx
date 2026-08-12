import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard, type BlogCardData } from "@/components/blog/BlogCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BlogPreview({ posts }: { posts: BlogCardData[] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Wellness journal"
            title="Latest from the blog"
            subtitle="Practical health advice from our specialists."
            align="left"
            className="mb-0"
          />
          <Link href="/blog" className="btn-outline btn-md hidden shrink-0 sm:inline-flex">
            All articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
