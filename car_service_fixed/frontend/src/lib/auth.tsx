'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {AuthResponse, LoginDto, RegisterDto, User} from "../types";
import {api} from "./api";

interface AuthCtx {
  user:     User | null;
  loading:  boolean;
  login:    (dto: LoginDto)    => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout:   ()                 => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // FIX: also sync token & role to cookies so middleware can read it
  function setToken(token: string, role?: string) {
    localStorage.setItem('access_token', token);
    document.cookie = `access_token=${token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict`;
    if (role) {
      document.cookie = `user_role=${role}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict`;
    }
  }

  function clearToken() {
    localStorage.removeItem('access_token');
    document.cookie = 'access_token=; path=/; max-age=0';
    document.cookie = 'user_role=; path=/; max-age=0';
  }

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { setLoading(false); return; }

    api.get('/auth/me')
      .then(r => {
        setUser(r.data);
        setToken(token, r.data.role);
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (dto: LoginDto) => {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    setToken(data.accessToken, data.user.role);
    setUser(data.user);
    
    // Route based on role
    const rolePath: Record<string, string> = {
      SUPER_ADMIN: '/dashboard/admin',
      WORKSHOP_ADMIN: '/dashboard/workshop',
      MASTER: '/dashboard/master',
      DRIVER: '/dashboard/driver',
      STORE_OWNER: '/dashboard/shop',
    };
    router.push(rolePath[data.user.role] || '/dashboard');
  }, [router]);

  const register = useCallback(async (dto: RegisterDto) => {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    setToken(data.accessToken, data.user.role);
    setUser(data.user);
    
    // Route based on role
    const rolePath: Record<string, string> = {
      SUPER_ADMIN: '/dashboard/admin',
      WORKSHOP_ADMIN: '/dashboard/workshop',
      MASTER: '/dashboard/master',
      DRIVER: '/dashboard/driver',
      STORE_OWNER: '/dashboard/shop',
    };
    router.push(rolePath[data.user.role] || '/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
