"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, MessageCircle, Search, X } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useSearch } from "@/context/SearchContext";
import { useI18n } from "@/context/LanguageContext";

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const mobileLinks = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.shopAll", href: "/shop" },
  { labelKey: "nav.mensHealth", href: "/category/mens-health" },
  { labelKey: "nav.weightManagement", href: "/category/weight-management" },
  { labelKey: "nav.energyImmunity", href: "/category/energy-immunity" },
  { labelKey: "nav.womensWellness", href: "/category/womens-wellness" },
  { labelKey: "nav.brainFocus", href: "/category/brain-focus" },
  { labelKey: "nav.detoxDigestion", href: "/category/detox-digestion" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.blog", href: "/blog" },
  { labelKey: "nav.contact", href: "/contact" },
];

export function MobileMenu({ open, onClose, user }: { open: boolean; onClose: () => void; user: NavUser | null }) {
  const router = useRouter();
  const { openSearch } = useSearch();
  const { t } = useI18n();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink/40 " onClick={onClose} />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/[0.04] px-5 py-4">
              <Image src="/images/logo.svg" alt="PJHERBAL Clinic" width={160} height={36} className="h-8 w-auto" />
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-ink/60 transition-colors duration-base hover:bg-brand-50 hover:text-brand-600"
                aria-label={t("nav.ariaCloseMenu")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Search trigger */}
              <button
                onClick={() => {
                  onClose();
                  openSearch();
                }}
                className="mb-5 flex w-full items-center gap-2.5 rounded-xl border border-ink/[0.06] bg-surface-muted/50 px-4 py-3 text-sm text-ink/40 transition-all duration-base hover:border-brand-300/40 hover:bg-white hover:shadow-soft"
              >
                <Search className="h-4 w-4 shrink-0 text-brand-500" />
                <span className="truncate text-left">{t("nav.searchPlaceholder")}</span>
              </button>

              {/* Navigation links */}
              <nav className="space-y-0.5" aria-label="Mobile navigation">
                {mobileLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink/75 transition-colors duration-base hover:bg-brand-50 hover:text-brand-600"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Auth / WhatsApp actions */}
              <div className="mt-6 space-y-2 border-t border-ink/[0.04] pt-5">
                {user ? (
                  <>
                    <p className="px-3 text-sm text-ink-muted">
                      {t("nav.signedInAs")} <span className="font-semibold text-brand-700">{user.name}</span>
                    </p>
                    <Link
                      href={user.role === "ADMIN" ? "/admin" : "/customer-dashboard"}
                      onClick={onClose}
                      className="btn-primary btn-sm w-full"
                    >
                      {user.role === "ADMIN" ? t("nav.adminDashboard") : t("nav.myDashboard")}
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        onClose();
                        router.push("/");
                        router.refresh();
                      }}
                      className="btn-outline btn-sm flex w-full items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("nav.logOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={onClose} className="btn-primary btn-md w-full">
                      {t("nav.signIn")}
                    </Link>
                    <Link href="/register" onClick={onClose} className="btn-outline btn-md w-full">
                      {t("nav.createAccount")}
                    </Link>
                  </>
                )}
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp btn-md mt-2 w-full"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("nav.whatsappUs")}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
