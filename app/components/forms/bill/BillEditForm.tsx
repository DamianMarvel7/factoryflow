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
      <EditBillFields form={{}} handleChange={() => {}} />
    </FormWrapper>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "var(--text-2)",
  letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 5, display: "block",
};

const inputStyle: React.CSSProperties = {
  display: "block", width: "100%",
  border: "1px solid var(--border)", borderRadius: 6,
  padding: "8px 10px", fontSize: 13, outline: "none",
  background: "#fff", color: "var(--text)", fontFamily: "inherit",
};

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
        <label style={labelStyle}>Paid amount (IDR)</label>
        <input type="number" name="paidAmount"
          value={form.paidAmount || ""} onChange={handleChange} style={inputStyle}/>
      </div>
      <div>
        <label style={labelStyle}>Production progress (%)</label>
        <input type="number" name="productionProgress" min={0} max={100}
          value={form.productionProgress || ""} onChange={handleChange} style={inputStyle}/>
      </div>
    </>
  );
}
