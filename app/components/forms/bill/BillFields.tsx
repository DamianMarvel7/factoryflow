"use client";

interface BillFieldsProps {
  form?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  inputStyle?: React.CSSProperties;
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "var(--text-2)",
  letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 5, display: "block",
};

export default function BillFields({ form = {}, handleChange, inputStyle = {} }: BillFieldsProps) {
  return (
    <>
      <div>
        <label style={labelStyle}>Vendor name</label>
        <input name="vendorName" placeholder="e.g. Benang Jaya Textile"
          value={form.vendorName || ""} onChange={handleChange} style={inputStyle} required/>
      </div>
      <div>
        <label style={labelStyle}>Note</label>
        <input name="note" placeholder="Brief description of the bill"
          value={form.note || ""} onChange={handleChange} style={inputStyle}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Amount (IDR)</label>
          <input name="amount" type="number" placeholder="0"
            value={form.amount || ""} onChange={handleChange} style={inputStyle} required/>
        </div>
        <div>
          <label style={labelStyle}>Paid amount (IDR)</label>
          <input name="paidAmount" type="number" placeholder="0"
            value={form.paidAmount || ""} onChange={handleChange} style={inputStyle}/>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Production progress (%)</label>
        <input name="productionProgress" type="number" min="0" max="100" placeholder="0"
          value={form.productionProgress || ""} onChange={handleChange} style={inputStyle}/>
      </div>
      <div>
        <label style={labelStyle}>Due date</label>
        <input name="dueDate" type="date" value={form.dueDate || ""} onChange={handleChange} style={inputStyle} required/>
      </div>
      <div>
        <label style={labelStyle}>Status</label>
        <select name="status" value={form.status || "unpaid"} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
          <option value="unpaid">Unpaid</option>
          <option value="processing">Processing</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
    </>
  );
}
