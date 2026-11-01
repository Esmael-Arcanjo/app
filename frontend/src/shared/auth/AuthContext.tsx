import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/shared/api/client";

export type User = {
  id: string; name: string; email: string; email_verified: boolean; mfa_enabled: boolean;
  phone: string | null; locale: string; timezone: string;
  notification_prefs: { email_billing: boolean; email_security: boolean; email_product: boolean };
};

type LoginResult = { mfa_required: boolean; mfa_token?: string };
type AuthValue = {
  user: User | null; loading: boolean;
  setUser: (u: User | null) => void;
  reload: () => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResult>;
  loginMfa: (mfa_token: string, code: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const { data } = await api.get("/api/v1/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/api/v1/auth/login", { email, password });
    if (!data.mfa_required) setUser(data.user);
    return data;
  };
  const loginMfa = async (mfa_token: string, code: string) => {
    const { data } = await api.post("/api/v1/auth/login/mfa", { mfa_token, code });
    setUser(data.user);
  };
  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post("/api/v1/auth/register", { name, email, password });
    setUser(data.user);
  };
  const logout = async () => {
    try { await api.post("/api/v1/auth/logout"); } finally { setUser(null); }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, reload, login, loginMfa, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
