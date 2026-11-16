import { create } from "zustand";

export interface SessionState {
  token: string | null;
  userRole: "ROLE_HOST" | "ROLE_GUEST" | null;
  activeSessionId: number | null;
  setAuth: (token: string, role: "ROLE_HOST" | "ROLE_GUEST") => void;
  logout: () => void;
  setActiveSession: (id: number | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  token: null,
  userRole: null,
  activeSessionId: null,
  setAuth: (token, userRole) => set({ token, userRole }),
  logout: () => set({ token: null, userRole: null, activeSessionId: null }),
  setActiveSession: (activeSessionId) => set({ activeSessionId }),
}));
