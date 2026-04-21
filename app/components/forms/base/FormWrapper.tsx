"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FormWrapperProps {
  title: string;
  apiEndpoint: string;
  method?: "POST" | "PATCH";
  initialData?: Record<string, any>;
  children: React.ReactNode;
  redirectTo?: string;
}

export default function FormWrapper({
  title,
  apiEndpoint,
  method = "POST",
  initialData = {},
  children,
  redirectTo,
}: FormWrapperProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, any>>(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit form");
      router.push(redirectTo || apiEndpoint.replace("/api", ""));
    } catch (error) {
      console.error(error);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%",
    border: "1px solid var(--border)", borderRadius: 6,
    padding: "8px 10px", fontSize: 13, outline: "none",
    background: "#fff", color: "var(--text)", fontFamily: "inherit",
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ padding: "20px 28px 16px", background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: -0.2 }}>{title}</h1>
          <button type="button" onClick={() => router.back()} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", height: 34, fontSize: 13, fontWeight: 500, borderRadius: 6, background: "#fff", color: "var(--text)", border: "1px solid var(--border)", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ maxWidth: 560, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: 24, boxShadow: "0 1px 2px rgba(16,24,40,0.04)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Inject form + handleChange props into children */}
            {Array.isArray(children)
              ? children.map((child, i) =>
                  typeof child === "object"
                    ? //@ts-ignore
                      React.cloneElement(child as React.ReactElement, { form, handleChange, inputStyle, key: i })
                    : child
                )
              : //@ts-ignore
                React.cloneElement(children as React.ReactElement, { form, handleChange, inputStyle })}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, padding: "9px 16px", height: 38, fontSize: 14, fontWeight: 500,
                borderRadius: 6, border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "var(--text-3)" : "var(--primary)",
                color: "#fff",
              }}
            >
              {loading ? "Saving…" : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
