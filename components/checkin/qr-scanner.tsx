"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { checkInByToken } from "@/src/lib/checkin/actions";

type CheckInResult =
  | { success: true; type: "success"; guestName: string; isFree: boolean; newAttendanceCount: number }
  | { error: string; type: "invalid" | "wrong_event" | "not_found" | "duplicate" | "cancelled" | "unauthorized"; guestName?: string };

interface QrScannerProps {
  eventId: string;
  onResult: (result: CheckInResult) => void;
  paused: boolean;
}

export function QrScanner({ eventId, onResult, paused }: QrScannerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerRef = useRef<any>(null);
  const pausedRef = useRef(paused);
  const processingRef = useRef(false);
  const onResultRef = useRef(onResult);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Keep refs in sync without triggering effect re-runs
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      if (pausedRef.current || processingRef.current) return;
      processingRef.current = true;

      try {
        const result = await checkInByToken(decodedText, eventId);
        onResultRef.current(result as CheckInResult);
      } catch {
        onResultRef.current({ error: "Hálózati hiba. Próbáld újra.", type: "invalid" });
      } finally {
        processingRef.current = false;
      }
    },
    [eventId]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let html5Qrcode: any = null;
    let mounted = true;

    async function initScanner() {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!mounted) return;

      html5Qrcode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5Qrcode;

      try {
        await html5Qrcode.start(
          { facingMode: useFrontCamera ? "user" : "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          (decodedText: string) => {
            handleScanSuccess(decodedText);
          },
          () => {
            // Scan error (no QR found in frame) — ignore
          }
        );
        if (mounted) setScannerReady(true);
      } catch {
        if (mounted) setCameraError(true);
      }
    }

    initScanner();

    return () => {
      mounted = false;
      if (html5Qrcode) {
        html5Qrcode.stop().catch(() => {
          // Ignore stop errors during cleanup
        });
      }
    };
  }, [useFrontCamera, handleScanSuccess]);

  const toggleCamera = useCallback(() => {
    setUseFrontCamera((prev) => !prev);
    setScannerReady(false);
  }, []);

  return (
    <div className="relative w-full">
      <div
        id="qr-reader"
        className="w-full rounded-xl overflow-hidden bg-black"
        style={{ minHeight: "300px" }}
      />
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
          <div className="text-center px-4">
            <p className="text-red-400 text-sm font-medium mb-1">Kamera nem elérhető</p>
            <p className="text-zinc-400 text-xs">Engedélyezd a kamera hozzáférést a böngésző beállításaiban.</p>
          </div>
        </div>
      )}
      {!scannerReady && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
          <p className="text-white text-sm">Kamera indítása...</p>
        </div>
      )}
      <button
        type="button"
        onClick={toggleCamera}
        className="mt-3 w-full min-h-[44px] text-sm text-muted-foreground hover:text-white transition-colors py-2 border border-zinc-700 rounded-lg"
      >
        {useFrontCamera ? "Hátsó kamera" : "Elülső kamera"}
      </button>
    </div>
  );
}
