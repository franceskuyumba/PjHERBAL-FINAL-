"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/context/LanguageContext";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();
  const { toast } = useToast();
  const { t } = useI18n();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast(t("home.newsletter.invalidEmail"), "error");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) {
      toast(t("home.newsletter.welcome"), "success");
      setEmail("");
    } else {
      toast(t("home.newsletter.error"), "error");
    }
  };

  return (
    <section className="container-site py-16 sm:py-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-gold-200/60 bg-gradient-to-br from-gold-50 via-cream to-sage-50 p-8 text-center shadow-elevated sm:p-14"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 text-white shadow-card">
          <Mail className="h-8 w-8" />
        </div>
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          {t("home.newsletter.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-6 text-ink-muted">
          {t("home.newsletter.subtitle")}
        </p>
        <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("home.newsletter.placeholder")}
            aria-label={t("home.newsletter.emailLabel")}
            className="input flex-1"
          />
          <button type="submit" disabled={loading} className="btn-gold btn-md shrink-0 shadow-card">
            {loading ? t("home.newsletter.subscribing") : t("home.newsletter.subscribe")}
          </button>
        </form>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-sage-600" />
          {t("home.newsletter.trusted")}
        </p>
      </motion.div>
    </section>
  );
}
