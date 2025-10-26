"use client";

import React from "react";
import FormWrapper from "@/app/components/forms/base/FormWrapper";

interface BillEditFormProps {
  bill: any;
}

export default function BillEditForm({ bill }: BillEditFormProps) {
  return (
    <FormWrapper
      title={`Update Progress for ${bill.vendorName}`}
      apiEndpoint={`/api/bills/${bill.id}`}
      method="PATCH"
      initialData={{
        paidAmount: bill.paidAmount || 0,
        productionProgress: bill.productionProgress || 0,
      }}
      redirectTo="/bills"
    >
      <EditBillFields />
    </FormWrapper>
  );
}

// ✅ define inline (or you can move to BillEditFields.tsx)
function EditBillFields({
  form,
  handleChange,
}: {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paid Amount
        </label>
        <input
          type="number"
          name="paidAmount"
          value={form.paidAmount || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Production Progress (%)
        </label>
        <input
          type="number"
          name="productionProgress"
          min={0}
          max={100}
          value={form.productionProgress || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
    </>
  );
}
