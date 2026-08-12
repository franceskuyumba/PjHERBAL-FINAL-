import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your PJHERBAL Clinic account to enjoy faster checkout, order tracking and exclusive offers.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Join PJHERBAL Clinic for faster checkout and order tracking.">
      <RegisterForm />
    </AuthLayout>
  );
}
