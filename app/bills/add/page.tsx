"use client";

import FormWrapper from "@/app/components/forms/base/FormWrapper";
import BillFields from "@/app/components/forms/bill/BillFields";

export default function AddBillPage() {
  return (
    <FormWrapper title="Add New Bill" apiEndpoint="/api/bills" method="POST">
      <BillFields />
    </FormWrapper>
  );
}
