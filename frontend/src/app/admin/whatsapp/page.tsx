"use client";

import { useState } from "react";
import { MessageCircle, Users, Send, Megaphone, Plus, BarChart3, Clock } from "lucide-react";
import { whatsappCampaigns } from "@/lib/data/admin";
import Badge from "@/components/ui/Badge";

const audiences = [
  { id: "all", label: "All customers", count: 4800 },
  { id: "weight", label: "Weight category buyers", count: 2100 },
  { id: "cart", label: "Cart abandoners (24h)", count: 342 },
  { id: "dar", label: "Dar es Salaam customers", count: 2650 },
  { id: "vip", label: "VIP (spent > 500k TZS)", count: 310 },
];

export default function AdminWhatsAppPage() {
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState("now");

  const audience = audiences.find((a) => a.id === selectedAudience);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">WhatsApp Campaign Manager</h1>
          <p className="mt-1 text-sm text-brand-500">
            Send promotions, order updates and abandoned-cart reminders via WhatsApp.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Campaign composer */}
        <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-bold text-brand-950">Create Broadcast</h2>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-brand-900">Audience</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {audiences.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAudience(a.id)}
                  className={`rounded-xl border-2 p-3 text-left transition ${
                    selectedAudience === a.id
                      ? "border-brand-600 bg-brand-50"
                      : "border-brand-100 hover:border-brand-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-brand-900">{a.label}</p>
                  <p className="text-xs text-brand-400">{a.count} contacts</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-brand-900">Message</label>
            <div className="overflow-hidden rounded-xl border border-brand-200 bg-brand-50/60">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder={`Hello {name},\n\nSpecial offer just for you: 20% off GlucoTrim this week only!\n\nShop now: https://afyaplus.co.tz/shop\nReply HELP for support.`}
                className="w-full bg-white/60 p-4 text-sm focus:outline-none"
              />
              <div className="flex items-center justify-between px-4 py-2 text-xs text-brand-500">
                <span>Supports {`{name}`} personalization • {message.length}/4096 chars</span>
                <span className="rounded bg-[#25D366]/10 px-2 py-0.5 font-semibold text-[#1fb958]">
                  WhatsApp Template
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            >
              <option value="now">Send now</option>
              <option value="1h">Schedule: in 1 hour</option>
              <option value="3h">Schedule: in 3 hours</option>
              <option value="tomorrow">Schedule: tomorrow 9am</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1fb958]">
              <Send className="h-4 w-4" /> Send to {audience?.count} Contacts
            </button>
          </div>
          <div className="mt-4 rounded-xl bg-gold-50 p-3 text-xs text-gold-800">
            💡 Tip: Personalized messages with the customer&apos;s name see up to 3× more replies. Abandoned cart reminders should be sent within 24 hours.
          </div>
        </div>

        {/* Past campaigns */}
        <div className="space-y-4">
          <h2 className="font-display text-base font-bold text-brand-950">Campaign History</h2>
          {whatsappCampaigns.map((c) => (
            <div key={c.id} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-display text-sm font-bold text-brand-950">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" /> {c.name}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-400">{c.audience}</p>
                </div>
                <Badge
                  variant={
                    c.status === "sent" ? "green" : c.status === "active" ? "gold" : "outline"
                  }
                >
                  {c.status}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-lg bg-brand-50/60 p-2.5">
                  <p className="text-xs text-brand-400">Sent</p>
                  <p className="font-semibold text-brand-900">{c.sent.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-brand-50/60 p-2.5">
                  <p className="text-xs text-brand-400">Delivered</p>
                  <p className="font-semibold text-brand-900">{c.delivered.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-brand-50/60 p-2.5">
                  <p className="text-xs text-brand-400">Replies</p>
                  <p className="font-semibold text-brand-900">{c.replies.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-brand-50/60 p-2.5">
                  <p className="text-xs text-brand-400">Orders</p>
                  <p className="font-semibold text-gold-700">{c.conversions}</p>
                </div>
              </div>
              {c.status !== "draft" && (
                <div className="mt-3 flex items-center gap-3 text-xs text-brand-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {((c.replies / c.delivered) * 100).toFixed(1)}% reply rate
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3.5 w-3.5" /> {((c.conversions / c.delivered) * 100).toFixed(1)}% conversion
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Sent recently
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
