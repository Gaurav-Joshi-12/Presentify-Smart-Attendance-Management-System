import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ProfessorSession } from "@/types/dto";

type Role = "ADMIN" | "PROFESSOR" | null;

interface AuthState {
  role: Role;
  professor: ProfessorSession | null;
  adminUsername: string | null;
  loginAdmin: (username: string) => void;
  loginProfessor: (prof: ProfessorSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "atms.auth.v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [professor, setProfessor] = useState<ProfessorSession | null>(null);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const s = JSON.parse(raw);
        setRole(s.role || null);
        setProfessor(s.professor || null);
        setAdminUsername(s.adminUsername || null);
      }
    } catch {/* ignore */}
  }, []);

  const persist = (next: { role: Role; professor: ProfessorSession | null; adminUsername: string | null }) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {/* ignore */}
  };

  const loginAdmin = (username: string) => {
    setRole("ADMIN"); setAdminUsername(username); setProfessor(null);
    persist({ role: "ADMIN", professor: null, adminUsername: username });
  };
  const loginProfessor = (prof: ProfessorSession) => {
    setRole("PROFESSOR"); setProfessor(prof); setAdminUsername(null);
    persist({ role: "PROFESSOR", professor: prof, adminUsername: null });
  };
  const logout = () => {
    setRole(null); setProfessor(null); setAdminUsername(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {/* ignore */}
  };

  return (
    <AuthContext.Provider value={{ role, professor, adminUsername, loginAdmin, loginProfessor, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
