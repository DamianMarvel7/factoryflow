"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "./components/ui/Icon";

// ── helpers ──────────────────────────────────────────────────────────────────

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

function daysUntil(iso: string | null) {
  if (!iso) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(iso); target.setHours(0,0,0,0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── small UI primitives ───────────────────────────────────────────────────────

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 8, boxShadow: "0 1px 2px rgba(16,24,40,0.04)", ...style,
  }}>{children}</div>
);

const ORDER_TYPES: Record<string, { bg: string; fg: string }> = {
  Embroidery:  { bg: "#EFF4FF", fg: "#1D4ED8" },
  Printing:    { bg: "#FEF3C7", fg: "#92400E" },
  Cutting:     { bg: "#DCFCE7", fg: "#15803D" },
  Sublimation: { bg: "#FCE7F3", fg: "#9D174D" },
  Packaging:   { bg: "#E0E7FF", fg: "#3730A3" },
  Finishing:   { bg: "#F3E8FF", fg: "#6B21A8" },
};

const TypePill = ({ type }: { type: string }) => {
  const c = ORDER_TYPES[type] || ORDER_TYPES.Embroidery;
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px",
      borderRadius: 4, fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.fg, letterSpacing: 0.1,
    }}>{type}</span>
  );
};

const OWNER_COLORS: Record<string, string> = {
  AR: "#2563EB", LS: "#16A34A", RK: "#D97706",
};

