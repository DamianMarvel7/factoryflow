"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react"; 

interface KanbanCardBillProps {
  id: number;
  vendorName: string;
  amount: number;
  paidAmount: number;
  productionProgress: number;
  dueDate?: string;
  status?: string;
  onDeleted?: () => void; 
}

export default function KanbanCardBill({
  id,
  vendorName,
  amount,
  paidAmount,
  productionProgress,
  dueDate,
  status,
  onDeleted,
}: KanbanCardBillProps) {
  const router = useRouter();
  const paymentProgress = amount > 0 ? Math.round((paidAmount / amount) * 100) : 0;

  const statusColor =
    {
      unpaid: "bg-red-100 text-red-700",
      processing: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      overdue: "bg-gray-100 text-gray-700",
    }[status ?? "unpaid"];

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // 🚫 prevent navigating to edit page when deleting
    if (confirm(`Delete bill for ${vendorName}?`)) {
      const res = await fetch(`/api/bills/${id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted?.(); // ✅ refresh board
      } else {
        alert("Failed to delete bill");
      }
    }
  };

  return (
    <div className="relative">
      {/* ✅ Clickable card for edit */}
      <Link href={`/bills/${id}/edit`}>
        <div className="p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
          {/* Vendor */}
          <div className="font-semibold text-gray-800">{vendorName}</div>

          {/* Progress Section */}
          <div className="mt-3 space-y-2">
            {/* Payment Progress */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Payment</span>
                <span>{paymentProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${paymentProgress}%` }}
                />
              </div>
            </div>

            {/* Production Progress */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Production</span>
                <span>{productionProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${productionProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
            {dueDate && (
              <span>Due: {new Date(dueDate).toLocaleDateString("id-ID")}</span>
            )}
            {status && (
              <span
                className={`px-2 py-0.5 rounded-full font-medium ${statusColor}`}
              >
                {status}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* 🗑️ Delete button (stays visible, doesn’t trigger link) */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
        title="Delete bill"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
