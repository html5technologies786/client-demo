"use client";

import { useEffect, useRef, useState } from "react";

// ──────────────────────────────────────────────
//  Pricing constant
//  Falls back to 0.02 if the env var is not set
//  (only NEXT_PUBLIC_ vars are available in the browser)
// ──────────────────────────────────────────────
const PRICE_PER_SECOND = parseFloat(
  process.env.NEXT_PUBLIC_PRICE_PER_SECOND ?? "0.02"
);

type SessionState = "idle" | "running" | "ended";

export default function SessionTimer() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Tick every second while session is running ──
  useEffect(() => {
    if (sessionState === "running") {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionState]);

  const runningCost = +(seconds * PRICE_PER_SECOND).toFixed(2);

  // ── Start Session ──────────────────────────
  const handleStart = () => {
    setSeconds(0);
    setError(null);
    setSessionState("running");
  };

  // ── End Session ────────────────────────────
  const handleEnd = async () => {
    // Stop the interval immediately
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSessionState("ended");

    const finalSeconds = seconds;
    const finalCost = +(finalSeconds * PRICE_PER_SECOND).toFixed(2);

    // Guard: Stripe requires amount > 0
    if (finalCost <= 0) {
      setError("Session too short to bill (cost is $0.00).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalCost, seconds: finalSeconds }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "API error");
      }

      // Redirect to Stripe hosted checkout page
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  // ── Format seconds as mm:ss ────────────────
  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6">

      {/* ── Timer display ── */}
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Session Duration
        </p>
        <p className="text-7xl font-black tabular-nums text-gray-800 leading-none">
          {formatted}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {seconds} second{seconds !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Running cost ── */}
      <div className="w-full bg-slate-50 rounded-xl px-6 py-4 text-center border border-slate-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Running Cost
        </p>
        <p className="text-4xl font-extrabold text-indigo-600 tabular-nums">
          ${runningCost.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ${PRICE_PER_SECOND.toFixed(2)} per second
        </p>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-4 w-full">
        <button
          onClick={handleStart}
          disabled={sessionState === "running" || loading}
          className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          ▶ Start Session
        </button>
        <button
          onClick={handleEnd}
          disabled={sessionState !== "running" || loading}
          className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          {loading ? "Redirecting to Stripe…" : "■ End Session"}
        </button>
      </div>

      {/* ── Error state ── */}
      {error && (
        <div className="w-full rounded-xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-1">
            Error
          </p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
