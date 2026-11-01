import { Navigate, Route, Routes } from "react-router-dom";
import { ProductAccessGuard } from "@/shared/product/ProductAccessGuard";
import { CrmLayout } from "./layouts/CrmLayout";
import { PRODUCT_KEY, PRODUCT_NAME } from "./utils/constants";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./pages/LeadsPage";
import ContactsPage from "./pages/ContactsPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import PipelinePage from "./pages/PipelinePage";
import TeamPage from "./pages/TeamPage";
import BillingPage from "./pages/BillingPage";
import AuditPage from "./pages/AuditPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SecurityPage from "./pages/SecurityPage";
import SessionsPage from "./pages/SessionsPage";
import NotificationsPage from "./pages/NotificationsPage";
import HelpPage from "./pages/HelpPage";

export default function CrmApp() {
  return (
    <ProductAccessGuard productKey={PRODUCT_KEY} productName={PRODUCT_NAME}>
      <Routes>
        <Route element={<CrmLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="contatos" element={<ContactsPage />} />
          <Route path="oportunidades" element={<OpportunitiesPage />} />
          <Route path="atividades" element={<ActivitiesPage />} />
          <Route path="funil" element={<PipelinePage />} />
          <Route path="equipe" element={<TeamPage />} />
          <Route path="assinatura" element={<BillingPage />} />
          <Route path="historico" element={<AuditPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
          <Route path="seguranca" element={<SecurityPage />} />
          <Route path="sessoes" element={<SessionsPage />} />
          <Route path="notificacoes" element={<NotificationsPage />} />
          <Route path="ajuda" element={<HelpPage />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      </Routes>
    </ProductAccessGuard>
  );
}
