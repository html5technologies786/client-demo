import SessionTimer from "@/app/components/SessionTimer";

// ──────────────────────────────────────────────
//  /billing — Metered Billing Demo Page
//
//  This is a Server Component shell. The
//  interactive session logic lives entirely in
//  the SessionTimer client component so that
//  this page can stay a lightweight RSC.
// ──────────────────────────────────────────────
export default function BillingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-6">

        {/* Page header */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Metered Billing
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Start a session and pay only for what you use.
          </p>
        </div>

        {/* Interactive timer + billing card */}
        <SessionTimer />

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center">
          Running in Stripe test mode — no real charges are made.
        </p>
      </div>
    </main>
  );
}
