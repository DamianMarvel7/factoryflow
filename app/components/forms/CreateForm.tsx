"use client";

import React, { useState } from "react"; // ✅ Add this import
import { useRouter } from "next/navigation";

interface CreateFormProps {
  title: string;
  apiEndpoint: string;
  children: React.ReactNode;
}

export default function CreateForm({ title, apiEndpoint, children }: CreateFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push(apiEndpoint.replace("/api", ""));
    } else {
      alert("Failed to create item");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">{title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Inject form + handleChange props into children */}
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
