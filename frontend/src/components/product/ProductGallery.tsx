"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-100 bg-brand-50">
        <Image
          src={images[active]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition",
                active === i
                  ? "border-brand-600 ring-2 ring-brand-200"
                  : "border-brand-100 hover:border-brand-300"
              )}
            >
              <Image
                src={img}
                alt={`${title} image ${i + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
