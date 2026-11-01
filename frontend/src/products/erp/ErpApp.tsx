import { Navigate, Route, Routes } from "react-router-dom";
import { ProductAccessGuard } from "@/shared/product/ProductAccessGuard";
import { ErpLayout } from "./layouts/ErpLayout";
import { PRODUCT_KEY, PRODUCT_NAME } from "./utils/constants";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SecurityPage from "./pages/SecurityPage";
import SessionsPage from "./pages/SessionsPage";
import NotificationsPage from "./pages/NotificationsPage";
import HelpPage from "./pages/HelpPage";

export default function ErpApp() {
  return (
    <ProductAccessGuard productKey={PRODUCT_KEY} productName={PRODUCT_NAME}>
      <Routes>
        <Route element={<ErpLayout />}>
          <Route index element={<DashboardPage />} />
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
