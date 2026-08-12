"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Check } from "lucide-react";
import { SITE, WHATSAPP_LINK } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppButton";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }, 800);
  };

  return (
    <div className="bg-cream pb-16">
      <div className="bg-brand-950 py-12 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-200 sm:text-base">
            Questions about products, orders or deliveries? We're here to help — fast.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-bold text-brand-950">Send Us a Message</h2>
          <p className="mt-1 text-sm text-brand-500">
            We typically reply within a few hours during business hours.
          </p>
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" name="name" placeholder="Your name" required />
            <Input label="Phone" name="phone" type="tel" placeholder="e.g. 0712 345 678" required />
            <div className="sm:col-span-2">
              <Input label="Email (optional)" name="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-brand-900">Topic</label>
              <select
                className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-950 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                defaultValue="Product inquiry"
              >
                <option>Product inquiry</option>
                <option>Order status</option>
                <option>Delivery issue</option>
                <option>Payment help</option>
                <option>Return / refund</option>
                <option>Wholesale / partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-brand-900">Message</label>
              <textarea
                required
                rows={5}
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-brand-950 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" loading={sending}>
                {sent ? (
                  <>
                    <Check className="h-4 w-4" /> Message Sent — We'll Reply Soon!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
            <h3 className="font-display text-base font-bold text-brand-950">Get in Touch</h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-brand-900">Call Us</p>
                  <a href={SITE.phoneHref} className="text-brand-500 hover:text-brand-700">
                    {SITE.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-brand-900">Email</p>
                  <a href={`mailto:${SITE.email}`} className="text-brand-500 hover:text-brand-700">
                    {SITE.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-brand-900">Visit Us</p>
                  <p className="text-brand-500">{SITE.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-brand-900">Hours</p>
                  <p className="text-brand-500">{SITE.hours}</p>
                </div>
              </li>
            </ul>
          </div>

          <a
            href={WHATSAPP_LINK()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl bg-[#25D366] p-6 text-white shadow-card transition hover:bg-[#1fb958]"
          >
            <div>
              <p className="font-display text-lg font-bold">Chat on WhatsApp</p>
              <p className="mt-1 text-sm text-white/90">
                Fastest way to reach us — replies in minutes.
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
