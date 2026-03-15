"use client";

import { useEffect, useState } from "react";
import CounterCard from "./components/CounterCard";

interface Stats {
  requests: number;
  tokens: number;
  activeConnections: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const data: Stats = await res.json();
    setStats(data);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">
            Real-Time Dashboard
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Auto-refreshes every 10 seconds
            {lastUpdated && (
              <span className="ml-2 text-gray-400">· Last updated: {lastUpdated}</span>
            )}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <CounterCard
            title="Requests Made"
            value={stats?.requests ?? null}
            icon="🚀"
            color="bg-blue-100 text-blue-600"
          />
          <CounterCard
            title="Tokens Used"
            value={stats?.tokens ?? null}
            icon="🪙"
            color="bg-amber-100 text-amber-600"
          />
          <CounterCard
            title="Active Connections"
            value={stats?.activeConnections ?? null}
            icon="🔗"
            color="bg-emerald-100 text-emerald-600"
          />
        </div>

        {/* Pulse indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Live
        </div>
      </div>
    </main>
  );
}
