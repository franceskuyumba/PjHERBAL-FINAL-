import { Fragment, type ReactNode } from "react";
import { headingId } from "@/lib/blog";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-brand-950">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`ul-${key++}`} className="mt-3 space-y-2">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2 text-brand-950/90">
            <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            <span>{inline(item)}</span>
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flushList();
      const text = line.slice(4);
      blocks.push(
        <h3 key={key++} id={headingId(text)} className="mt-9 font-display text-2xl font-bold leading-snug text-brand-950">
          {inline(text)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      const text = line.slice(3);
      blocks.push(
        <h2 key={key++} id={headingId(text)} className="mt-11 font-display text-[1.6rem] font-bold leading-snug text-brand-950">
          {inline(text)}
        </h2>
      );
    } else if (line.startsWith("> ")) {
      flushList();
      blocks.push(
        <blockquote key={key++} className="my-6 rounded-2xl border-l-4 border-gold-500 bg-gold-50/70 px-5 py-4 text-brand-950">
          {inline(line.slice(2))}
        </blockquote>
      );
    } else if (line.startsWith("---")) {
      flushList();
      blocks.push(<hr key={key++} className="my-8 border-ink/10" />);
    } else if (line.startsWith("- ")) {
      list.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={key++} className="mt-4 text-[16.5px] leading-[1.85] text-ink/80">
          {inline(line)}
        </p>
      );
    }
  }
  flushList();

  return <div className="prose-herbal">{blocks}</div>;
}
