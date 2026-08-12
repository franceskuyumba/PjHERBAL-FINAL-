"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
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
            <h1 className="font-display text-2xl font-bold text-brand-950">Welcome Back</h1>
            <p className="mt-2 text-sm text-brand-500">Log in to your AfyaPlus account</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input
              label="Phone Number or Email"
              name="identifier"
              placeholder="e.g. 0712 345 678"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-900">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-brand-600">
                <input type="checkbox" className="h-4 w-4 rounded accent-brand-600" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-brand-700 hover:underline">
                Forgot password?
              </a>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Log In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-brand-400">
            <span className="h-px flex-1 bg-brand-100" /> or <span className="h-px flex-1 bg-brand-100" />
          </div>

          <div className="grid gap-3">
            <button className="flex items-center justify-center gap-2 rounded-full border border-brand-200 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50">
              <Phone className="h-4 w-4 text-brand-600" /> Continue with Phone
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border border-brand-200 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50">
              <Mail className="h-4 w-4 text-brand-600" /> Continue with Email
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-brand-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-brand-700 hover:underline">
              Create one
            </Link>
          </p>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-brand-400">
            <Lock className="h-3 w-3" /> Secure, encrypted authentication
          </p>
        </div>
      </div>
    </div>
  );
}
