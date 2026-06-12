import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User, type UserRole, mockUsers, mockWeavers } from "./data";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  role: UserRole | null;
  language: "en" | "te" | "hi";
  login: (email: string, password: string) => boolean;
  loginWithPhone: (phone: string) => boolean;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  setLanguage: (lang: "en" | "te" | "hi") => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      role: null,
      language: "en",

      login: (email: string, _password: string) => {
        const user = mockUsers.find((u) => u.email === email);
        if (user) {
          set({ user, isLoggedIn: true, role: user.role });
          return true;
        }
        return false;
      },

      loginWithPhone: (phone: string) => {
        const user = mockUsers.find((u) => u.phone === phone);
        if (user) {
          set({ user, isLoggedIn: true, role: user.role });
          return true;
        }
        // For demo: create a temp customer
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: "Customer",
          email: "",
          phone,
          role: "customer",
        };
        set({ user: newUser, isLoggedIn: true, role: "customer" });
        return true;
      },

      loginAsDemo: (role: UserRole) => {
        let user: User;
        if (role === "admin") {
          user = mockUsers.find((u) => u.role === "admin")!;
        } else if (role === "weaver") {
          const weaver = mockWeavers[0];
          user = {
            id: weaver.userId,
            name: weaver.name,
            email: "ramesh@ikatconnect.com",
            phone: weaver.phone,
            role: "weaver",
          };
        } else {
          user = mockUsers.find((u) => u.role === "customer")!;
        }
        set({ user, isLoggedIn: true, role });
      },

      logout: () => {
        set({ user: null, isLoggedIn: false, role: null });
      },

      setLanguage: (lang) => {
        set({ language: lang });
      },
    }),
    {
      name: "ikat-auth-storage",
    }
  )
);
