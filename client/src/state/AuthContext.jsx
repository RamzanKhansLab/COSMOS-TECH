import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { http, setAuthToken } from "../api/http";

const AuthCtx = createContext(null);

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => safeJsonParse(localStorage.getItem("user")) || null);

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login({ email, password, isAdmin }) {
    const path = isAdmin ? "/auth/admin/login" : "/auth/login";
    const res = await http.post(path, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  }

  async function register({ name, email, password, role, sellerStoreName }) {
    const res = await http.post("/auth/register", { name, email, password, role, sellerStoreName });
    setToken(res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed: Boolean(token),
      login,
      register,
      logout
    }),
    [token, user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
