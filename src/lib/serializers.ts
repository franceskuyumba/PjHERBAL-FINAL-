import type { Product } from "@prisma/client";
import type { ProductCardProduct } from "@/components/product/ProductCard";

export function toProductCard(product: Product & { category?: { name: string } | null }): ProductCardProduct {
  const [image] = product.images.split(",").filter(Boolean);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription ?? "",
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    image: image || "/images/hero.svg",
    stock: product.stock,
    rating: product.rating,
    ratingCount: product.ratingCount,
    isBestSeller: product.isBestSeller,
    categoryName: product.category?.name,
  };
}
