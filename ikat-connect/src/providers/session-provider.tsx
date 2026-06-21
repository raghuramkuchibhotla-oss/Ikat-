"use client";

import { createContext, useContext } from "react";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "WEAVER" | "ADMIN";
}

interface SessionContextValue {
  user: SessionUser | null;
  cartCount: number;
}

const SessionContext = createContext<SessionContextValue>({ user: null, cartCount: 0 });

export function SessionProvider({
  user,
  cartCount,
  children,
}: {
  user: SessionUser | null;
  cartCount: number;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={{ user, cartCount }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}
