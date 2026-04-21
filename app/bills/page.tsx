"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/app/components/ui/Icon";

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtIDR(n: number) {
  return "Rp " + Math.round(n).toLocaleString("en-US").replace(/,/g, ".");
}
function fmtIDRshort(n: number) {
  if (n >= 1e9) return "Rp " + (n / 1e9).toFixed(1).replace(/\.0$/, "") + " M";
  if (n >= 1e6) return "Rp " + (n / 1e6).toFixed(1).replace(/\.0$/, "") + " jt";
  if (n >= 1e3) return "Rp " + (n / 1e3).toFixed(0) + "rb";
  return "Rp " + n;
}
function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}
function daysUntil(iso: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(iso); target.setHours(0,0,0,0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

// ── status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; fg: string; dot: string }> = {
  paid:       { bg: "#DCFCE7", fg: "#15803D", dot: "#16A34A" },
  unpaid:     { bg: "#FEE2E2", fg: "#B91C1C", dot: "#DC2626" },
  processing: { bg: "#FEF3C7", fg: "#92400E", dot: "#D97706" },
  overdue:    { bg: "#FEE2E2", fg: "#7F1D1D", dot: "#991B1B" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || { bg: "#F3F4F6", fg: "#374151", dot: "#6B7280" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 999,
      fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.fg,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.dot, display: "inline-block" }}/>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ── KPI ───────────────────────────────────────────────────────────────────────

function KPI({ label, value, tone = "neutral" }: { label: string; value: string; tone?: string }) {
  const colors: Record<string, string> = {
    neutral: "var(--text)", green: "var(--success)", yellow: "var(--warning)", red: "var(--danger)"
  };
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: 0.3, textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: colors[tone] || colors.neutral, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

const FILTER_OPTIONS = ["All", "Unpaid", "Processing", "Paid", "Overdue"];
const iconBtnStyle: React.CSSProperties = {
  background: "transparent", border: "1px solid transparent",
  padding: 6, borderRadius: 5, cursor: "pointer",
  color: "var(--text-2)", display: "inline-flex",
};

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const fetchBills = async () => {
    const res = await fetch("/api/bills");
    const data = await res.json();
    if (Array.isArray(data)) setBills(data);
  };

  useEffect(() => { fetchBills(); }, []);

  const filtered = bills.filter(b => {
    if (filter !== "All" && b.status.toLowerCase() !== filter.toLowerCase()) return false;
    if (query && !b.vendorName.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: bills.reduce((s, b) => s + b.amount, 0),
    paid: bills.filter(b => b.status === "paid").reduce((s, b) => s + b.paidAmount, 0),
    outstanding: bills.filter(b => b.status !== "paid").reduce((s, b) => s + (b.amount - b.paidAmount), 0),
    overdue: bills.filter(b => b.status === "overdue").reduce((s, b) => s + (b.amount - b.paidAmount), 0),
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this bill?")) return;
    await fetch(`/api/bills/${id}`, { method: "DELETE" });
    fetchBills();
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ padding: "20px 28px 16px", background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: -0.2 }}>Billing</h1>
            <div style={{ marginTop: 2, fontSize: 13, color: "var(--text-2)" }}>
              {bills.length} bills · {fmtIDRshort(stats.outstanding)} outstanding
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", background: "#fff", border: "1px solid var(--border)", borderRadius: 6, height: 34 }}>
              <Icon name="search" size={14} style={{ color: "var(--text-3)" }}/>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search vendor…"
                style={{ border: "none", outline: "none", background: "transparent", height: "100%", fontSize: 13, color: "var(--text)", width: 200 }}
              />
            </div>
            <Link href="/bills/add" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500,
              borderRadius: 6, background: "var(--primary)", color: "#fff",
              textDecoration: "none",
            }}>
              <Icon name="plus" size={14}/> Add bill
            </Link>
          </div>
        </div>
        {/* KPIs */}
        <div style={{ marginTop: 14, display: "flex", gap: 36 }}>
          <KPI label="Total billed"  value={fmtIDRshort(stats.total)} />
          <KPI label="Paid"          value={fmtIDRshort(stats.paid)}  tone="green" />
          <KPI label="Outstanding"   value={fmtIDRshort(stats.outstanding)} tone="yellow" />
          <KPI label="Overdue"       value={fmtIDRshort(stats.overdue)} tone="red" />
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {/* Filter bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 4, background: "#fff", padding: 4, borderRadius: 8, border: "1px solid var(--border)" }}>
            {FILTER_OPTIONS.map(f => {
              const active = filter === f;
              const count = f === "All" ? bills.length : bills.filter(b => b.status.toLowerCase() === f.toLowerCase()).length;
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "6px 12px", fontSize: 12, fontWeight: 500,
                  background: active ? "#F3F4F6" : "transparent",
                  border: "none", borderRadius: 5, cursor: "pointer",
                  color: active ? "var(--text)" : "var(--text-2)",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  {f}
                  <span className="mono" style={{ fontSize: 10, color: "var(--text-3)" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8F9FA", borderBottom: "1px solid var(--border)" }}>
                {["Bill ID", "Vendor", "Amount", "Paid", "Production progress", "Due date", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.4, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const du = daysUntil(b.dueDate);
                const progColor = b.productionProgress >= 100 ? "#16A34A" : b.productionProgress >= 60 ? "#2563EB" : b.productionProgress > 0 ? "#D97706" : "#D1D5DB";
                const billId = "BL-" + String(b.id).padStart(4, "0");
                return (
                  <tr key={b.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{billId}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 500 }}>{b.vendorName}</div>
                      {b.note && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{b.note}</div>}
                    </td>
                    <td style={{ padding: "12px 16px", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{fmtIDR(b.amount)}</td>
                    <td style={{ padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: b.paidAmount > 0 ? "var(--success)" : "var(--text-3)" }}>
                      {b.paidAmount > 0 ? fmtIDR(b.paidAmount) : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", width: 160 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${b.productionProgress}%`, background: progColor }}/>
                        </div>
                        <span className="mono" style={{ fontSize: 11, color: "var(--text-2)", minWidth: 28 }}>{b.productionProgress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: 13, color: b.status === "overdue" ? "var(--danger)" : "var(--text)" }}>{fmtDate(b.dueDate)}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>
                        {du < 0 ? `${Math.abs(du)}d overdue` : du === 0 ? "Today" : `in ${du}d`}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={b.status}/></td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 2 }}>
                        <Link href={`/bills/${b.id}/edit`} title="Edit" style={{ ...iconBtnStyle, color: "var(--text-2)" }}>
                          <Icon name="edit" size={14}/>
                        </Link>
                        <button title="Delete" onClick={() => handleDelete(b.id)} style={iconBtnStyle}>
                          <Icon name="trash" size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
              No bills match the current filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
