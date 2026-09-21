import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';

const TOKEN_STORAGE_KEY = 'kyc_access_token';

export interface RegisterPayload {
  username: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
}

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const login = async (username: string, password: string) => {
    const { accessToken } = await api.login(username, password);
    setToken(accessToken);
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    } catch {
      // localStorage unavailable (e.g. private browsing) — session stays in-memory only
    }
  };

  const register = async (payload: RegisterPayload) => {
    await api.register(payload);
    await login(payload.username, payload.password);
  };

  const logout = () => {
    setToken(null);
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({ token, isAuthenticated: token !== null, login, register, logout }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
