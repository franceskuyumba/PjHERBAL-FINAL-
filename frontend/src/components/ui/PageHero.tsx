import Breadcrumbs from "./Breadcrumbs";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  crumbs?: { label: string; href?: string }[];
}

export default function PageHero({ title, subtitle, crumbs }: PageHeroProps) {
  return (
    <div className="bg-brand-950 py-12 text-center">
      <div className="mx-auto max-w-3xl px-4">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-200 sm:text-base">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
