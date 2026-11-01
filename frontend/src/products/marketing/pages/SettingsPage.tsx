import { PageTitle } from "@/shared/components/PageTitle";
import { SettingsSection } from "@/shared/account/SettingsSection";
import { PRODUCT_KEY } from "../utils/constants";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Configurações" />
      <SettingsSection productKey={PRODUCT_KEY} />
    </div>
  );
}
