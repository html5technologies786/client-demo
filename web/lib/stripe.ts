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
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY. Copy .env.example to .env.local and fill in your Stripe test key."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});

export default stripe;
