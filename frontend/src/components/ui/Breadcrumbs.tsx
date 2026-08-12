import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1 text-xs">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {item.href ? (
            <Link
              href={item.href}
              className="text-brand-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gold-400">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-brand-500" />}
        </span>
      ))}
    </nav>
  );
}
