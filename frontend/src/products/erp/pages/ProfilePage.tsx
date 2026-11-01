import { PageTitle } from "@/shared/components/PageTitle";
import { ProfileSection } from "@/shared/account/ProfileSection";
import { PRODUCT_KEY } from "../utils/constants";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Meu Perfil" />
      <ProfileSection productKey={PRODUCT_KEY} />
    </div>
  );
}
