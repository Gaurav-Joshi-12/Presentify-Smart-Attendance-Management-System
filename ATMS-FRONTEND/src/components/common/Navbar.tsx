import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, ShieldCheck, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { role, professor, adminUsername, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-4 z-40 mx-auto w-[min(1280px,calc(100%-2rem))]">
      <div className="glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[oklch(0.72_0.16_195)] via-[oklch(0.65_0.21_270)] to-[oklch(0.65_0.24_305)] grid place-items-center text-[oklch(0.15_0.01_280)] font-bold shadow-lg">
            A
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">ATMS</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Attendance OS
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {role === "PROFESSOR" && (
            <>
              <NavItem to="/subjects" label="Subjects" />
              <NavItem to="/reports" label="Reports" />
            </>
          )}
          {role === "ADMIN" && <NavItem to="/admin-dashboard" label="Control Hub" />}
        </nav>

        <div className="flex items-center gap-3">
          {role && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10">
              {role === "ADMIN" ? (
                <ShieldCheck className="h-3.5 w-3.5 text-[oklch(0.78_0.15_190)]" />
              ) : (
                <GraduationCap className="h-3.5 w-3.5 text-[oklch(0.78_0.15_190)]" />
              )}
              <span className="text-xs font-medium">
                {role === "ADMIN"
                  ? adminUsername || "Admin"
                  : professor
                  ? `${professor.firstName} ${professor.lastName}`
                  : "Professor"}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {role}
              </span>
            </div>
          )}
          {role ? (
            <Button variant="secondary" size="sm" icon={<LogOut className="h-4 w-4" />} onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => navigate({ to: "/login" })}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-lg text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition"
      activeProps={{ className: "bg-white/10 text-foreground" }}
    >
      {label}
    </Link>
  );
}
