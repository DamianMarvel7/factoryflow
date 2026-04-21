"use client";

import { useState, useEffect } from "react";
import Icon from "@/app/components/ui/Icon";

// ── constants ─────────────────────────────────────────────────────────────────

const TICKET_COLUMNS = [
  { id: "open",               name: "Open Project" },
  { id: "pending_customer",   name: "Pending Customer" },
  { id: "pending_production", name: "Pending Production" },
  { id: "sent",               name: "Sent" },
  { id: "waiting_payment",    name: "Waiting for Payment" },
];

const COL_COLORS: Record<string, string> = {
  open:               "#6B7280",
  pending_customer:   "#D97706",
  pending_production: "#2563EB",
  sent:               "#16A34A",
  waiting_payment:    "#7C3AED",
};

const ORDER_TYPES: Record<string, { bg: string; fg: string }> = {
  Embroidery:  { bg: "#EFF4FF", fg: "#1D4ED8" },
  Printing:    { bg: "#FEF3C7", fg: "#92400E" },
  Cutting:     { bg: "#DCFCE7", fg: "#15803D" },
  Sublimation: { bg: "#FCE7F3", fg: "#9D174D" },
  Packaging:   { bg: "#E0E7FF", fg: "#3730A3" },
  Finishing:   { bg: "#F3E8FF", fg: "#6B21A8" },
};

const OWNER_COLORS: Record<string, string> = {
  AR: "#2563EB", LS: "#16A34A", RK: "#D97706",
};

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtIDR(n: number) {
  return "Rp " + Math.round(n).toLocaleString("en-US").replace(/,/g, ".");
}
function fmtIDRshort(n: number) {
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

// ── small UI ──────────────────────────────────────────────────────────────────

const TypePill = ({ type }: { type: string }) => {
  const c = ORDER_TYPES[type] || ORDER_TYPES.Embroidery;
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: c.bg, color: c.fg }}>{type}</span>
  );
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

// ── ticket card ───────────────────────────────────────────────────────────────

function TicketCard({ ticket, onClick, onDragStart, isDragging }: {
  ticket: any; onClick: () => void;
  onDragStart: (e: React.DragEvent) => void; isDragging: boolean;
}) {
  const du = ticket.dueDate ? daysUntil(ticket.dueDate) : null;
  const overdue = du !== null && du < 0;
  const soon = du !== null && du >= 0 && du <= 3;
  const total = ticket.quantity * ticket.unitPrice;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        background: "#fff", border: "1px solid var(--border)", borderRadius: 8,
        padding: 12, cursor: "grab",
        boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
        opacity: isDragging ? 0.4 : 1,
        transition: "box-shadow .12s, border-color .12s",
        position: "relative", userSelect: "none",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,24,40,0.08)";
        e.currentTarget.style.borderColor = "#D1D5DB";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(16,24,40,0.05)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      {ticket.priority === "high" && (
        <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 3, background: "var(--danger)", borderRadius: "0 2px 2px 0" }}/>
      )}
      <div>
        <div className="mono" style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 3 }}>#{ticket.id}</div>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{ticket.title}</div>
        <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{ticket.customerName || "—"}</div>
      </div>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <TypePill type={ticket.orderType || "Embroidery"}/>
        <span className="mono" style={{ fontSize: 11, color: "var(--text-2)" }}>×{ticket.quantity}</span>
      </div>
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: overdue ? "var(--danger)" : soon ? "var(--warning)" : "var(--text-2)", fontWeight: overdue ? 600 : 500 }}>
          <Icon name="calendar" size={12}/>
          {fmtDate(ticket.dueDate)}
          {overdue && du !== null && <span>· {Math.abs(du)}d late</span>}
          {soon && !overdue && du !== null && <span>· in {du}d</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {ticket.driveLink && <Icon name="drive" size={12} style={{ color: "var(--text-3)" }}/>}
          {ticket.billAttachment && <Icon name="attach" size={12} style={{ color: "var(--text-3)" }}/>}
          <Avatar id={ticket.ownerInitials || "AR"} size={20}/>
        </div>
      </div>
      {total > 0 && (
        <div className="mono" style={{ marginTop: 8, fontSize: 11, color: "var(--text-2)", fontWeight: 500 }}>
          {fmtIDRshort(total)}
        </div>
      )}
    </div>
  );
}

