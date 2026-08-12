import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/data/categories";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/store";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) return {};
  return buildMetadata({
    title: cat.name,
    description: cat.description,
    path: `/shop/category/${cat.slug}`,
  });
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) notFound();
  const items = getProductsByCategory(cat.slug);

  return (
    <div className="bg-cream">
      <div className="bg-brand-950 py-10 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: cat.name }]}
          />
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            {cat.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-200 sm:text-base">
            {cat.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="mb-6 text-sm text-brand-600">
          <span className="font-bold text-brand-900">{items.length}</span> products in{" "}
          <span className="font-semibold">{cat.name}</span>
        </p>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
