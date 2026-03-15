"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import CounterCard from "./components/CounterCard";
import LanguageSwitcher from "./components/LanguageSwitcher";

interface Stats {
  requests: number;
  tokens: number;
  activeConnections: number;
}

export default function Dashboard() {
  // useTranslations() reads from the nearest NextIntlClientProvider,
  // which is re-rendered with new messages whenever the locale changes.
  const t = useTranslations();

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

        {/* Language Switcher */}
        <div className="flex justify-center mb-8">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">
            {t("dashboardTitle")}
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            {t("subtitle")}
            {lastUpdated && (
              // ms-2 = margin-inline-start: auto-flips in RTL (unlike ml-2)
              <span className="ms-2 text-gray-400">
                · {t("lastUpdated")}: {lastUpdated}
              </span>
            )}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <CounterCard
            title={t("requestsMade")}
            value={stats?.requests ?? null}
            icon="🚀"
            color="bg-blue-100 text-blue-600"
          />
          <CounterCard
            title={t("tokensUsed")}
            value={stats?.tokens ?? null}
            icon="🪙"
            color="bg-amber-100 text-amber-600"
          />
          <CounterCard
            title={t("activeConnections")}
            value={stats?.activeConnections ?? null}
            icon="🔗"
            color="bg-emerald-100 text-emerald-600"
          />
        </div>

        {/* Live indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          {t("live")}
        </div>

      </div>
    </main>
  );
}
