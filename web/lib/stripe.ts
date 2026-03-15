import Stripe from "stripe";

// ──────────────────────────────────────────────
//  Stripe singleton
//
//  A single Stripe instance is created once and
//  reused across all API route invocations.
//  The secret key is read from the server-side
//  environment variable — it is NEVER sent to
//  the browser.
// ──────────────────────────────────────────────
// Initialise lazily so the module can be imported at build time without
// the key present — the error will surface at the first actual request.
function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY. Copy .env.example to .env.local and fill in your Stripe test key."
    );
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
  });
}

let _stripe: Stripe | null = null;

const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) _stripe = getStripe();
    return (_stripe as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default stripe;
