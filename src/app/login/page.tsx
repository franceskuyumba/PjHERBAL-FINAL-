import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your PJHERBAL Clinic account to manage orders, track deliveries and more.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your account.">
      <LoginForm />
    </AuthLayout>
  );
}
