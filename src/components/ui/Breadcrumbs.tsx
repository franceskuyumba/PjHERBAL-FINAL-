import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-site">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink/50">
        <li>
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-brand-700">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {crumbs.map((crumb, i) => (
          <Fragment key={i}>
            <ChevronRight className="h-3.5 w-3.5 text-ink/25" />
            <li>
              {crumb.href && i < crumbs.length - 1 ? (
                <Link href={crumb.href} className="transition-colors hover:text-brand-700">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-brand-900">{crumb.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
