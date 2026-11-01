import { productApi } from "@/shared/api/client";
import { PRODUCT_KEY } from "../utils/constants";

export const email_apiApi = (organizationId: string) => productApi(organizationId);
export const overviewPath = `/api/v1/${PRODUCT_KEY}/overview`;
