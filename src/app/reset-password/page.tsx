"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) return setMessage("Passwords do not match.");
    const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
    const data = await response.json();
    setMessage(data.message || data.error || "Password reset failed.");
  };
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-ink/5 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-brand-950">Create a new password</h1>
        <label className="label mt-6" htmlFor="new-password">New password</label>
        <input id="new-password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="input" />
        <label className="label mt-4" htmlFor="confirm-password">Confirm password</label>
        <input id="confirm-password" type="password" minLength={8} required value={confirm} onChange={(event) => setConfirm(event.target.value)} className="input" />
        <button type="submit" disabled={!token} className="btn-primary mt-5 w-full">Reset password</button>
        {message && <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-800">{message}</p>}
        <Link href="/login" className="mt-6 block text-center text-sm font-semibold text-brand-700 hover:underline">Back to sign in</Link>
      </form>
    </main>
  );
}
