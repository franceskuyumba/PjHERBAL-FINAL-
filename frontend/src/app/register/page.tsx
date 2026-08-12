"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/customer-dashboard");
    }, 800);
  };

  return (
    <div className="bg-cream py-16">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-lift">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-brand-950">Create Account</h1>
            <p className="mt-2 text-sm text-brand-500">
              Join AfyaPlus for faster checkout, order tracking & exclusive offers
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input label="Full Name" name="name" placeholder="e.g. Asha Komba" required />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="e.g. 0712 345 678"
              hint="Used for order updates via SMS & WhatsApp"
              required
            />
            <Input label="Email Address (optional)" name="email" type="email" placeholder="you@example.com" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-900">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 pr-11 text-sm text-brand-950 placeholder:text-brand-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-xs text-brand-600">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded accent-brand-600" />
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-brand-700 underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="font-semibold text-brand-700 underline">
                Privacy Policy
              </Link>
            </label>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-700 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