// ── kanban column ─────────────────────────────────────────────────────────────

function Column({ col, tickets, onOpenTicket, onDrop, dragOver, setDragOver, onDragStartTicket, draggingId }: {
  col: typeof TICKET_COLUMNS[0];
  tickets: any[];
  onOpenTicket: (t: any) => void;
  onDrop: (colId: string) => void;
  dragOver: string | null;
  setDragOver: (id: string | null) => void;
  onDragStartTicket: (id: number) => void;
  draggingId: number | null;
}) {
  const isOver = dragOver === col.id;
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
      onDragLeave={() => setDragOver(null)}
      onDrop={() => { onDrop(col.id); setDragOver(null); }}
      style={{
        display: "flex", flexDirection: "column",
        background: isOver ? "#EFF4FF" : "#F3F4F6",
        border: `1.5px dashed ${isOver ? "#93B4FD" : "#E5E7EB"}`,
        borderRadius: 10, padding: 10, minHeight: 200,
        transition: "background .12s, border-color .12s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: COL_COLORS[col.id] }}/>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.4 }}>{col.name}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-3)", background: "#fff", padding: "1px 6px", borderRadius: 999, border: "1px solid var(--border)" }}>{tickets.length}</span>
        </div>
        <button style={{ background: "transparent", border: "none", padding: 2, cursor: "pointer", color: "var(--text-3)" }}>
          <Icon name="plus" size={14}/>
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {tickets.map(t => (
          <TicketCard key={t.id} ticket={t}
            onClick={() => onOpenTicket(t)}
            onDragStart={e => { e.dataTransfer.effectAllowed = "move"; onDragStartTicket(t.id); }}
            isDragging={draggingId === t.id}
          />
        ))}
      </div>
    </div>
  );
}

// ── ticket modal ──────────────────────────────────────────────────────────────

