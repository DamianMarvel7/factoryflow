"use client";

interface BillFieldsProps {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function BillFields({ form, handleChange }: BillFieldsProps) {
  return (
    <>
      <input
        name="vendorName"
        placeholder="Vendor Name"
        value={form.vendorName || ""}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount || ""}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
      <input
        name="paidAmount"
        type="number"
        placeholder="Paid Amount"
        value={form.paidAmount || ""}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
      <input
        name="productionProgress"
        type="number"
        placeholder="Production Progress (%)"
        value={form.productionProgress || ""}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
      <input
        name="dueDate"
        type="date"
        value={form.dueDate || ""}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />
      <select
        name="status"
        value={form.status || "unpaid"}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="unpaid">Unpaid</option>
        <option value="processing">Processing</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
      </select>
    </>
  );
}
