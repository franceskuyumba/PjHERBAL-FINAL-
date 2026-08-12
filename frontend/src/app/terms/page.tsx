import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: `Terms and conditions for using the ${SITE.name} online store.`,
  path: "/terms",
});

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using ${SITE.name} ("we", "us"), you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use our services.`,
  },
  {
    title: "2. Products & Health Disclaimer",
    body: "All supplements sold are for general health and wellness purposes and are not medicines. They are not intended to diagnose, treat, cure or prevent any disease. Supplements are not a substitute for a balanced diet or professional medical advice. Always consult a qualified health professional before starting any supplement, especially if you are pregnant, breastfeeding, under 18, or taking medication.",
  },
  {
    title: "3. Orders & Pricing",
    body: "All prices are listed in Tanzanian Shillings (TZS) and include VAT. We reserve the right to correct pricing errors and to refuse or cancel any order for any reason, including suspected fraud or stock unavailability. An order is only confirmed once payment is successfully processed.",
  },
  {
    title: "4. Payment",
    body: "We accept M-Pesa, Tigo Pesa, Airtel Money, HaloPesa, CRDB Bank, NMB Bank and major credit/debit cards. Payment must be received in full before dispatch. All payment transactions are encrypted and processed through secure gateways.",
  },
  {
    title: "5. Delivery",
    body: "Delivery times are estimates, not guarantees. We deliver to all regions of Tanzania. Delivery fees are calculated at checkout based on your region. Free delivery applies to orders above the threshold stated on our website. Risk of loss passes to you upon delivery.",
  },
  {
    title: "6. Returns & Refunds",
    body: "If you receive a damaged, defective or incorrect product, contact us within 7 days of delivery. Refunds are processed to the original payment method within 5–7 business days after verification. For safety and hygiene reasons, opened supplement products cannot be returned unless defective.",
  },
  {
    title: "7. Cancellations",
    body: "You may cancel an order before it is dispatched by contacting us. Once dispatched, cancellation is not possible, but you may return the product under our returns policy.",
  },
  {
    title: "8. Intellectual Property",
    body: "All content on this website — including logos, text, images and product information — is the property of AfyaPlus and may not be reproduced without written permission.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by law, AfyaPlus shall not be liable for any indirect, incidental or consequential damages arising from the use of our products or services.",
  },
  {
    title: "10. Governing Law",
    body: "These terms are governed by the laws of the United Republic of Tanzania. Any disputes shall be subject to the exclusive jurisdiction of the courts of Tanzania.",
  },
  {
    title: "11. Contact",
    body: `Questions about these terms? Contact us at ${SITE.email} or call ${SITE.phone}.`,
  },
];

export default function TermsPage() {
  return (
    <div className="bg-cream pb-16">
      <PageHero
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our website or placing an order."
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
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
