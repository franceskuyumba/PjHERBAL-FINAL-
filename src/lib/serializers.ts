import type { Product } from "@prisma/client";
import type { ProductCardProduct } from "@/components/product/ProductCard";
import { parseProductImages } from "@/lib/product-images";

export function toProductCard(product: Product & { category?: { name: string } | null }): ProductCardProduct {
  const [image] = parseProductImages(product.images);
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
