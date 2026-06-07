import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ProfessorSession, StudentDto } from "@/types/dto";

type Role = "ADMIN" | "PROFESSOR" | "STUDENT" | null;

interface AuthState {
  role: Role;
  professor: ProfessorSession | null;
  student: StudentDto | null;
  adminUsername: string | null;
  loginAdmin: (username: string) => void;
  loginProfessor: (prof: ProfessorSession) => void;
  loginStudent: (student: StudentDto) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "atms.auth.v2";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [professor, setProfessor] = useState<ProfessorSession | null>(null);
  const [student, setStudent] = useState<StudentDto | null>(null);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const s = JSON.parse(raw);
        setRole(s.role || null);
        setProfessor(s.professor || null);
        setStudent(s.student || null);
        setAdminUsername(s.adminUsername || null);
      }
    } catch {/* ignore */}
  }, []);

  const persist = (next: {
    role: Role;
    professor: ProfessorSession | null;
    student: StudentDto | null;
    adminUsername: string | null;
  }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {/* ignore */}
  };

  const loginAdmin = (username: string) => {
    setRole("ADMIN");
    setAdminUsername(username);
    setProfessor(null);
    setStudent(null);
    persist({ role: "ADMIN", professor: null, student: null, adminUsername: username });
  };

  const loginProfessor = (prof: ProfessorSession) => {
    setRole("PROFESSOR");
    setProfessor(prof);
    setAdminUsername(null);
    setStudent(null);
    persist({ role: "PROFESSOR", professor: prof, student: null, adminUsername: null });
  };

  const loginStudent = (stu: StudentDto) => {
    setRole("STUDENT");
    setStudent(stu);
    setProfessor(null);
    setAdminUsername(null);
    persist({ role: "STUDENT", professor: null, student: stu, adminUsername: null });
  };

  const logout = () => {
    setRole(null);
    setProfessor(null);
    setStudent(null);
    setAdminUsername(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {/* ignore */}
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        professor,
        student,
        adminUsername,
        loginAdmin,
        loginProfessor,
        loginStudent,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
