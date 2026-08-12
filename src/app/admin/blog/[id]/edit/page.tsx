import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <BlogForm
      editing={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        author: post.author,
        authorRole: post.authorRole || "",
        isPublished: post.isPublished,
        isFeatured: post.isFeatured,
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || "",
        readingTime: post.readingTime,
        scheduledFor: post.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : "",
      }}
    />
  );
}
