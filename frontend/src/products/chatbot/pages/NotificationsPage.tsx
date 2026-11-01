import { PageTitle } from "@/shared/components/PageTitle";
import { NotificationsSection } from "@/shared/account/NotificationsSection";
import { PRODUCT_KEY } from "../utils/constants";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Notificações" />
      <NotificationsSection productKey={PRODUCT_KEY} />
    </div>
  );
}
