"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send message.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setMsg({ type: "ok", text: "Message sent! We will get back to you shortly." });
    } catch (err) {
      setMsg({ type: "err", text: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {msg && (
        <div
          className={
            msg.type === "ok"
              ? "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          }
        >
          {msg.text}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-950">Full name *</label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-950">Phone</label>
          <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-950">Email *</label>
        <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-950">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <Button type="submit" loading={loading}>
        Send message
      </Button>
    </form>
  );
}
