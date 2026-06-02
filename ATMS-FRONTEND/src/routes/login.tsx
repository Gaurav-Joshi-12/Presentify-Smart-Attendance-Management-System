import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import Input, { Select } from "@/components/common/Input";
import Button from "@/components/common/Button";
import { ShieldCheck, GraduationCap, Lock, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import { useAuth } from "@/context/AuthContext";
import type { CollegeDto } from "@/types/dto";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — ATMS" }] }),
  component: Login,
});

type Tab = "ADMIN" | "PROFESSOR";

function Login() {
  const [tab, setTab] = useState<Tab>("ADMIN");
  const { loginAdmin, loginProfessor } = useAuth();
  const navigate = useNavigate();

  // Admin form
  const [aUser, setAUser] = useState("");
  const [aPass, setAPass] = useState("");
  const [aErr, setAErr] = useState<string | null>(null);

  // Professor form
  const [colleges, setColleges] = useState<CollegeDto[]>([]);
  const [collegeId, setCollegeId] = useState<string>("");
  const [pEmail, setPEmail] = useState("");
  const [pPass, setPPass] = useState("");
  const [pErr, setPErr] = useState<string | null>(null);
  const [loadingColleges, setLoadingColleges] = useState(false);

  useEffect(() => {
    if (tab !== "PROFESSOR") return;
    setLoadingColleges(true);
    adminService
      .listColleges()
      .then((data) => {
        setColleges(data);
        if (data[0]?.collegeId) setCollegeId(String(data[0].collegeId));
      })
      .catch(() => {
        // Fallback mock so login is testable without backend
        const mock: CollegeDto[] = [
          { collegeId: 1, collegeName: "MIT College of Engineering", collegeCode: "MIT-COE", address: "Lane 3", city: "Pune", state: "MH", pincode: "411038", email: "info@mitcoe.edu", phoneNo: "0200000000" },
          { collegeId: 2, collegeName: "PICT", collegeCode: "PICT", address: "Dhankawadi", city: "Pune", state: "MH", pincode: "411043", email: "info@pict.edu", phoneNo: "0200000001" },
        ];
        setColleges(mock);
        setCollegeId("1");
        toast.message("Using offline college list", { description: "Backend unreachable — showing demo entries." });
      })
      .finally(() => setLoadingColleges(false));
  }, [tab]);

  const onAdmin = (e: FormEvent) => {
    e.preventDefault();
    if (aUser === "admin" && aPass === "admin") {
      loginAdmin(aUser);
      toast.success("Welcome, admin");
      navigate({ to: "/admin-dashboard" });
    } else setAErr("Invalid credentials. Try admin / admin.");
  };

  const onProf = (e: FormEvent) => {
    e.preventDefault();
    
    adminService
      .listProfessors()
      .then((profs) => {
        const found = profs.find(
          (p) =>
            p.email.toLowerCase() === pEmail.toLowerCase() &&
            (p.password === pPass || pPass === "professor")
        );
        
        if (found) {
          loginProfessor({
            professorId: found.professorId!,
            firstName: found.firstName,
            lastName: found.lastName,
            email: found.email,
            collegeId: found.collegeId,
            departmentId: found.departmentId,
          });
          toast.success(`Welcome, Prof. ${found.lastName}`);
          navigate({ to: "/subjects" });
        } else {
          setPErr("Invalid credentials. Check your email, college selection, or password.");
        }
      })
      .catch((err) => {
        setPErr("Failed to connect to auth server: " + err.message);
      });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-[min(560px,calc(100%-2rem))] mt-16">
        <Card variant="strong" padded={false}>
          <div className="p-7">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Sign in</h1>
              <p className="text-sm text-muted-foreground mt-1">Choose your role to continue.</p>
            </div>

            <div className="grid grid-cols-2 p-1 rounded-xl bg-white/3 border border-white/8 mb-6">
              {(["ADMIN", "PROFESSOR"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition btn-press",
                    tab === t
                      ? "bg-gradient-to-r from-[oklch(0.72_0.16_195/0.25)] to-[oklch(0.65_0.21_270/0.25)] text-foreground border border-white/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "ADMIN" ? <ShieldCheck className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                  {t === "ADMIN" ? "Admin Login" : "Professor Login"}
                </button>
              ))}
            </div>

            {tab === "ADMIN" ? (
              <form onSubmit={onAdmin} className="space-y-4">
                <Input label="Username" leading={<User className="h-4 w-4" />} value={aUser} onChange={(e) => setAUser(e.target.value)} placeholder="admin" required />
                <Input label="Password" type="password" leading={<Lock className="h-4 w-4" />} value={aPass} onChange={(e) => setAPass(e.target.value)} placeholder="••••••" required />
                {aErr && <p className="text-xs text-[oklch(0.80_0.18_25)]">{aErr}</p>}
                <Button type="submit" className="w-full">Sign in as Admin</Button>
                <p className="text-[11px] text-center text-muted-foreground">Demo credentials: admin / admin</p>
              </form>
            ) : (
              <form onSubmit={onProf} className="space-y-4">
                <Input label="Email" type="email" leading={<Mail className="h-4 w-4" />} value={pEmail} onChange={(e) => setPEmail(e.target.value)} placeholder="amit.sharma@college.edu" required />
                <Input label="Password" type="password" leading={<Lock className="h-4 w-4" />} value={pPass} onChange={(e) => setPPass(e.target.value)} placeholder="professor" required />
                {pErr && <p className="text-xs text-[oklch(0.80_0.18_25)]">{pErr}</p>}
                <Button type="submit" className="w-full">Sign in as Professor</Button>
                <p className="text-[11px] text-center text-muted-foreground">Demo password: professor</p>
              </form>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
