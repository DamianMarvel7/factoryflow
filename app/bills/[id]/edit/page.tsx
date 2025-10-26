"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BillEditForm from "@/app/components/forms/bill/BillEditForm";

export default function EditBillPage() {
  const { id } = useParams();
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/bills/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBill(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!bill) return <p className="text-center mt-10 text-red-500">Bill not found.</p>;

  return <BillEditForm bill={bill} />;
}
