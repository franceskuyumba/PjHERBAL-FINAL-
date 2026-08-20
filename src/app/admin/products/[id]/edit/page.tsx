import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <ProductForm
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      editing={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId,
        price: String(product.price),
        compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : "",
        stock: String(product.stock),
        status: product.status,
        shortDescription: product.shortDescription,
        description: product.description,
        ingredients: product.ingredients || "",
        usage: product.usage || "",
        benefits: product.benefits || "",
        precautions: product.precautions || "",
        sku: product.sku,
        images: product.images.split(",").filter(Boolean).join("\n"),
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
      }}
    />
  );
}
