"use client";

import { Facebook, Link2, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/context/LanguageContext";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const { t } = useI18n();
  const { toast } = useToast();

  const currentUrl = typeof window !== "undefined" ? window.location.href : url;
  const enc = encodeURIComponent;

  const links = [
    {
      name: t("blog.shareWhatsApp"),
      href: `https://wa.me/?text=${enc(title)}%0A${enc(currentUrl)}`,
      icon: MessageCircle,
      hover: "hover:bg-[#25D366] hover:text-white",
    },
    {
      name: t("blog.shareX"),
      href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(currentUrl)}`,
      icon: Twitter,
      hover: "hover:bg-ink hover:text-white",
    },
    {
      name: t("blog.shareFacebook"),
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(currentUrl)}`,
      icon: Facebook,
      hover: "hover:bg-[#1877F2] hover:text-white",
    },
    {
      name: t("blog.shareLinkedIn"),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(currentUrl)}`,
      icon: Linkedin,
      hover: "hover:bg-[#0A66C2] hover:text-white",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast(t("blog.linkCopied"), "success");
    } catch {
      toast(t("blog.linkCopyError"), "error");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-ink/55">{t("blog.share")}</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.name}
          className={`btn-icon border border-ink/10 bg-white text-ink/55 shadow-sm transition-colors ${l.hover}`}
        >
          <l.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label={t("blog.copyLinkAria")}
        className="btn-icon border border-ink/10 bg-white text-ink/55 shadow-sm transition-colors hover:bg-brand-600 hover:text-white"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
}
