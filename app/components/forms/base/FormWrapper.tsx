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

  // ✅ initialize form once — no useEffect
  const [form, setForm] = useState<Record<string, any>>(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Inject form + handleChange props into children */}
        {Array.isArray(children)
          ? children.map((child, i) =>
              typeof child === "object"
                ? //@ts-ignore
                  React.cloneElement(child, { form, handleChange, key: i })
                : child
            )
          : //@ts-ignore
            React.cloneElement(children, { form, handleChange })}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
