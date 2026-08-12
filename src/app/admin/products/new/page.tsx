import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <ProductForm
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
    />
  );
}
