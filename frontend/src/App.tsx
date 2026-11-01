import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/shared/auth/AuthContext";
import { LoadingState } from "@/shared/components/States";
import HomePage from "@/website/pages/HomePage";
import ProductPage from "@/website/pages/ProductPage";
import CheckoutPage from "@/website/pages/CheckoutPage";
import PaymentSuccessPage from "@/website/pages/PaymentSuccessPage";
import PaymentCancelPage from "@/website/pages/PaymentCancelPage";
import LoginPage from "@/website/pages/LoginPage";
import RegisterPage from "@/website/pages/RegisterPage";
import VerifyEmailPage from "@/website/pages/VerifyEmailPage";
import ForgotPasswordPage from "@/website/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/website/pages/ResetPasswordPage";
import AcceptInvitePage from "@/website/pages/AcceptInvitePage";
import AccountPage from "@/website/pages/AccountPage";
import NotFoundPage from "@/website/pages/NotFoundPage";

// Each product dashboard is an independent bundle (code-split) mounted on its own address.
const CrmApp = lazy(() => import("@/products/crm/CrmApp"));
const ErpApp = lazy(() => import("@/products/erp/ErpApp"));
const EmailApiApp = lazy(() => import("@/products/email_api/EmailApiApp"));
const PaymentsApiApp = lazy(() => import("@/products/payments_api/PaymentsApiApp"));
const MarketplaceApp = lazy(() => import("@/products/marketplace/MarketplaceApp"));
const RecebimentoApp = lazy(() => import("@/products/recebimento/RecebimentoApp"));
const MarketingApp = lazy(() => import("@/products/marketing/MarketingApp"));
const ChatbotApp = lazy(() => import("@/products/chatbot/ChatbotApp"));
const LinkBioApp = lazy(() => import("@/products/link_bio/LinkBioApp"));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produtos/:slug" element={<ProductPage />} />
            <Route path="/contratar/:slug" element={<CheckoutPage />} />
            <Route path="/pagamento/sucesso" element={<PaymentSuccessPage />} />
            <Route path="/pagamento/cancelado" element={<PaymentCancelPage />} />
            <Route path="/entrar" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/verificar-email" element={<VerifyEmailPage />} />
            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
            <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
            <Route path="/convite" element={<AcceptInvitePage />} />
            <Route path="/minha-conta" element={<AccountPage />} />
            <Route path="/crm/*" element={<CrmApp />} />
            <Route path="/erp/*" element={<ErpApp />} />
            <Route path="/email-api/*" element={<EmailApiApp />} />
            <Route path="/payments-api/*" element={<PaymentsApiApp />} />
            <Route path="/marketplace/*" element={<MarketplaceApp />} />
            <Route path="/recebimento/*" element={<RecebimentoApp />} />
            <Route path="/marketing/*" element={<MarketingApp />} />
            <Route path="/chatbot/*" element={<ChatbotApp />} />
            <Route path="/link-bio/*" element={<LinkBioApp />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
