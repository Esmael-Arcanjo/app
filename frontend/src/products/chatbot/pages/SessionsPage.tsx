import { PageTitle } from "@/shared/components/PageTitle";
import { SessionsSection } from "@/shared/account/SessionsSection";
import { PRODUCT_KEY } from "../utils/constants";

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Sessões Ativas" />
      <SessionsSection productKey={PRODUCT_KEY} />
    </div>
  );
}