const Avatar = ({ id, size = 22 }: { id: string; size?: number }) => (
  <span style={{
    width: size, height: size, borderRadius: 999,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: OWNER_COLORS[id] || "#6B7280", color: "#fff",
    fontSize: size * 0.42, fontWeight: 600,
    border: "2px solid #fff", boxShadow: "0 0 0 1px #E5E7EB",
  }}>{id}</span>
);

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, subTone = "neutral", accent }: {
  icon: string; label: string; value: string | number;
  sub?: React.ReactNode; subTone?: "up" | "down" | "neutral";
  accent?: { bg: string; fg: string };
}) {
  const subColors = { up: "#16A34A", down: "#DC2626", neutral: "#6B7280" };
  return (
    <Card style={{ padding: 18, display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: accent?.bg || "#EFF4FF", color: accent?.fg || "#2563EB",
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <Icon name={icon} size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginTop: 2, lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: subColors[subTone], marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>{sub}</div>}
      </div>
    </Card>
  );
}

// ── donut chart ───────────────────────────────────────────────────────────────

function Donut({ data, size = 160, stroke = 22 }: {
  data: { value: number; color: string; label: string }[];
  size?: number; stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={stroke}/>
      {data.map((d, i) => {
        const len = total > 0 ? (d.value / total) * circ : 0;
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${len} ${circ - len}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

// ── bar chart ─────────────────────────────────────────────────────────────────

const THROUGHPUT = [
  { label: "Mon", value: 12 }, { label: "Tue", value: 18 },
  { label: "Wed", value: 15 }, { label: "Thu", value: 22, highlight: true },
  { label: "Fri", value: 19 }, { label: "Sat", value: 9 }, { label: "Sun", value: 4 },
];

function BarChart({ data, height = 160 }: { data: typeof THROUGHPUT; height?: number }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "100%", alignItems: "center" }}>
            <div style={{
              width: "70%", height: `${(d.value / max) * 100}%`,
              background: d.highlight ? "var(--primary)" : "#DCE7FE",
              borderRadius: "4px 4px 0 0",
            }} title={`${d.label}: ${d.value}`} />
          </div>
          <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 500 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── status badge (bills) ──────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { bg: string; fg: string; dot: string }> = {
  paid:       { bg: "#DCFCE7", fg: "#15803D", dot: "#16A34A" },
  unpaid:     { bg: "#FEE2E2", fg: "#B91C1C", dot: "#DC2626" },
  processing: { bg: "#FEF3C7", fg: "#92400E", dot: "#D97706" },
  overdue:    { bg: "#FEE2E2", fg: "#7F1D1D", dot: "#991B1B" },
};

// ── main dashboard ────────────────────────────────────────────────────────────

export default function HomePage() {
  const [bills, setBills] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/bills").then(r => r.json()).then(d => Array.isArray(d) && setBills(d));
    fetch("/api/tickets").then(r => r.json()).then(d => Array.isArray(d) && setTickets(d));
    fetch("/api/inventory").then(r => r.json()).then(d => Array.isArray(d) && setInventory(d));
  }, []);

  // stats
  const openTickets = tickets.filter(t => t.status !== "sent" && t.status !== "waiting_payment").length;
  const unpaidTotal = bills.filter(b => b.status === "unpaid" || b.status === "processing")
    .reduce((s, b) => s + (b.amount - b.paidAmount), 0);
  const invValue = inventory.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const overdueTotal = bills.filter(b => b.status === "overdue")
    .reduce((s, b) => s + (b.amount - b.paidAmount), 0);
  const lowStockItems = inventory.filter(i => i.threshold > 0 && i.quantity < i.threshold);

  // donut data
  const donutData = [
    { label: "Paid",       color: "#16A34A", value: bills.filter(b => b.status === "paid").reduce((s, b) => s + b.paidAmount, 0) },
    { label: "Processing", color: "#D97706", value: bills.filter(b => b.status === "processing").reduce((s, b) => s + (b.amount - b.paidAmount), 0) },
    { label: "Unpaid",     color: "#DC2626", value: bills.filter(b => b.status === "unpaid").reduce((s, b) => s + b.amount, 0) },
    { label: "Overdue",    color: "#7F1D1D", value: bills.filter(b => b.status === "overdue").reduce((s, b) => s + (b.amount - b.paidAmount), 0) },
  ];
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0);

  const recentTickets = tickets.slice(0, 6);

  const today = new Date();
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()} · Bandung plant`;

  return (
    <div>
      {/* Page header */}
      <div style={{ padding: "20px 28px 16px", background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: -0.2 }}>Dashboard</h1>
            <div style={{ marginTop: 2, fontSize: 13, color: "var(--text-2)" }}>{dateStr}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "#fff", color: "var(--text)", border: "1px solid var(--border)", cursor: "pointer" }}>
              <Icon name="calendar" size={14} /> This week
            </button>
            <Link href="/tickets" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)", cursor: "pointer", textDecoration: "none" }}>
              <Icon name="plus" size={14} /> New ticket
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatCard icon="tickets" label="Open tickets" value={openTickets}
            sub={<><Icon name="trend-up" size={11}/> active projects</>} subTone="up"
            accent={{ bg: "#EFF4FF", fg: "#2563EB" }}/>
          <StatCard icon="coin" label="Unpaid bills" value={fmtIDRshort(unpaidTotal)}
            sub={`${bills.filter(b => b.status === "unpaid" || b.status === "processing").length} invoices pending`}
            subTone="neutral" accent={{ bg: "#FEF3C7", fg: "#D97706" }}/>
          <StatCard icon="package" label="Inventory value" value={fmtIDRshort(invValue)}
            sub={`${lowStockItems.length} items low stock`}
            subTone={lowStockItems.length > 0 ? "down" : "neutral"} accent={{ bg: "#DCFCE7", fg: "#16A34A" }}/>
          <StatCard icon="alert" label="Overdue bills" value={fmtIDRshort(overdueTotal)}
            sub={`${bills.filter(b => b.status === "overdue").length} vendor(s) overdue`}
            subTone="down" accent={{ bg: "#FEE2E2", fg: "#DC2626" }}/>
        </div>

        {/* Row 2: recent tickets + billing donut */}
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 16 }}>
          {/* Recent tickets */}
          <Card>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Recent tickets</h3>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{tickets.length} total projects</div>
              </div>
              <Link href="/tickets" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: "var(--text-2)", textDecoration: "none" }}>
                View all <Icon name="chevron-right" size={14}/>
              </Link>
            </div>
            {recentTickets.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>No tickets yet</div>
            ) : (
              <div>
                {recentTickets.map((t, i) => {
                  const du = t.dueDate ? daysUntil(t.dueDate) : null;
                  const overdue = du !== null && du < 0;
                  const soon = du !== null && du >= 0 && du <= 3;
                  return (
                    <div key={t.id} style={{
                      display: "grid", gridTemplateColumns: "70px 1fr 130px 90px 90px",
                      padding: "12px 18px", gap: 12, alignItems: "center",
                      borderTop: i === 0 ? "none" : "1px solid var(--border)",
                      fontSize: 13,
                    }}>
                      <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>#{t.id}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{t.customerName || "—"}</div>
                      </div>
                      <TypePill type={t.orderType || "Embroidery"}/>
                      <span style={{ fontSize: 12, color: overdue ? "var(--danger)" : soon ? "var(--warning)" : "var(--text-2)", fontWeight: overdue ? 600 : 400 }}>
                        {t.dueDate ? fmtDate(t.dueDate) : "—"}{overdue ? " · late" : ""}
                      </span>
                      <div style={{ textAlign: "right" }}>
                        <Avatar id={t.ownerInitials || "AR"}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Billing summary donut */}
          <Card>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Billing summary</h3>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                {new Date().toLocaleString("default", { month: "long" })} {new Date().getFullYear()}
              </div>
            </div>
            <div style={{ padding: 18, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Donut data={donutData} size={160} stroke={22}/>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>Total</div>
                  <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>{fmtIDRshort(donutTotal)}</div>
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                {donutData.map(d => {
                  const pct = donutTotal > 0 ? ((d.value / donutTotal) * 100).toFixed(0) : "0";
                  return (
                    <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 12, flex: 1 }}>{d.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{fmtIDRshort(d.value)}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--text-3)", width: 32, textAlign: "right" }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Row 3: throughput + low stock */}
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 16 }}>
          {/* Throughput bar chart */}
          <Card>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Production throughput</h3>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Tickets closed this week</div>
              </div>
              <div style={{ display: "flex", gap: 4, background: "#F3F4F6", padding: 2, borderRadius: 6 }}>
                {["Day", "Week", "Month"].map((x, i) => (
                  <button key={x} style={{
                    padding: "4px 10px", fontSize: 11, fontWeight: 500,
                    background: i === 1 ? "#fff" : "transparent",
                    border: "none", borderRadius: 4, cursor: "pointer",
                    boxShadow: i === 1 ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                    color: i === 1 ? "var(--text)" : "var(--text-2)",
                  }}>{x}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: 18 }}>
              <BarChart data={THROUGHPUT}/>
            </div>
          </Card>

          {/* Low stock alerts */}
          <Card>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Low stock alerts</h3>
              {lowStockItems.length > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "#FEE2E2", color: "#B91C1C" }}>
                  {lowStockItems.length} items
                </span>
              )}
            </div>
            {lowStockItems.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
                {inventory.length === 0 ? "No inventory data" : "All items sufficiently stocked"}
              </div>
            ) : (
              <div>
                {lowStockItems.slice(0, 5).map((it, i) => {
                  const pct = Math.min(100, (it.quantity / it.threshold) * 100);
                  return (
                    <div key={it.id} style={{ padding: "12px 18px", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{it.itemName}</span>
                        <span className="mono" style={{ fontSize: 12, color: "var(--danger)", fontWeight: 600 }}>
                          {it.quantity}/{it.threshold} {it.unit}
                        </span>
                      </div>
                      <div style={{ height: 4, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "var(--danger)", borderRadius: 999 }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
