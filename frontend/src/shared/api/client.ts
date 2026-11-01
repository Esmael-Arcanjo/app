import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const readCookie = (name: string) =>
  document.cookie.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1] || "";

let refreshing: Promise<unknown> | null = null;
const NO_REFRESH = ["/api/v1/auth/refresh", "/api/v1/auth/login", "/api/v1/auth/login/mfa", "/api/v1/auth/register"];

const attach = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const csrf = readCookie("csrf_token");
    if (csrf) config.headers.set("X-CSRF-Token", csrf);
    return config;
  });
  instance.interceptors.response.use(undefined, async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status !== 401 || !original || original._retry || NO_REFRESH.some((p) => original.url?.endsWith(p))) {
      throw error;
    }
    original._retry = true;
    refreshing = refreshing || api.post("/api/v1/auth/refresh").finally(() => { refreshing = null; });
    await refreshing;
    return instance(original);
  });
  return instance;
};

export const api = attach(axios.create({ baseURL: BACKEND_URL, withCredentials: true }));

export const productApi = (organizationId: string) =>
  attach(axios.create({ baseURL: BACKEND_URL, withCredentials: true, headers: { "X-Organization-Id": organizationId } }));

export const errMsg = (e: unknown): string => {
  const err = e as AxiosError<{ detail?: unknown }>;
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((d: { msg?: string }) => d.msg?.replace("Value error, ", "")).join(" ");
  if (err?.response?.status === 429) return "Muitas requisições. Aguarde um instante.";
  return "Não foi possível concluir a operação. Tente novamente.";
};
