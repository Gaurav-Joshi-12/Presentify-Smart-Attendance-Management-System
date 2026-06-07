import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/common/Navbar";
import QrGenerator from "@/components/attendance/QrGenerator";
import { z } from "zod";

const searchSchema = z.object({
  lectureId: z.coerce.number().optional().catch(1),
  topic: z.string().optional().catch("Demo Lecture"),
});

export const Route = createFileRoute("/qrcode-generator")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "QR Generator — ATMS" }] }),
  component: QrCodeGeneratorPage,
});

function QrCodeGeneratorPage() {
  const { lectureId, topic } = Route.useSearch();

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <main className="mx-auto w-[min(1280px,calc(100%-2rem))] mt-8">
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">QR Code Gate</div>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
            Live QR Session
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Display this QR code for students to scan and mark their attendance.
          </p>
        </div>

        <QrGenerator lectureId={lectureId ?? 1} topic={topic ?? "Demo Lecture"} />
      </main>
    </div>
  );
}
