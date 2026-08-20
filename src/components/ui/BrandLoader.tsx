import Image from "next/image";

export function BrandLoader({ fullPage = false, message = "Preparing your herbal wellness experience..." }: { fullPage?: boolean; message?: string }) {
  return (
    <div className={fullPage ? "flex min-h-[70vh] items-center justify-center bg-cream px-6" : "flex items-center justify-center px-6 py-16"}>
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span className="absolute inset-0 motion-safe:animate-spin motion-reduce:animate-none rounded-full border-4 border-brand-100 border-t-brand-600" />
          <span className="absolute inset-2 rounded-full border border-gold-300/70" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white p-3 shadow-lift">
            <Image src="/images/logo.svg" alt="PJHERBAL Clinic" width={80} height={80} priority className="h-full w-full object-contain" />
          </div>
        </div>
        <p className="mt-5 motion-safe:animate-pulse text-sm font-medium text-brand-800">{message}</p>
      </div>
    </div>
  );
}
