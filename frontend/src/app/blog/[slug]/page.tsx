import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Check } from "lucide-react";
import { blogPosts } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo";
import { SITE, WHATSAPP_LINK } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppButton";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogPosts.find((b) => b.slug === params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((b) => b.slug === params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((b) => b.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-cream pb-16">
      <article className="mx-auto max-w-3xl px-4 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" /> All Articles
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-brand-500">
          <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-600">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readTime}
          </span>
          <span className="text-brand-400">By {post.author}</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-brand-950 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-brand-600">{post.excerpt}</p>

        <div className="mt-8 overflow-hidden rounded-2xl">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="mt-10 space-y-8">
          {post.content.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-bold text-brand-950 sm:text-2xl">
                {section.heading}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-brand-700">{section.body}</p>
              {section.list && (
                <ul className="mt-4 grid gap-2.5 rounded-2xl border border-brand-100 bg-white p-5">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-brand-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100">
                        <Check className="h-3 w-3 text-brand-700" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-brand-950 p-8 text-center">
          <h3 className="font-display text-xl font-bold text-white">
            Ready to take action on your health?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-300">
            Talk to a specialist today and get personalized supplement advice, or shop our
            trusted, authentic products.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
            >
              Shop Products
            </Link>
            <a
              href={WHATSAPP_LINK()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb958]"
            >
              <WhatsAppIcon className="h-4 w-4" /> Chat With Specialist
            </a>
          </div>
        </div>

        {/* Related */}
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold text-brand-950">Related Articles</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group rounded-2xl border border-brand-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-brand-50">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-brand-950 transition group-hover:text-brand-700">
                  {r.title}
                </h3>
                <p className="mt-1 text-xs text-brand-400">
                  {r.date} • {r.readTime}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
