import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects your personal information.`,
  path: "/privacy-policy",
});

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly, including your name, phone number, email address and delivery address when you place an order or create an account. We also collect payment information (processed securely by our payment providers), order history and browsing behavior used to improve your experience.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to process and deliver orders, confirm payments, send order updates via SMS/WhatsApp, provide customer support, send promotional offers you opt into, and improve our website and services.",
  },
  {
    title: "3. Payment Security",
    body: "All payments are processed through secure, PCI-compliant payment gateways including M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, CRDB, NMB and card networks. We do not store your mobile money PINs, card numbers or CVV codes. All transactions are encrypted using SSL/TLS.",
  },
  {
    title: "4. WhatsApp & SMS Communications",
    body: "When you place an order, we send order confirmations and delivery updates to your phone number via SMS and/or WhatsApp. You can request to opt out of promotional messages at any time by contacting us.",
  },
  {
    title: "5. Data Sharing",
    body: "We never sell your personal data. We only share information with trusted partners who help us operate — such as delivery couriers (for shipping your order) and payment providers (to process transactions) — under strict confidentiality agreements.",
  },
  {
    title: "6. Cookies & Analytics",
    body: "We use cookies and analytics tools (Google Analytics, Meta Pixel, TikTok Pixel) to understand how visitors use our site, measure campaign performance and personalize your experience. You can control cookies through your browser settings.",
  },
  {
    title: "7. Data Retention & Your Rights",
    body: "We retain your data only as long as necessary for business and legal purposes. You have the right to access, correct or delete your personal information. Contact us to exercise any of these rights.",
  },
  {
    title: "8. Contact",
    body: `For any privacy questions, contact us at ${SITE.email} or call ${SITE.phone}.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-cream pb-16">
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy matters to us. Here's how we collect, use and protect your information."
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <p className="mb-8 text-sm text-brand-500">Last updated: {new Date().toLocaleDateString("en-TZ", { dateStyle: "long" })}</p>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-lg font-bold text-brand-950">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-600">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
