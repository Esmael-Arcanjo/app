import { PageTitle } from "@/shared/components/PageTitle";
import { HelpSection } from "@/shared/account/HelpSection";
import { PRODUCT_KEY } from "../utils/constants";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Ajuda e Suporte" />
      <HelpSection productKey={PRODUCT_KEY} />
    </div>
  );
}
