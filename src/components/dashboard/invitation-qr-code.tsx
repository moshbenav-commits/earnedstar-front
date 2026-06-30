/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function InvitationQrCode({
  url,
  label = "Scan to leave a verified review",
  className,
}: {
  url: string;
  label?: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !url) return;
    setError(null);
    QRCode.toCanvas(canvasRef.current, url, {
      width: 200,
      margin: 2,
      color: { dark: "#0F2044", light: "#FFFFFF" },
    }).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not render QR code");
    });
  }, [url]);

  async function downloadPng() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "earnedstar-review-link.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }

  if (!url) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-start",
        className,
      )}
    >
      <canvas ref={canvasRef} className="rounded-lg border border-border bg-white" aria-hidden />
      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold text-navy">{label}</p>
        <p className="mt-1 max-w-xs break-all text-xs text-text-muted">{url}</p>
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        <button
          type="button"
          onClick={() => void downloadPng()}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-navy underline"
        >
          <Download size={14} aria-hidden />
          Download PNG
        </button>
      </div>
    </div>
  );
}
