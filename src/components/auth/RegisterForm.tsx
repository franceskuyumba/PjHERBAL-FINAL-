"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.password !== form.confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Unable to create your account. Please try again.");
        return;
      }
      router.push("/customer-dashboard");
      router.refresh();
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-brand-950">
          Full name
        </label>
        <Input
          id="name"
          required
          placeholder="e.g. Neema Mwangi"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-brand-950">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-brand-950">
          Phone number
        </label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="e.g. 0712 345 678"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-brand-950">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition-colors hover:text-brand-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm" className="text-sm font-medium text-brand-950">
          Confirm password
        </label>
        <Input
          id="confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
      </div>

      <Button type="submit" fullWidth loading={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>

      <p className="pt-1 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
          Sign in
        </Link>
      </p>
    </form>
  );
}
