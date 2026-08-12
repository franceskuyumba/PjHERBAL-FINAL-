"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Plus, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

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

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Owner",
  STAFF: "Staff",
};

export function AdminTeamManager() {
  const { toast } = useToast();
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
      toast(data.error || "Could not create team member.", "error");
      return;
    }
    toast("Team member added.");
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
      toast(data.error || "Could not update team member.", "error");
      return;
    }
    toast("Team member updated.");
    load();
  };

  const resetPassword = async (id: string) => {
    const password = window.prompt("Enter a new password (min 8 characters):");
    if (!password) return;
    await update(id, { password });
  };

  if (loading) {
    return <div className="py-10 text-center text-sm text-ink/50">Loading team…</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">Team & roles</h1>
          <p className="mt-1 text-sm text-ink/55">
            Staff accounts have back-office access without sensitive settings. Owner = full access.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <UserPlus className="h-4 w-4" />
          Add team member
        </Button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-3xl border border-ink/5 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-brand-950">New team member</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="tname">Full name *</label>
              <input id="tname" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Neema John" />
            </div>
            <div>
              <label className="label" htmlFor="temail">Email *</label>
              <input id="temail" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="staff@pjherbal.co.tz" />
            </div>
            <div>
              <label className="label" htmlFor="tphone">Phone</label>
              <input id="tphone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="2557XXXXXXXX" />
            </div>
            <div>
              <label className="label" htmlFor="tpass">Password *</label>
              <input id="tpass" type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="label" htmlFor="trole">Role</label>
              <select id="trole" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Owner (full access)</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={create} loading={saving}>
              <Plus className="h-4 w-4" />
              Create account
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                <th className="px-5 py-3 font-semibold">Member</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Orders</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
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
                      {ROLE_LABEL[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-ink/70">{user._count?.orders ?? 0}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => resetPassword(user.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 px-2.5 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-slate-50"
                      >
                        <KeyRound className="h-3.5 w-3.5" /> Reset password
                      </button>
                      <button
                        onClick={() => update(user.id, { role: user.role === "ADMIN" ? "STAFF" : "ADMIN" })}
                        className="rounded-lg border border-ink/10 px-2.5 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-slate-50"
                      >
                        {user.role === "ADMIN" ? "Make staff" : "Make owner"}
                      </button>
                      <button
                        onClick={() => update(user.id, { isActive: !user.isActive })}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${user.isActive ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
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
