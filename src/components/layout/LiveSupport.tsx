"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock, Headset, Mail, MessageCircle, PackageSearch, Phone, X } from "lucide-react";
import { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";
import { useI18n } from "@/context/LanguageContext";

export function LiveSupport() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-[70] w-[calc(100vw-2.5rem)] max-w-xs overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-2xl lg:bottom-24"
            role="dialog"
            aria-label="Live support"
          >
            <div className="bg-brand-900 px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                    <Headset className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-brand-900 bg-emerald-400" />
                  </span>
                  <div>
                    <p className="text-sm font-bold">{t("live.title")}</p>
                    <p className="text-xs text-white/60">{t("live.replyTime")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close support panel"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-3">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-[#25D366] px-4 py-3 text-white transition-all hover:brightness-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>
                  <span className="block text-sm font-bold">{t("live.chatWhatsApp")}</span>
                  <span className="block text-xs text-white/85">{t("live.talkSpecialist")}</span>
                </span>
              </a>

              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <SupportLink href={`tel:${SITE.phone.replace(/\s/g, "")}`} icon={<Phone className="h-4 w-4" />} label={t("live.callUs")} />
                <SupportLink href={`mailto:${SITE.email}`} icon={<Mail className="h-4 w-4" />} label={t("live.emailUs")} />
                <SupportLink href="/customer-dashboard/orders" icon={<PackageSearch className="h-4 w-4" />} label={t("live.myOrders")} />
                <SupportLink href="/contact" icon={<Clock className="h-4 w-4" />} label={t("live.helpHours")} />
              </div>
            </div>

            <p className="border-t border-ink/5 bg-cream px-5 py-2.5 text-[11px] text-ink/50">
              {SITE.address} · {t("live.openDaily")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close live support" : "Open live support"}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", damping: 15, stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift lg:bottom-6"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />}
        <MessageCircle className="relative h-7 w-7" />
        {!open && (
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-card sm:block">
            {t("live.tooltip")}
          </span>
        )}
      </motion.button>
    </>
  );
}

function SupportLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-ink/5 bg-cream px-3 py-3 text-center transition-colors hover:border-brand-300 hover:bg-brand-50"
    >
      <span className="text-brand-700">{icon}</span>
      <span className="text-xs font-semibold text-ink/70">{label}</span>
    </Link>
  );
}
