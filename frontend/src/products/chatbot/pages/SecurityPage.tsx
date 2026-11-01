import { PageTitle } from "@/shared/components/PageTitle";
import { SecuritySection } from "@/shared/account/SecuritySection";
import { PRODUCT_KEY } from "../utils/constants";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Segurança" />
      <SecuritySection productKey={PRODUCT_KEY} />
    </div>
  );
}
