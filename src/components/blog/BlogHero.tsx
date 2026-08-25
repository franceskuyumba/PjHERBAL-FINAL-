import { getLocale, t } from "@/lib/i18n";

export default function BlogHero() {
  const lang = getLocale();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-[#0f3d1f] to-brand-800 py-12 text-white sm:py-16">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.06]">
        <div className="h-[600px] w-[600px] animate-[spin_60s_linear_infinite]">
          <img src="/images/logo.svg" alt="" className="h-full w-full object-contain brightness-[3]" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 via-transparent to-transparent" />
      <div className="container-site relative text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-200">
          Karibu PJ Herbal Clinic
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-gold-300 to-gold-400 bg-clip-text text-transparent">Jarida la Afya</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/70 sm:text-base">{t(lang, "blog.intro")}</p>
      </div>
    </section>
  );
}
