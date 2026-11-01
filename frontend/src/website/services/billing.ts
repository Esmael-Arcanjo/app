import { api } from "@/shared/api/client";

export type CheckoutPayload = {
  product_key: string; plan_key: string; segment: string;
  organization?: { name: string; document?: string | null; country: string };
  origin_url: string;
};

export const startCheckout = async (payload: CheckoutPayload): Promise<{ checkout_url: string; session_id: string }> =>
  (await api.post("/api/v1/billing/checkout", payload)).data;

export const checkoutStatus = async (sessionId: string) =>
  (await api.get(`/api/v1/billing/checkout/${sessionId}/status`)).data as {
    payment_status: string; subscription_status: string; product_key: string; slug: string;
  };

export const mySubscriptions = async () => (await api.get("/api/v1/subscriptions/mine")).data as {
  subscriptions: { product_key: string; product_name: string; slug: string; organization_name: string; status: string; plan_key: string; role: string }[];
  pending_count: number;
};
