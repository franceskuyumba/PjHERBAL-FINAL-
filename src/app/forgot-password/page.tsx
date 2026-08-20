"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await response.json();
    setMessage(data.message || data.error || "If the account exists, a reset link has been sent.");
    setResetUrl(data.resetUrl || "");
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-ink/5 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-brand-950">Forgot password?</h1>
        <p className="mt-2 text-sm text-ink/60">Enter your email and we’ll send a secure reset link.</p>
        <label className="label mt-6" htmlFor="reset-email">Email address</label>
        <input id="reset-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="input" />
        <button type="submit" className="btn-primary mt-5 w-full">Send reset link</button>
        {message && <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-800">{message}</p>}
        {resetUrl && <Link href={resetUrl.replace("http://localhost:3000", "")} className="mt-3 block break-all text-sm font-semibold text-brand-700 underline">Open development reset link</Link>}
        <Link href="/login" className="mt-6 block text-center text-sm font-semibold text-brand-700 hover:underline">Back to sign in</Link>
      </form>
    </main>
  );
}
