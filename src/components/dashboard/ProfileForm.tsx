"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ProfileForm({ name, email, phone }: { name: string; email: string; phone: string | null }) {
  const router = useRouter();
  const [profile, setProfile] = useState({ name, phone: phone || "" });
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [pass, setPass] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [passMsg, setPassMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [savingPass, setSavingPass] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ type: "err", text: data.error || "Unable to save profile." });
        return;
      }
      setProfileMsg({ type: "ok", text: "Profile updated." });
      router.refresh();
    } catch {
      setProfileMsg({ type: "err", text: "Network error. Please try again." });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (pass.newPassword !== pass.confirm) {
      setPassMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    setSavingPass(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pass.currentPassword, newPassword: pass.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPassMsg({ type: "err", text: data.error || "Unable to change password." });
        return;
      }
      setPass({ currentPassword: "", newPassword: "", confirm: "" });
      setPassMsg({ type: "ok", text: "Password changed successfully." });
    } catch {
      setPassMsg({ type: "err", text: "Network error. Please try again." });
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950">Settings</h1>
      <p className="mt-1 text-sm text-ink/55">Update your personal information and password.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-brand-950">
            <UserRound className="h-5 w-5 text-brand-700" /> Profile details
          </h2>
          {profileMsg && (
            <div
              className={
                profileMsg.type === "ok"
                  ? "mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                  : "mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              }
            >
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-950">Full name</label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-950">Email</label>
              <Input value={email} disabled className="opacity-60" />
              <p className="text-xs text-ink/45">Email cannot be changed.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-950">Phone number</label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <Button type="submit" loading={savingProfile}>
              Save changes
            </Button>
          </form>
        </div>

        <div className="rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-brand-950">Change password</h2>
          {passMsg && (
            <div
              className={
                passMsg.type === "ok"
                  ? "mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                  : "mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              }
            >
              {passMsg.text}
            </div>
          )}
          <form onSubmit={savePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-950">Current password</label>
              <Input
                type="password"
                value={pass.currentPassword}
                onChange={(e) => setPass({ ...pass, currentPassword: e.target.value })}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-950">New password</label>
              <Input
                type="password"
                value={pass.newPassword}
                onChange={(e) => setPass({ ...pass, newPassword: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-950">Confirm new password</label>
              <Input
                type="password"
                value={pass.confirm}
                onChange={(e) => setPass({ ...pass, confirm: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" loading={savingPass}>
              Change password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
