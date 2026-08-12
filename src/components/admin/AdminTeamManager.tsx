"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Plus, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/context/LanguageContext";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count?: { orders: number };
}

const ROLE_LABEL_KEY: Record<string, string> = {
  ADMIN: "admin.team.owner",
  STAFF: "admin.team.staff",
};

export function AdminTeamManager() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "STAFF" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/team");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast(data.error || t("admin.team.createFailed"), "error");
      return;
    }
    toast(t("admin.team.created"));
    setForm({ name: "", email: "", phone: "", password: "", role: "STAFF" });
    setShowForm(false);
    load();
  };

  const update = async (id: string, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || t("admin.team.updateFailed"), "error");
      return;
    }
    toast(t("admin.team.updated"));
    load();
  };

  const resetPassword = async (id: string) => {
    const password = window.prompt(t("admin.team.promptPassword"));
    if (!password) return;
    await update(id, { password });
  };

  if (loading) {
    return <div className="py-10 text-center text-sm text-ink/50">{t("admin.team.loading")}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.team.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin.team.subtitle")}</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <UserPlus className="h-4 w-4" />
          {t("admin.team.addMember")}
        </Button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-brand-950">{t("admin.team.newMember")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="tname">{t("admin.team.fullName")}</label>
              <input id="tname" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("admin.team.placeholderName")} />
            </div>
            <div>
              <label className="label" htmlFor="temail">{t("admin.team.email")}</label>
              <input id="temail" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="staff@pjherbal.co.tz" />
            </div>
            <div>
              <label className="label" htmlFor="tphone">{t("admin.team.phone")}</label>
              <input id="tphone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="2557XXXXXXXX" />
            </div>
            <div>
              <label className="label" htmlFor="tpass">{t("admin.team.password")}</label>
              <input id="tpass" type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={t("admin.team.placeholderPassword")} />
            </div>
            <div>
              <label className="label" htmlFor="trole">{t("admin.team.role")}</label>
              <select id="trole" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="STAFF">{t("admin.team.staff")}</option>
                <option value="ADMIN">{t("admin.team.ownerFull")}</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>{t("admin.team.cancel")}</Button>
            <Button onClick={create} loading={saving}>
              <Plus className="h-4 w-4" />
              {t("admin.team.createAccount")}
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                <th className="px-5 py-3 font-semibold">{t("admin.team.colMember")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.team.colRole")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.team.colStatus")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.team.colOrders")}</th>
                <th className="px-5 py-3 text-right font-semibold">{t("admin.team.colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-brand-950">{user.name}</p>
                    <p className="text-xs text-ink/50">{user.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${user.role === "ADMIN" ? "bg-gold-100 text-gold-800" : "bg-brand-50 text-brand-700"}`}>
                      {user.role === "ADMIN" ? <ShieldCheck className="h-3 w-3" /> : null}
                      {ROLE_LABEL_KEY[user.role] ? t(ROLE_LABEL_KEY[user.role]) : user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {user.isActive ? t("admin.team.active") : t("admin.team.inactive")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-ink/70">{user._count?.orders ?? 0}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => resetPassword(user.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 px-2.5 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-slate-50"
                      >
                        <KeyRound className="h-3.5 w-3.5" /> {t("admin.team.resetPassword")}
                      </button>
                      <button
                        onClick={() => update(user.id, { role: user.role === "ADMIN" ? "STAFF" : "ADMIN" })}
                        className="rounded-lg border border-ink/10 px-2.5 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-slate-50"
                      >
                        {user.role === "ADMIN" ? t("admin.team.makeStaff") : t("admin.team.makeOwner")}
                      </button>
                      <button
                        onClick={() => update(user.id, { isActive: !user.isActive })}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${user.isActive ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                      >
                        {user.isActive ? t("admin.team.deactivate") : t("admin.team.activate")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
