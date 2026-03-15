import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

// ──────────────────────────────────────────────
//  POST /api/create-payment-intent
//
//  Receives the final session cost in dollars,
//  converts to cents (Stripe requires integers),
//  creates a PaymentIntent in test mode, and
//  returns the PaymentIntent ID to the frontend.
// ──────────────────────────────────────────────

interface RequestBody {
  /** Session cost in dollars, e.g. 0.84 */
  amount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    if (typeof body.amount !== "number" || body.amount <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number (in dollars)" },
        { status: 400 }
      );
    }

    // Convert dollars → cents and round to avoid floating-point drift
    // e.g. $0.84 → 84 cents
    const amountInCents = Math.round(body.amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      // automatic_payment_methods lets Stripe handle payment method
      // selection — fine for a demo / metered billing flow
      automatic_payment_methods: { enabled: true },
      metadata: {
        source: "metered-billing-demo",
      },
    });

    return NextResponse.json({ paymentIntentId: paymentIntent.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[create-payment-intent]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
