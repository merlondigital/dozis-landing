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
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);

  // Keep pausedRef in sync
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      if (pausedRef.current || processingRef.current) return;
      processingRef.current = true;

      try {
        const result = await checkInByToken(decodedText, eventId);
        onResult(result as CheckInResult);
      } catch {
        onResult({ error: "Hálózati hiba. Próbáld újra.", type: "invalid" });
      } finally {
        processingRef.current = false;
      }
    },
    [eventId, onResult]
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
      } catch (err) {
        console.error("[qr-scanner] Failed to start camera:", err);
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
      {!scannerReady && (
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
