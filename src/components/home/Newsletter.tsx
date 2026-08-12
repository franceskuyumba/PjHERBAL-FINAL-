"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast("Please enter a valid email address", "error");
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
      toast("Welcome to the PJHERBAL newsletter!", "success");
      setEmail("");
    } else {
      toast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <section className="container-site py-16 sm:py-20">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] border border-gold-200 bg-gradient-to-br from-gold-50 via-cream to-brand-50 p-8 text-center shadow-card sm:p-12"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 text-white shadow-card">
          <Mail className="h-7 w-7" />
        </div>
        <h2 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
          Wellness tips, straight to your inbox
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-ink/60">
          Join our newsletter for exclusive offers, health articles and new product
          launches. No spam — ever.
        </p>
        <form onSubmit={submit} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            aria-label="Email address"
            className="input flex-1"
          />
          <button type="submit" disabled={loading} className="btn-gold btn-md shrink-0">
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink/45">
          <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
          Trusted by hundreds of happy subscribers
        </p>
      </motion.div>
    </section>
  );
}
