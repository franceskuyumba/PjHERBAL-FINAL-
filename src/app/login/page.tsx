import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { getLocale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your PJHERBAL Clinic account to manage orders, track deliveries and more.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const lang = getLocale();
  return (
    <AuthLayout title={t(lang, "auth.login.title")} subtitle={t(lang, "auth.login.subtitle")}>
      <LoginForm />
    </AuthLayout>
  );
}
