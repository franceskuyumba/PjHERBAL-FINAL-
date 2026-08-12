import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Leaf, MessageCircle, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { toProductCard } from "@/lib/serializers";
import { blogCategoryToProductCategory, extractToc, normaliseCategory, publishedWhere } from "@/lib/blog";
import { getCurrentUser } from "@/lib/auth";
import { Markdown } from "@/components/blog/Markdown";
import { BlogCard, type BlogCardData } from "@/components/blog/BlogCard";
import { Toc } from "@/components/blog/Toc";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { ProductCard } from "@/components/product/ProductCard";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import type { ProductCardProduct } from "@/components/product/ProductCard";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findFirst({
    where: { slug: params.slug, ...publishedWhere() },
  });
  if (!post) return { title: "Post not found" };

  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_TZ",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
      tags: [post.category],
      images: [{ url: `${SITE.url}${post.coverImage}`, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`${SITE.url}${post.coverImage}`],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findFirst({
    where: { slug: params.slug, ...publishedWhere() },
  });
  if (!post) notFound();

  const toc = extractToc(post.content);

  const [relatedPosts, allPosts, user] = await Promise.all([
    prisma.blogPost.findMany({
      where: { id: { not: post.id }, ...publishedWhere() },
      orderBy: [{ category: "desc" }, { publishedAt: "desc" }],
      take: 8,
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true, OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }] },
      orderBy: { publishedAt: "asc" },
      select: { id: true, slug: true, title: true, publishedAt: true },
    }),
    getCurrentUser(),
  ]);

  const normalizedCategory = normaliseCategory(post.category);

  const related = relatedPosts
    .filter((r) => normaliseCategory(r.category) === normalizedCategory)
    .concat(relatedPosts.filter((r) => normaliseCategory(r.category) !== normalizedCategory))
    .slice(0, 3);

  const index = allPosts.findIndex((p) => p.id === post.id);
  const newer = index > 0 ? allPosts[index - 1] : null;
  const older = index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : null;

  let products: ProductCardProduct[] = [];
  const productCategorySlug = blogCategoryToProductCategory(normalizedCategory);
  if (productCategorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: productCategorySlug } });
    if (category) {
      const matches = await prisma.product.findMany({
        where: { status: "ACTIVE", categoryId: category.id },
        orderBy: [{ ratingCount: "desc" }, { price: "asc" }],
        take: 4,
        include: { category: true },
      });
      products = matches.map((p) => toProductCard(p));
    }
  }
  if (products.length === 0) {
    const fallback = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { ratingCount: "desc" },
      take: 4,
      include: { category: true },
    });
    products = fallback.map((p) => toProductCard(p));
  }

  const url = `${SITE.url}/blog/${post.slug}`;
  const isLoggedIn = Boolean(user);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE.url}${post.coverImage}`,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.publishedAt.toISOString(),
    author: { "@type": "Person", name: post.author, jobTitle: post.authorRole },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo.svg` },
    },
    mainEntityOfPage: url,
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readingTime}M`,
  };

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="container-site pb-16 pt-8 lg:pt-12">
        <div className="mx-auto max-w-3xl">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-ink/45" aria-label="Breadcrumb">
            <Link href="/" className="font-semibold text-brand-700 hover:underline">Home</Link>
            <span>/</span>
            <Link href="/blog" className="font-semibold text-brand-700 hover:underline">Journal</Link>
            <span>/</span>
            <span className="badge bg-brand-50 text-brand-700">{post.category}</span>
          </nav>

          <h1 className="mt-5 font-display text-3xl font-bold leading-[1.15] tracking-tight text-brand-950 sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-ink/60 sm:text-lg">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-ink/10 py-4">
            <div className="flex flex-wrap items-center gap-5 text-sm text-ink/55">
              <span className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                  {post.author
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <span>
                  <span className="block font-semibold text-brand-950">{post.author}</span>
                  {post.authorRole && <span className="block text-xs text-ink/45">{post.authorRole}</span>}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand-600" /> {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-600" /> {post.readingTime} min read
              </span>
            </div>
            <ShareButtons title={post.title} url={url} />
          </div>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[220px_1fr]">
          <Toc items={toc} />

          <div className="min-w-0 max-w-[720px]">
            <Markdown content={post.content} />

            <div className="mt-10 rounded-3xl border-l-4 border-gold-500 bg-brand-50/60 px-6 py-5">
              <p className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
                <Leaf className="h-5 w-5 text-brand-600" /> A note from our clinic
              </p>
              <p className="mt-2 text-sm leading-7 text-ink/65">
                This article is for general wellness education and is not medical advice. Always consult a
                qualified healthcare professional before starting any supplement, especially if you are
                pregnant, nursing or taking medication.
              </p>
            </div>

            {products.length > 0 && (
              <section className="mt-12" aria-labelledby="recommended-products-heading">
                <AnimatedReveal>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-gold-600" />
                    <h2 id="recommended-products-heading" className="font-display text-2xl font-bold text-brand-950">
                      Recommended products
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/55">
                    Explore supplements aligned with this topic. Add them to your cart and check out in minutes.
                  </p>
                </AnimatedReveal>
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-2">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} isLoggedIn={isLoggedIn} />
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/shop" className="btn-primary btn-md">
                    Explore all products <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={buildWhatsAppUrl({ message: `Hello PJHERBAL Clinic, I read "${post.title}" and I would like a recommendation.` })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp btn-md"
                  >
                    <MessageCircle className="h-4 w-4" /> Ask a specialist
                  </a>
                </div>
              </section>
            )}

            <nav className="mt-14 grid gap-4 sm:grid-cols-2" aria-label="Article navigation">
              {newer ? (
                <Link href={`/blog/${newer.slug}`} className="group card flex flex-col gap-1 p-5 transition-all hover:shadow-lift">
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-600">
                    <ArrowLeft className="h-3.5 w-3.5" /> Newer article
                  </span>
                  <span className="line-clamp-2 font-display text-base font-bold text-brand-950 group-hover:text-brand-700">
                    {newer.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {older ? (
                <Link href={`/blog/${older.slug}`} className="group card flex flex-col items-end gap-1 p-5 text-right transition-all hover:shadow-lift">
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-600">
                    Older article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="line-clamp-2 font-display text-base font-bold text-brand-950 group-hover:text-brand-700">
                    {older.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
            </nav>

            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-900 p-7 text-white sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-lg font-bold">Questions about your health?</p>
                <p className="mt-1 text-sm text-white/70">Talk to a PJHERBAL specialist — it is free and private.</p>
              </div>
              <a
                href={buildWhatsAppUrl({ message: `Hello PJHERBAL Clinic, I read your article "${post.title}" and have a question.` })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-ink/5 bg-white py-14">
          <div className="container-site">
            <AnimatedReveal>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Keep exploring</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-brand-950 sm:text-3xl">More from the journal</h2>
                </div>
                <Link href="/blog" className="btn-outline btn-sm hidden shrink-0 sm:inline-flex">
                  All articles <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedReveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((r, i) => (
                <BlogCard
                  key={r.id}
                  index={i}
                  post={
                    {
                      slug: r.slug,
                      title: r.title,
                      excerpt: r.excerpt,
                      coverImage: r.coverImage,
                      category: normaliseCategory(r.category),
                      author: r.author,
                      authorRole: r.authorRole,
                      publishedAt: r.publishedAt,
                      readingTime: r.readingTime,
                    } satisfies BlogCardData
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