function TicketModal({ ticket, onClose, onSave, onDelete }: {
  ticket: any; onClose: () => void;
  onSave: (t: any) => void; onDelete: (id: number) => void;
}) {
  const [draft, setDraft] = useState<any>(ticket);
  useEffect(() => setDraft(ticket), [ticket?.id]);

  const set = (k: string, v: any) => setDraft((d: any) => ({ ...d, [k]: v }));
  const total = draft.quantity * draft.unitPrice;

  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px",
    fontSize: 13, outline: "none", background: "#fff", width: "100%", color: "var(--text)",
    fontFamily: "inherit",
  };

  const colBadge = TICKET_COLUMNS.find(c => c.id === draft.status);
  const badgeTone: Record<string, { bg: string; fg: string }> = {
    waiting_payment:    { bg: "#F3E8FF", fg: "#6B21A8" },
    sent:               { bg: "#DCFCE7", fg: "#15803D" },
    pending_production: { bg: "#EFF4FF", fg: "#1D4ED8" },
    pending_customer:   { bg: "#FEF3C7", fg: "#92400E" },
  };
  const bt = badgeTone[draft.status] || { bg: "#F3F4F6", fg: "#374151" };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(17,24,39,0.4)",
      backdropFilter: "blur(2px)", zIndex: 100, display: "flex", justifyContent: "flex-end",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 540, height: "100%", background: "#fff",
        boxShadow: "-10px 0 30px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
        animation: "slideInR .2s ease",
      }}>
        <style>{`@keyframes slideInR { from { transform: translateX(30px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>#{draft.id}</div>
            <h2 style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 600, letterSpacing: -0.2 }}>Ticket details</h2>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: bt.bg, color: bt.fg }}>
              {colBadge?.name || draft.status}
            </span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", padding: 6, cursor: "pointer", color: "var(--text-2)", borderRadius: 4 }}>
              <Icon name="x" size={18}/>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Project name */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Project name</label>
            <input style={inputStyle} value={draft.title} onChange={e => set("title", e.target.value)}/>
          </div>
          {/* Customer */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Customer</label>
            <input style={inputStyle} value={draft.customerName} onChange={e => set("customerName", e.target.value)}/>
          </div>
          {/* Order type */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Order type</label>
            <select style={{ ...inputStyle, appearance: "none" }} value={draft.orderType} onChange={e => set("orderType", e.target.value)}>
              {Object.keys(ORDER_TYPES).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {/* Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Status</label>
            <select style={{ ...inputStyle, appearance: "none" }} value={draft.status} onChange={e => set("status", e.target.value)}>
              {TICKET_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {/* Quantity */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Quantity</label>
            <input style={inputStyle} type="number" value={draft.quantity} onChange={e => set("quantity", +e.target.value)}/>
          </div>
          {/* Unit price */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Unit price (IDR)</label>
            <input style={inputStyle} type="number" value={draft.unitPrice} onChange={e => set("unitPrice", +e.target.value)}/>
          </div>
          {/* Total */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Total amount</label>
            <div style={{ ...inputStyle, background: "#F8F9FA", fontFamily: "var(--mono)", fontWeight: 600 }}>{fmtIDR(total)}</div>
          </div>
          {/* Due date */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Due date</label>
            <input style={inputStyle} type="date"
              value={draft.dueDate ? new Date(draft.dueDate).toISOString().slice(0, 10) : ""}
              onChange={e => set("dueDate", e.target.value)}/>
          </div>
          {/* Owner */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Owner</label>
            <select style={{ ...inputStyle, appearance: "none" }} value={draft.ownerInitials} onChange={e => set("ownerInitials", e.target.value)}>
              {Object.entries(OWNER_COLORS).map(([id]) => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
          {/* Priority */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Priority</label>
            <select style={{ ...inputStyle, appearance: "none" }} value={draft.priority} onChange={e => set("priority", e.target.value)}>
              <option value="high">High</option>
              <option value="med">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          {/* Notes */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Overview / notes</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.5 }}
              value={draft.notes || ""}
              onChange={e => set("notes", e.target.value)}
              placeholder="Production notes, special requirements…"/>
          </div>
          {/* Google Drive */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Google Drive link</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: 6, padding: "0 10px", height: 34, background: "#fff" }}>
              <Icon name="drive" size={14} style={{ color: "#4285F4" }}/>
              <input style={{ border: "none", outline: "none", flex: 1, fontSize: 13, background: "transparent", color: "var(--text)" }}
                value={draft.driveLink || ""}
                onChange={e => set("driveLink", e.target.value)}
                placeholder="https://drive.google.com/…"/>
              {draft.driveLink && (
                <a href={draft.driveLink} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--primary)", textDecoration: "none", fontWeight: 500 }}>Open ↗</a>
              )}
            </div>
          </div>
          {/* Bill attachment */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", letterSpacing: 0.3, textTransform: "uppercase" }}>Attached payment bill</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px dashed var(--border)", borderRadius: 6, padding: "10px 12px", background: "#F8F9FA" }}>
              <Icon name="attach" size={14} style={{ color: "var(--text-2)" }}/>
              <span style={{ fontSize: 12, color: draft.billAttachment ? "var(--text)" : "var(--text-3)", flex: 1 }}>
                {draft.billAttachment || "No bill attached"}
              </span>
              <input
                type="text"
                placeholder="File name…"
                value={draft.billAttachment || ""}
                onChange={e => set("billAttachment", e.target.value)}
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: "var(--text-2)", width: 160 }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => onDelete(draft.id)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "#fff", color: "var(--danger)", border: "1px solid #FECACA", cursor: "pointer" }}>
            <Icon name="trash" size={14}/> Delete
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "#fff", color: "var(--text)", border: "1px solid var(--border)", cursor: "pointer" }}>Close</button>
            <button onClick={() => onSave(draft)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)", cursor: "pointer" }}>
              <Icon name="check" size={14}/> Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const fetchTickets = () =>
    fetch("/api/tickets").then(r => r.json()).then(d => Array.isArray(d) && setTickets(d));

  useEffect(() => { fetchTickets(); }, []);

  const filter = (t: any) => {
    const q = query.toLowerCase();
    if (q && !(t.title.toLowerCase().includes(q) || (t.customerName || "").toLowerCase().includes(q))) return false;
    if (filterType !== "All" && t.orderType !== filterType) return false;
    return true;
  };
  const filtered = tickets.filter(filter);

  const onDrop = async (colId: string) => {
    if (!dragging) return;
    setTickets(prev => prev.map(t => t.id === dragging ? { ...t, status: colId } : t));
    await fetch(`/api/tickets/${dragging}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: colId }),
    });
    setDragging(null);
  };

  const onSave = async (draft: any) => {
    await fetch(`/api/tickets/${draft.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: draft.title, customerName: draft.customerName,
        orderType: draft.orderType, quantity: draft.quantity,
        unitPrice: draft.unitPrice, priority: draft.priority,
        status: draft.status, dueDate: draft.dueDate,
        ownerInitials: draft.ownerInitials, notes: draft.notes,
        driveLink: draft.driveLink, billAttachment: draft.billAttachment,
      }),
    });
    setTickets(prev => prev.map(t => t.id === draft.id ? draft : t));
    setSelected(null);
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this ticket?")) return;
    await fetch(`/api/tickets/${id}`, { method: "DELETE" });
    setTickets(prev => prev.filter(t => t.id !== id));
    setSelected(null);
  };

  const onNew = async () => {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New project", status: "open", priority: "med" }),
    });
    const nt = await res.json();
    setTickets(prev => [nt, ...prev]);
    setSelected(nt);
  };

  const overdueCount = tickets.filter(t => {
    const du = t.dueDate ? daysUntil(t.dueDate) : null;
    return du !== null && du < 0 && t.status !== "sent";
  }).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Page header */}
      <div style={{ padding: "20px 28px 16px", background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: -0.2 }}>Tickets</h1>
            <div style={{ marginTop: 2, fontSize: 13, color: "var(--text-2)" }}>
              {tickets.length} active projects · {overdueCount} overdue
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 10px", background: "#fff", border: "1px solid var(--border)", borderRadius: 6, height: 34 }}>
              <Icon name="search" size={14} style={{ color: "var(--text-3)" }}/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tickets, customers…"
                style={{ border: "none", outline: "none", background: "transparent", height: "100%", fontSize: 13, color: "var(--text)", width: 220 }}/>
            </div>
            {/* Order type filter */}
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ height: 34, padding: "0 10px", border: "1px solid var(--border)", borderRadius: 6, background: "#fff", fontSize: 13, color: "var(--text)", outline: "none" }}>
              <option>All</option>
              {Object.keys(ORDER_TYPES).map(t => <option key={t}>{t}</option>)}
            </select>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "#fff", color: "var(--text)", border: "1px solid var(--border)", cursor: "pointer" }}>
              <Icon name="filter" size={14}/> Filters
            </button>
            <button onClick={onNew} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "var(--primary)", color: "#fff", border: "1px solid var(--primary)", cursor: "pointer" }}>
              <Icon name="plus" size={14}/> New ticket
            </button>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(240px, 1fr))", gap: 12, minWidth: 1200 }}>
          {TICKET_COLUMNS.map(col => (
            <Column key={col.id} col={col}
              tickets={filtered.filter(t => t.status === col.id)}
              onOpenTicket={t => setSelected(t)}
              onDrop={onDrop}
              dragOver={dragOver} setDragOver={setDragOver}
              onDragStartTicket={setDragging} draggingId={dragging}
            />
          ))}
        </div>
      </div>

      {selected && <TicketModal ticket={selected} onClose={() => setSelected(null)} onSave={onSave} onDelete={onDelete}/>}
    </div>
  );
}
