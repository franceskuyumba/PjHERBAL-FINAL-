import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { getLocale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your PJHERBAL Clinic account to enjoy faster checkout, order tracking and exclusive offers.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  const lang = getLocale();
  return (
    <AuthLayout title={t(lang, "auth.register.title")} subtitle={t(lang, "auth.register.subtitle")}>
      <RegisterForm />
    </AuthLayout>
  );
}
