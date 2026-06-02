import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/common/Navbar";
import Button from "@/components/common/Button";
import { ArrowRight, QrCode, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATMS — Premium Attendance OS" },
      { name: "description", content: "Track lectures, mark attendance and generate reports with a modern glassmorphic interface." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "ADMIN") navigate({ to: "/admin-dashboard" });
    else if (role === "PROFESSOR") navigate({ to: "/subjects" });
  }, [role, navigate]);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <main className="mx-auto w-[min(1280px,calc(100%-2rem))] mt-16">
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10 mb-6 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.78_0.15_190)]" />
            Premium Attendance Management
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            The <span className="neon-text">attendance OS</span><br />for modern campuses.
          </h1>
          <p className="mt-5 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Manual marking, live QR check-ins and instant reports — wrapped in a glassmorphic interface that students and faculty actually enjoy using.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/login">
              <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>Get Started</Button>
            </Link>
          </div>
        </section>

        <section className="mt-16 grid md:grid-cols-3 gap-5">
          {[
            { icon: <Users className="h-5 w-5" />, t: "Admin Control Hub", d: "Manage colleges, departments, professors, students and subjects from one elegant panel." },
            { icon: <QrCode className="h-5 w-5" />, t: "Live QR Sessions", d: "Spin up secure rotating QR codes with real-time check-in feeds and countdown timers." },
            { icon: <Sparkles className="h-5 w-5" />, t: "Smart Reports", d: "Per-student percentages, lecture-level rosters and red-flag indicators below 75%." },
          ].map((f) => (
            <div key={f.t} className="glass rounded-2xl p-6">
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-[oklch(0.78_0.15_190)]">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
