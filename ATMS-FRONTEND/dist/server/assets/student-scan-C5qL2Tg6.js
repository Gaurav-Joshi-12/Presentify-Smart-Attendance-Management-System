import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { u as useAuth } from "./router-BIxLXd9m.js";
import { B as Button, N as Navbar } from "./Navbar-CPIRaQSZ.js";
import { Html5QrcodeScanner } from "html5-qrcode";
import { p as profService } from "./profService-fwcpOvja.js";
import { toast } from "sonner";
import { QrCode, Loader2, CheckCircle2, AlertTriangle, BookOpen, User, Compass, Calendar, XCircle } from "lucide-react";
import { C as Card } from "./api-Rs_hdI2y.js";
import "@tanstack/react-query";
import "zod";
import "clsx";
import "tailwind-merge";
import "axios";
const TARGET_LAT = 19.236457987150064;
const TARGET_LON = 73.16271558236878;
const MAX_DISTANCE_METERS = 100;
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
const StudentScan = () => {
  const { student } = useAuth();
  const [status, setStatus] = useState("scanning");
  const [errorMessage, setErrorMessage] = useState("");
  const [markedDetails, setMarkedDetails] = useState(null);
  useEffect(() => {
    if (status !== "scanning") return;
    let scanner = null;
    let isCleared = false;
    const onScanSuccess = async (decodedText) => {
      if (isCleared) return;
      try {
        const data = JSON.parse(decodedText);
        if (data.lectureId && student?.studentId) {
          isCleared = true;
          setStatus("submitting");
          const studentId = student.studentId;
          let distance = null;
          let locationStatus = "failed";
          let attendanceStatus = "ABSENT";
          let remarks = "Attendance Marked with QR";
          try {
            const position = await new Promise((resolve, reject) => {
              if (!navigator.geolocation) {
                reject(new Error("Geolocation unsupported"));
                return;
              }
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 1e4,
                maximumAge: 0
              });
            });
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            distance = getDistanceInMeters(userLat, userLon, TARGET_LAT, TARGET_LON);
            if (distance <= MAX_DISTANCE_METERS) {
              locationStatus = "in-range";
              attendanceStatus = "PRESENT";
              remarks = "Attendance Marked with QR";
            } else {
              locationStatus = "out-of-range";
              attendanceStatus = "ABSENT";
              remarks = `Attendance Marked with QR (Out of Range: ${Math.round(distance)}m)`;
            }
          } catch (locErr) {
            console.warn("Geolocation failed", locErr);
            locationStatus = "failed";
            attendanceStatus = "ABSENT";
            remarks = `Attendance Marked with QR (Location Unavailable: ${locErr.message || "Permission Denied"})`;
          }
          let lectureInfo = null;
          try {
            lectureInfo = await profService.getLectureById(Number(data.lectureId));
          } catch (le) {
            console.warn("Could not fetch lecture details", le);
          }
          await profService.markAttendance({
            attendanceStatus,
            remarks,
            lectureId: Number(data.lectureId),
            studentId: Number(studentId)
          });
          setMarkedDetails({
            lectureId: Number(data.lectureId),
            studentId: Number(studentId),
            lecture: lectureInfo,
            distance,
            locationStatus,
            status: attendanceStatus
          });
          setStatus("success");
          if (attendanceStatus === "PRESENT") {
            toast.success("Attendance marked as PRESENT!");
          } else {
            toast.warning(`Attendance marked as ABSENT: ${locationStatus === "out-of-range" ? "Out of Range" : "Location Required"}`);
          }
        } else {
          toast.error("Invalid QR code format");
        }
      } catch (err) {
        console.error("Scan processing failed", err);
        let errMsg = err.response?.data?.body || err.response?.data?.message || err.message || "Failed to mark attendance";
        if (typeof errMsg === "string" && errMsg.includes("java.lang.Exception: ")) {
          errMsg = errMsg.split("java.lang.Exception: ")[1];
        } else if (typeof errMsg === "string" && errMsg.includes("Exception: ")) {
          errMsg = errMsg.split("Exception: ")[1];
        }
        setErrorMessage(errMsg);
        setStatus("error");
        toast.error(`Marking failed: ${errMsg}`);
      }
    };
    const onScanFailure = (error) => {
      console.warn(error);
    };
    const timer = setTimeout(() => {
      const container = document.getElementById("reader");
      if (!container) return;
      if (container.children.length > 0) {
        console.log("Scanner already initialized, skipping recreation.");
        return;
      }
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250
          }
        },
        false
      );
      scanner.render(onScanSuccess, onScanFailure);
    }, 100);
    return () => {
      isCleared = true;
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch((err) => {
          console.error("Failed to clear scanner", err);
        });
      }
    };
  }, [status]);
  const handleReset = () => {
    setStatus("scanning");
    setMarkedDetails(null);
    setErrorMessage("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full", children: [
    /* @__PURE__ */ jsx("style", { children: `
        #reader {
          border: none !important;
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.1);
        }
        #reader__scan_region {
          border: 2px dashed rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem;
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        #reader__dashboard_section_csr button,
        #reader button {
          background: linear-gradient(135deg, var(--color-teal), var(--color-indigo)) !important;
          color: var(--color-primary-foreground) !important;
          font-family: var(--font-display) !important;
          font-weight: 600 !important;
          padding: 0.6rem 1.2rem !important;
          border-radius: 0.75rem !important;
          border: none !important;
          cursor: pointer !important;
          font-size: 0.875rem !important;
          transition: all 150ms ease !important;
          box-shadow: 0 4px 15px -3px oklch(0.72 0.16 195 / 0.4) !important;
          margin: 10px auto !important;
        }
        #reader button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px -3px oklch(0.72 0.16 195 / 0.6) !important;
        }
        #reader button:active {
          transform: translateY(1px) !important;
        }
        #reader select {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.5rem !important;
          padding: 0.4rem 0.8rem !important;
          color: #fff !important;
          outline: none !important;
          margin: 10px auto !important;
          display: block !important;
        }
        #reader select option {
          background: oklch(0.20 0.01 280) !important;
          color: #fff !important;
        }
        #reader__status_span {
          color: var(--color-muted-foreground) !important;
          font-size: 0.875rem !important;
          display: block !important;
          margin-top: 10px !important;
          text-align: center !important;
        }
        #reader img {
          display: none !important;
        }
        @keyframes scan-line {
          0% { top: 0%; opacity: 0.8; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0.2; }
        }
        .scan-region-animated::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--color-teal), transparent);
          box-shadow: 0 0 15px var(--color-teal);
          animation: scan-line 3s infinite linear;
          pointer-events: none;
          z-index: 10;
        }
      ` }),
    status === "scanning" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 w-full animate-ticker", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-1", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(QrCode, { className: "h-5 w-5 text-[oklch(0.72_0.16_195)]" }),
          "Scan Attendance QR Code"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-sm", children: "Verify your location and scan the professor's live screen QR code." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full max-w-md overflow-hidden rounded-2xl border border-white/5 bg-black/20 p-2 scan-region-animated", children: /* @__PURE__ */ jsx("div", { id: "reader", className: "w-full" }) })
    ] }),
    status === "submitting" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 w-full min-h-[350px] glass rounded-2xl animate-pulse", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full border-4 border-teal/20 border-t-teal animate-spin" }),
        /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 text-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin duration-1000" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Verifying Location & Token" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Calculating distance and submitting check-in data securely..." })
      ] })
    ] }),
    status === "success" && markedDetails && /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center py-8 px-6 text-center space-y-6 w-full glass rounded-2xl border border-solid animate-ticker ${markedDetails.status === "PRESENT" ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}`, children: [
      /* @__PURE__ */ jsx("div", { className: `relative flex items-center justify-center h-16 w-16 rounded-full border border-solid ${markedDetails.status === "PRESENT" ? "bg-[oklch(0.72_0.18_155/0.15)] border-[oklch(0.72_0.18_155/0.4)] shadow-[0_0_30px_oklch(0.72_0.18_155/0.2)]" : "bg-[oklch(0.65_0.24_25/0.15)] border-[oklch(0.65_0.24_25/0.4)] shadow-[0_0_30px_oklch(0.65_0.24_25/0.2)]"}`, children: markedDetails.status === "PRESENT" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-9 w-9 text-[oklch(0.72_0.18_155)]" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "h-9 w-9 text-[oklch(0.65_0.24_25)]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground", children: markedDetails.status === "PRESENT" ? "Attendance Marked!" : "Marked as ABSENT" }),
        /* @__PURE__ */ jsxs("p", { className: `text-sm font-semibold uppercase tracking-wider ${markedDetails.status === "PRESENT" ? "text-[oklch(0.72_0.18_155)]" : "text-[oklch(0.65_0.24_25)]"}`, children: [
          "Status: ",
          markedDetails.status
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xs space-y-3 bg-white/3 border border-white/5 rounded-xl p-4 text-left text-sm", children: [
        markedDetails.lecture && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 text-muted-foreground mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Subject & Topic" }),
            /* @__PURE__ */ jsx("div", { className: "font-medium text-foreground", children: markedDetails.lecture.topic })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-muted-foreground mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Student ID" }),
            /* @__PURE__ */ jsx("div", { className: "font-mono text-foreground", children: markedDetails.studentId })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsx(Compass, { className: "h-5 w-5 text-muted-foreground mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Location Status" }),
            /* @__PURE__ */ jsxs("div", { className: `font-semibold ${markedDetails.locationStatus === "in-range" ? "text-[oklch(0.72_0.18_155)]" : "text-[oklch(0.65_0.24_25)]"}`, children: [
              markedDetails.locationStatus === "in-range" && `In Range (~${Math.round(markedDetails.distance || 0)}m)`,
              markedDetails.locationStatus === "out-of-range" && `Out of Range (~${Math.round(markedDetails.distance || 0)}m)`,
              markedDetails.locationStatus === "failed" && "Location Verification Failed"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5 text-muted-foreground mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Marked Time" }),
            /* @__PURE__ */ jsx("div", { className: "text-foreground", children: (/* @__PURE__ */ new Date()).toLocaleTimeString() })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { onClick: handleReset, variant: markedDetails.status === "PRESENT" ? "outline" : "primary", className: "w-full max-w-xs", children: markedDetails.status === "PRESENT" ? "Scan Another" : "Try Again" })
    ] }),
    status === "error" && /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-8 px-6 text-center space-y-6 w-full glass rounded-2xl border-destructive/20 bg-destructive/5 animate-ticker", children: [
      /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center h-16 w-16 rounded-full bg-[oklch(0.65_0.24_25/0.15)] border border-[oklch(0.65_0.24_25/0.4)] shadow-[0_0_30px_oklch(0.65_0.24_25/0.2)]", children: /* @__PURE__ */ jsx(XCircle, { className: "h-9 w-9 text-[oklch(0.65_0.24_25)]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-foreground", children: "Marking Failed" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-semibold uppercase tracking-wider", children: "An error occurred" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground max-w-xs mt-1", children: errorMessage || "We encountered an issue checking you in. Please request manual assistance." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 w-full max-w-xs", children: [
        /* @__PURE__ */ jsx(Button, { onClick: handleReset, variant: "primary", children: "Try Again" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleReset, variant: "ghost", children: "Cancel" })
      ] })
    ] })
  ] });
};
function StudentScanPage() {
  const {
    role
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "STUDENT") {
      navigate({
        to: "/login"
      });
    }
  }, [role, navigate]);
  if (role !== "STUDENT") return null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-16", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "mx-auto w-[min(560px,calc(100%-2rem))] mt-16", children: /* @__PURE__ */ jsx(Card, { variant: "strong", children: /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx(StudentScan, {}) }) }) })
  ] });
}
export {
  StudentScanPage as component
};
