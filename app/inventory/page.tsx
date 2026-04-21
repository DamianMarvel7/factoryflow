"use client";

import { useState, useEffect } from "react";
import Icon from "@/app/components/ui/Icon";

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtIDR(n: number) {
  return "Rp " + Math.round(n).toLocaleString("en-US").replace(/,/g, ".");
}
function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

// ── KPI ───────────────────────────────────────────────────────────────────────

function KPI({ label, value, tone = "neutral" }: { label: string; value: string | number; tone?: string }) {
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

const iconBtnStyle: React.CSSProperties = {
  background: "transparent", border: "1px solid transparent",
  padding: 6, borderRadius: 5, cursor: "pointer",
  color: "var(--text-2)", display: "inline-flex",
};

// ── main ──────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [showLowOnly, setShowLowOnly] = useState(false);

  const fetchInventory = () =>
    fetch("/api/inventory").then(r => r.json()).then(d => Array.isArray(d) && setItems(d));

  useEffect(() => { fetchInventory(); }, []);

  const filtered = items.filter(i => {
    if (query && !i.itemName.toLowerCase().includes(query.toLowerCase())) return false;
    if (showLowOnly && i.threshold > 0 && i.quantity >= i.threshold) return false;
    return true;
  });

  const totalValue = filtered.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const lowCount = items.filter(i => i.threshold > 0 && i.quantity < i.threshold).length;

  const update = async (id: number, patch: Record<string, any>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
    await fetch(`/api/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  };

  const del = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const add = async () => {
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemName: "New item", quantity: 0, unit: "pcs", unitPrice: 0, threshold: 0 }),
    });
    const newItem = await res.json();
    setItems(prev => [newItem, ...prev]);
    setEditing(newItem.id);
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ padding: "20px 28px 16px", background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: -0.2 }}>Inventory</h1>
            <div style={{ marginTop: 2, fontSize: 13, color: "var(--text-2)" }}>
              {items.length} SKUs tracked · {lowCount} below threshold
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", background: "#fff", border: "1px solid var(--border)", borderRadius: 6, height: 34 }}>
              <Icon name="search" size={14} style={{ color: "var(--text-3)" }}/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search items…"
                style={{ border: "none", outline: "none", background: "transparent", height: "100%", fontSize: 13, color: "var(--text)", width: 200 }}/>
            </div>
            {/* Low stock toggle */}
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-2)", cursor: "pointer", padding: "0 10px", height: 34, border: "1px solid var(--border)", borderRadius: 6, background: "#fff" }}>
              <input type="checkbox" checked={showLowOnly} onChange={e => setShowLowOnly(e.target.checked)} style={{ accentColor: "#2563EB" }}/>
              Low stock only
            </label>
            <button onClick={add} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)", cursor: "pointer" }}>
              <Icon name="plus" size={14}/> Add item
            </button>
          </div>
        </div>
        {/* KPIs */}
        <div style={{ marginTop: 14, display: "flex", gap: 36 }}>
          <KPI label="Total inventory value" value={fmtIDR(totalValue)}/>
          <KPI label="Low stock items" value={lowCount} tone={lowCount > 0 ? "red" : "neutral"}/>
          <KPI label="SKUs tracked" value={items.length}/>
          <KPI label="Last stock-take" value={items.length > 0 ? fmtDate(items[0].lastUpdated) : "—"}/>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8F9FA", borderBottom: "1px solid var(--border)" }}>
                {["SKU", "Item name", "Quantity", "Unit price", "Total value", "Threshold", "Last updated", ""].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.4, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((it, i) => {
                const low = it.threshold > 0 && it.quantity < it.threshold;
                const veryLow = it.threshold > 0 && it.quantity < it.threshold * 0.4;
                const isEdit = editing === it.id;
                const rowBg = low ? "#FEF2F2" : "transparent";
                const cell: React.CSSProperties = { padding: "12px 16px", background: rowBg };

                const inp = (val: any, onChange: (v: any) => void, type = "text", w: string | number = "auto") => (
                  <input type={type} value={val} onChange={e => onChange(type === "number" ? +e.target.value : e.target.value)}
                    style={{ width: w, padding: "4px 8px", border: "1px solid var(--border)", borderRadius: 4, fontSize: 13, outline: "none", background: "#fff", fontFamily: "inherit" }}/>
                );

                return (
                  <tr key={it.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                    <td style={cell}>
                      <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>IT-{String(it.id).padStart(3, "0")}</span>
                    </td>
                    <td style={cell}>
                      {isEdit
                        ? inp(it.itemName, v => update(it.id, { itemName: v }), "text", 220)
                        : <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                            {veryLow && <Icon name="alert" size={14} style={{ color: "var(--danger)" }}/>}
                            {it.itemName}
                          </div>}
                    </td>
                    <td style={cell}>
                      {isEdit
                        ? inp(it.quantity, v => update(it.id, { quantity: v }), "number", 80)
                        : <span className="mono" style={{ fontWeight: 600, color: low ? "var(--danger)" : "var(--text)" }}>
                            {it.quantity.toLocaleString()} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>{it.unit}</span>
                          </span>}
                    </td>
                    <td style={{ ...cell, fontVariantNumeric: "tabular-nums" }}>
                      {isEdit
                        ? inp(it.unitPrice, v => update(it.id, { unitPrice: v }), "number", 110)
                        : fmtIDR(it.unitPrice)}
                    </td>
                    <td style={{ ...cell, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                      {fmtIDR(it.quantity * it.unitPrice)}
                    </td>
                    <td style={cell}>
                      {isEdit
                        ? inp(it.threshold, v => update(it.id, { threshold: v }), "number", 70)
                        : <span className="mono" style={{ fontSize: 12, color: "var(--text-2)" }}>{it.threshold || "—"} {it.threshold ? it.unit : ""}</span>}
                    </td>
                    <td style={{ ...cell, fontSize: 12, color: "var(--text-2)" }}>{fmtDate(it.lastUpdated)}</td>
                    <td style={{ ...cell, textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 2 }}>
                        {isEdit
                          ? <button title="Done" onClick={() => setEditing(null)} style={{ ...iconBtnStyle, color: "var(--success)" }}>
                              <Icon name="check" size={14}/>
                            </button>
                          : <button title="Edit" onClick={() => setEditing(it.id)} style={iconBtnStyle}>
                              <Icon name="edit" size={14}/>
                            </button>}
                        <button title="Delete" onClick={() => del(it.id)} style={iconBtnStyle}>
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
              {items.length === 0 ? 'No inventory items yet. Click "Add item" to get started.' : "No items match."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
