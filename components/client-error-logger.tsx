"use client";

import { useEffect } from "react";

type ClientErrorPayload = {
  type: "error" | "unhandledrejection";
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
};

function sendClientError(payload: ClientErrorPayload) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/client-logs", body);
      return;
    }
    fetch("/api/client-logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Best-effort logging only.
  }
}

export default function ClientErrorLogger() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleError = (event: ErrorEvent) => {
      sendClientError({
        type: "error",
        message: event.message || "Unknown error",
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      sendClientError({
        type: "unhandledrejection",
        message:
          reason instanceof Error
            ? reason.message
            : typeof reason === "string"
              ? reason
              : "Unhandled promise rejection",
        stack: reason instanceof Error ? reason.stack : undefined,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
