import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { profService } from "@/services/profService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import { QrCode, CheckCircle2, XCircle, Loader2, Calendar, User, BookOpen, AlertTriangle, MapPin, Compass } from "lucide-react";
import type { LectureDto } from "@/types/dto";


//19.236457987150064, 73.16271558236878
// const TARGET_LAT = 19.231500833915575;
// const TARGET_LON = 73.15753488050134;

const TARGET_LAT = 19.236457987150064;
const TARGET_LON = 73.16271558236878;
const MAX_DISTANCE_METERS = 100;

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

interface MarkedDetails {
  lectureId: number;
  studentId: number;
  lecture: LectureDto | null;
  distance: number | null;
  locationStatus: 'in-range' | 'out-of-range' | 'failed';
  status: 'PRESENT' | 'ABSENT';
}

const StudentScan = () => {
  const { student } = useAuth();
  const [status, setStatus] = useState<'scanning' | 'submitting' | 'success' | 'error'>('scanning');
  const [errorMessage, setErrorMessage] = useState('');
  const [markedDetails, setMarkedDetails] = useState<MarkedDetails | null>(null);

  useEffect(() => {
    if (status !== 'scanning') return;

    let scanner: Html5QrcodeScanner | null = null;
    let isCleared = false;

    const onScanSuccess = async (decodedText: string) => {
      if (isCleared) return;

      try {
        const data = JSON.parse(decodedText);
        if (data.lectureId && student?.studentId) {
          isCleared = true;
          setStatus('submitting');

          const studentId = student.studentId;

          // 1. Geolocation check
          let distance: number | null = null;
          let locationStatus: 'in-range' | 'out-of-range' | 'failed' = 'failed';
          let attendanceStatus: 'PRESENT' | 'ABSENT' = 'ABSENT';
          let remarks = 'Attendance Marked with QR';

          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              if (!navigator.geolocation) {
                reject(new Error("Geolocation unsupported"));
                return;
              }
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
              });
            });

            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            distance = getDistanceInMeters(userLat, userLon, TARGET_LAT, TARGET_LON);

            if (distance <= MAX_DISTANCE_METERS) {
              locationStatus = 'in-range';
              attendanceStatus = 'PRESENT';
              remarks = 'Attendance Marked with QR';
            } else {
              locationStatus = 'out-of-range';
              attendanceStatus = 'ABSENT';
              remarks = `Attendance Marked with QR (Out of Range: ${Math.round(distance)}m)`;
            }
          } catch (locErr: any) {
            console.warn("Geolocation failed", locErr);
            locationStatus = 'failed';
            attendanceStatus = 'ABSENT';
            remarks = `Attendance Marked with QR (Location Unavailable: ${locErr.message || 'Permission Denied'})`;
          }

          // 2. Fetch lecture details in parallel
          let lectureInfo: LectureDto | null = null;
          try {
            lectureInfo = await profService.getLectureById(Number(data.lectureId));
          } catch (le) {
            console.warn("Could not fetch lecture details", le);
          }

          // 3. Post to API
          await profService.markAttendance({
            attendanceStatus,
            remarks,
            lectureId: Number(data.lectureId),
            studentId: Number(studentId),
          });

          setMarkedDetails({
            lectureId: Number(data.lectureId),
            studentId: Number(studentId),
            lecture: lectureInfo,
            distance,
            locationStatus,
            status: attendanceStatus,
          });

          setStatus('success');
          if (attendanceStatus === 'PRESENT') {
            toast.success("Attendance marked as PRESENT!");
          } else {
            toast.warning(`Attendance marked as ABSENT: ${locationStatus === 'out-of-range' ? 'Out of Range' : 'Location Required'}`);
          }
        } else {
          toast.error("Invalid QR code format");
        }
      } catch (err: any) {
        console.error("Scan processing failed", err);
        let errMsg = err.response?.data?.body || err.response?.data?.message || err.message || "Failed to mark attendance";
        
        if (typeof errMsg === "string" && errMsg.includes("java.lang.Exception: ")) {
          errMsg = errMsg.split("java.lang.Exception: ")[1];
        } else if (typeof errMsg === "string" && errMsg.includes("Exception: ")) {
          errMsg = errMsg.split("Exception: ")[1];
        }

        setErrorMessage(errMsg);
        setStatus('error');
        toast.error(`Marking failed: ${errMsg}`);
      }
    };

    const onScanFailure = (error: string) => {
      // Ignore frequent scan failures
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
            height: 250,
          },
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
    setStatus('scanning');
    setMarkedDetails(null);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Dynamic HTML5-QRCode CSS overrides */}
      <style>{`
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
      `}</style>

      {status === 'scanning' && (
        <div className="flex flex-col items-center gap-6 w-full animate-ticker">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-[oklch(0.72_0.16_195)]" />
              Scan Attendance QR Code
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Verify your location and scan the professor's live screen QR code.
            </p>
          </div>

          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/5 bg-black/20 p-2 scan-region-animated">
            <div id="reader" className="w-full" />
          </div>
        </div>
      )}

      {status === 'submitting' && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6 w-full min-h-[350px] glass rounded-2xl animate-pulse">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-teal/20 border-t-teal animate-spin" />
            <Loader2 className="h-8 w-8 text-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin duration-1000" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Verifying Location & Token</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Calculating distance and submitting check-in data securely...
            </p>
          </div>
        </div>
      )}

      {status === 'success' && markedDetails && (
        <div className={`flex flex-col items-center py-8 px-6 text-center space-y-6 w-full glass rounded-2xl border border-solid animate-ticker ${
          markedDetails.status === 'PRESENT' ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'
        }`}>
          <div className={`relative flex items-center justify-center h-16 w-16 rounded-full border border-solid ${
            markedDetails.status === 'PRESENT' 
              ? 'bg-[oklch(0.72_0.18_155/0.15)] border-[oklch(0.72_0.18_155/0.4)] shadow-[0_0_30px_oklch(0.72_0.18_155/0.2)]'
              : 'bg-[oklch(0.65_0.24_25/0.15)] border-[oklch(0.65_0.24_25/0.4)] shadow-[0_0_30px_oklch(0.65_0.24_25/0.2)]'
          }`}>
            {markedDetails.status === 'PRESENT' ? (
              <CheckCircle2 className="h-9 w-9 text-[oklch(0.72_0.18_155)]" />
            ) : (
              <AlertTriangle className="h-9 w-9 text-[oklch(0.65_0.24_25)]" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              {markedDetails.status === 'PRESENT' ? 'Attendance Marked!' : 'Marked as ABSENT'}
            </h3>
            <p className={`text-sm font-semibold uppercase tracking-wider ${
              markedDetails.status === 'PRESENT' ? 'text-[oklch(0.72_0.18_155)]' : 'text-[oklch(0.65_0.24_25)]'
            }`}>
              Status: {markedDetails.status}
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3 bg-white/3 border border-white/5 rounded-xl p-4 text-left text-sm">
            {markedDetails.lecture && (
              <div className="flex items-start gap-2.5">
                <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Subject & Topic</div>
                  <div className="font-medium text-foreground">{markedDetails.lecture.topic}</div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Student ID</div>
                <div className="font-mono text-foreground">{markedDetails.studentId}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2.5">
              <Compass className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Location Status</div>
                <div className={`font-semibold ${
                  markedDetails.locationStatus === 'in-range' 
                    ? 'text-[oklch(0.72_0.18_155)]' 
                    : 'text-[oklch(0.65_0.24_25)]'
                }`}>
                  {markedDetails.locationStatus === 'in-range' && `In Range (~${Math.round(markedDetails.distance || 0)}m)`}
                  {markedDetails.locationStatus === 'out-of-range' && `Out of Range (~${Math.round(markedDetails.distance || 0)}m)`}
                  {markedDetails.locationStatus === 'failed' && 'Location Verification Failed'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Marked Time</div>
                <div className="text-foreground">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          <Button onClick={handleReset} variant={markedDetails.status === 'PRESENT' ? 'outline' : 'primary'} className="w-full max-w-xs">
            {markedDetails.status === 'PRESENT' ? 'Scan Another' : 'Try Again'}
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center py-8 px-6 text-center space-y-6 w-full glass rounded-2xl border-destructive/20 bg-destructive/5 animate-ticker">
          <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-[oklch(0.65_0.24_25/0.15)] border border-[oklch(0.65_0.24_25/0.4)] shadow-[0_0_30px_oklch(0.65_0.24_25/0.2)]">
            <XCircle className="h-9 w-9 text-[oklch(0.65_0.24_25)]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">Marking Failed</h3>
            <p className="text-sm text-destructive font-semibold uppercase tracking-wider">
              An error occurred
            </p>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              {errorMessage || "We encountered an issue checking you in. Please request manual assistance."}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Button onClick={handleReset} variant="primary">
              Try Again
            </Button>
            <Button onClick={handleReset} variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentScan;