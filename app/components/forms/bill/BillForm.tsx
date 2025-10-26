import FormWrapper from "../base/FormWrapper";
import BillFields from "./BillFields";

interface BillFormProps {
  initialData?: any;
  method?: "POST" | "PATCH";
  apiEndpoint: string;
  title: string;
}

export default function BillForm({
  initialData,
  method = "POST",
  apiEndpoint,
  title,
}: BillFormProps) {
  return (
    <FormWrapper
      title={title}
      apiEndpoint={apiEndpoint}
      method={method}
      initialData={initialData || {}}
    >
      <BillFields />
    </FormWrapper>
  );
}
