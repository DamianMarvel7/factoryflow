"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ add this
import Link from "next/link";
import KanbanBoard from "@/app/components/kanban/KanbanBoard";
import KanbanCardBill from "@/app/components/kanban/KanbanCardBill";

const STATUSES = ["unpaid", "processing", "paid", "overdue"];

export default function BillsPage() {
  const router = useRouter(); // ✅
  const [bills, setBills] = useState<any[]>([]);

  // function to refetch
  const fetchBills = async () => {
    const res = await fetch("/api/bills");
    const data = await res.json();
    setBills(data);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ✅ listen for browser refresh event manually
  useEffect(() => {
    const handleRefresh = () => fetchBills();
    window.addEventListener("refreshBills", handleRefresh);
    return () => window.removeEventListener("refreshBills", handleRefresh);
  }, []);

  const columns = STATUSES.map((status) => ({
    title: status,
    items: bills.filter((b) => b.status === status),
  }));


  const handleStatusChange = async (id: number, newStatus: string) => {
    // 🔹 Optimistically update local state first
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === id ? { ...bill, status: newStatus } : bill
      )
    );

    // 🔹 Fire API update in background (no await needed)
    fetch(`/api/bills/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update");
        console.log(`✅ Bill ${id} status → ${newStatus}`);
      })
      .catch((err) => console.error(err));
  };



  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Bills</h1>

        <Link
          href="/bills/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Bill
        </Link>
      </div>

    <KanbanBoard
      columns={columns}
      renderCard={(bill) => (
        <KanbanCardBill
          key={bill.id}
          {...bill}
          onDeleted={fetchBills}
        />
      )}
      onStatusChange={handleStatusChange} // ✅
    />
    </div>
  );
}
