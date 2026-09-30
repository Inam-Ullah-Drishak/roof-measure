"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ask the server who is logged in (the cookie is httpOnly, so JS can't read it)
  const refresh = useCallback(async () => {
    try {
      const data = await api("/auth/me");
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check once when the site loads
  useEffect(() => {
    let cancelled = false;
    api("/auth/me")
      .then((data) => !cancelled && setUser(data.user))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    const data = await api("/auth/login", { method: "POST", body: { email, password } });
    setUser(data.user);
    return data.user;
  };

  const register = async (fields) => {
    const data = await api("/auth/register", { method: "POST", body: fields });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

// Admins and employees both use the admin panel (employees see only their orders)
export const STAFF_ROLES = ["admin", "employee"];
export const isStaff = (user) => STAFF_ROLES.includes(user?.role);

// Where to send a user after login
export const homeFor = (user) => (isStaff(user) ? "/admin" : "/dashboard");

// Only allow redirects to our own pages (blocks "?next=//evil.com" tricks)
export const safeNext = (next) =>
  next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : null;
