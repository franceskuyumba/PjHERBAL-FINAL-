import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import type { BlogCardData } from "./BlogCard";

export function FeaturedPost({ post }: { post: BlogCardData }) {
  return (
    <AnimatedReveal y={32}>
      <article className="group overflow-hidden rounded-[2rem] bg-brand-950 shadow-lift">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[260px] lg:min-h-[460px]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-brand-950/20 lg:to-brand-950/90" />
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <span className="badge w-fit bg-gold-500 text-brand-950">Featured article</span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">{post.category}</p>
            <Link href={`/blog/${post.slug}`}>
              <h2 className="mt-3 font-display text-3xl font-bold leading-[1.15] text-white transition-colors group-hover:text-gold-200 sm:text-4xl">
                {post.title}
              </h2>
            </Link>
            <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/70 sm:text-base">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-gold-200">
                  {post.author
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <span>
                  <span className="block font-semibold text-white">{post.author}</span>
                  {post.authorRole && <span className="block text-xs text-white/50">{post.authorRole}</span>}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.readingTime} min read
              </span>
            </div>

            <Link href={`/blog/${post.slug}`} className="btn-gold btn-md mt-8 w-fit">
              Read article <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </article>
    </AnimatedReveal>
  );
}
