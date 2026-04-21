"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./ui/Icon";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/" },
  { id: "tickets",   label: "Tickets",   icon: "tickets",   href: "/tickets" },
  { id: "billing",   label: "Billing",   icon: "billing",   href: "/bills" },
  { id: "inventory", label: "Inventory", icon: "inventory", href: "/inventory" },
];

const SHORTCUTS = [
  { label: "Recent tickets", color: "#2563EB" },
  { label: "Overdue bills",  color: "#DC2626" },
  { label: "Low stock",      color: "#D97706" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      background: "#fff",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>
      {/* Brand */}
      <div style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        borderBottom: "1px solid var(--border)",
        gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: "var(--primary)", color: "#fff",
          display: "grid", placeItems: "center", flexShrink: 0,
          boxShadow: "0 1px 2px rgba(37,99,235,0.3)",
        }}>
          <Icon name="factory" size={17} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.2 }}>FactoryFlow</span>
          <span style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>Garment ops · v4.2</span>
        </div>
      </div>

      {/* Workspace switcher */}
      <div style={{ padding: "12px 12px 4px" }}>
        <button style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px", background: "#F8F9FA", border: "1px solid var(--border)",
          borderRadius: 6, cursor: "pointer", textAlign: "left",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 4,
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            color: "#fff", display: "grid", placeItems: "center",
            fontSize: 10, fontWeight: 700, flexShrink: 0,
          }}>PG</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Pabrik Go</div>
            <div style={{ fontSize: 10, color: "var(--text-3)" }}>Bandung plant</div>
          </div>
          <Icon name="chevron-down" size={14} style={{ color: "var(--text-3)" }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
        <div style={{ padding: "10px 8px 4px", fontSize: 10, fontWeight: 600, color: "var(--text-3)", letterSpacing: 0.8, textTransform: "uppercase" }}>Workspace</div>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", marginBottom: 2,
                background: active ? "var(--primary-50)" : "transparent",
                border: "none", borderRadius: 6,
                color: active ? "var(--primary)" : "var(--text)",
                fontSize: 13, fontWeight: active ? 600 : 500,
                cursor: "pointer", textDecoration: "none",
                position: "relative",
              }}
            >
              {active && (
                <span style={{
                  position: "absolute", left: -8, top: 6, bottom: 6, width: 3,
                  background: "var(--primary)", borderRadius: "0 2px 2px 0",
                }} />
              )}
              <Icon name={item.icon} size={17} stroke={active ? 2 : 1.7} />
              <span style={{ flex: 1 }}>{item.label}</span>
            </Link>
          );
        })}

        <div style={{ padding: "18px 8px 4px", fontSize: 10, fontWeight: 600, color: "var(--text-3)", letterSpacing: 0.8, textTransform: "uppercase" }}>Shortcuts</div>
        {SHORTCUTS.map(s => (
          <button key={s.label} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "6px 10px", marginBottom: 2,
            background: "transparent", border: "none", borderRadius: 6,
            color: "var(--text-2)", fontSize: 12, cursor: "pointer", textAlign: "left",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: s.color, flexShrink: 0 }} />
            {s.label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "10px 12px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 999,
          background: "#111827", color: "#fff",
          display: "grid", placeItems: "center",
          fontSize: 11, fontWeight: 600, flexShrink: 0,
        }}>DM</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Dewi Maharani</div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>Operations lead</div>
        </div>
        <button style={{
          background: "transparent", border: "none", padding: 4, cursor: "pointer",
          color: "var(--text-3)", borderRadius: 4,
        }}>
          <Icon name="more" size={16} />
        </button>
      </div>
    </aside>
  );
}
