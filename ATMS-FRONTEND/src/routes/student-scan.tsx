import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/common/Navbar";
import StudentScan from "@/components/attendance/StudentScan";
import Card from "@/components/common/Card";

export const Route = createFileRoute("/student-scan")({
  head: () => ({ meta: [{ title: "Student Scan — ATMS" }] }),
  component: StudentScanPage,
});

function StudentScanPage() {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "STUDENT") {
      navigate({ to: "/login" });
    }
  }, [role, navigate]);

  if (role !== "STUDENT") return null;

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <main className="mx-auto w-[min(560px,calc(100%-2rem))] mt-16">
        <Card variant="strong">
          <div className="p-4">
            <StudentScan />
          </div>
        </Card>
      </main>
    </div>
  );
}
