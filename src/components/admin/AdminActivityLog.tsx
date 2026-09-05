"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useI18n } from "@/context/LanguageContext";

interface ActivityRow {
  id: string;
  actorName: string | null;
  role: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  details: string | null;
  ip: string | null;
  createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-blue-50 text-blue-700",
  ORDER_CREATE: "bg-emerald-50 text-emerald-700",
  ORDER_UPDATE: "bg-amber-50 text-amber-700",
  PAYMENT_UPDATE: "bg-violet-50 text-violet-700",
  PRODUCT_CREATE: "bg-brand-50 text-brand-700",
  PRODUCT_UPDATE: "bg-brand-50 text-brand-700",
  PRODUCT_DELETE: "bg-red-50 text-red-700",
  COUPON_CREATE: "bg-gold-100 text-gold-800",
  COUPON_UPDATE: "bg-gold-100 text-gold-800",
  STAFF_CREATE: "bg-teal-50 text-teal-700",
  STAFF_UPDATE: "bg-teal-50 text-teal-700",
  SYSTEM: "bg-ink/5 text-ink/60",
};

export function AdminActivityLog() {
  const { t } = useI18n();
  const [logs, setLogs] = useState<ActivityRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    const res = await fetch(`/api/admin/activity?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    setLoading(true);
    const t = debounce.current;
    if (t) clearTimeout(t);
    debounce.current = setTimeout(() => {
      load();
    }, search ? 300 : 0);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [search, page, load]);

  const pageCount = Math.max(1, Math.ceil(total / 50));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-950">{t("admin.activity.title")}</h1>
          <p className="mt-1 text-sm text-ink/55">{t("admin.activity.subtitle")}</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            className="input pl-9"
            placeholder={t("admin.activity.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-card">
        <div className="overflow-x-auto">
          <div className="w-full overflow-x-auto"><table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-slate-50 text-xs uppercase tracking-wide text-ink/40">
                <th className="px-5 py-3 font-semibold">{t("admin.activity.colWhen")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.activity.colAction")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.activity.colActor")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.activity.colEntity")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin.activity.colDetails")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink/50">
                    {loading ? t("admin.activity.loading") : t("admin.activity.empty")}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-ink/55">{formatDateTime(log.createdAt)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-700"}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-brand-950">{log.actorName || t("admin.activity.system")}</p>
                      {log.role && <p className="text-xs text-ink/45">{log.role}</p>}
                    </td>
                    <td className="px-5 py-3 text-ink/70">
                      {log.entity ? `${log.entity}${log.entityId ? "…" : ""}` : "—"}
                    </td>
                    <td className="max-w-xs truncate px-5 py-3 text-ink/65">{log.details || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table></div>
        </div>
      </div>

      {total > 50 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-ink/50">{t("admin.activity.entries").replace("{count}", String(total))}</p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-ink/10 px-3 py-1.5 font-semibold disabled:opacity-40"
            >
              {t("admin.activity.previous")}
            </button>
            <span className="px-2 py-1.5 text-ink/55">
              {t("admin.activity.page").replace("{page}", String(page)).replace("{count}", String(pageCount))}
            </span>
            <button
              disabled={page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-ink/10 px-3 py-1.5 font-semibold disabled:opacity-40"
            >
              {t("admin.activity.next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
