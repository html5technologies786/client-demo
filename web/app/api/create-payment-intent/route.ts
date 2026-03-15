import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

// ──────────────────────────────────────────────
//  POST /api/create-payment-intent
//
//  Receives the final session cost in dollars,
//  creates a Stripe Checkout Session, and returns
//  the hosted checkout URL for the browser to
//  redirect to.
// ──────────────────────────────────────────────

interface RequestBody {
  /** Session cost in dollars, e.g. 0.84 */
  amount: number;
  /** Session duration in seconds — shown as line-item description */
  seconds: number;
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
    const amountInCents = Math.round(body.amount * 100);

    // Derive the app origin from the incoming request so this works in
    // any environment (local, Docker, staging, production) without extra config.
    const origin = req.headers.get("origin") ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountInCents,
            product_data: {
              name: "Metered Session",
              description: `${body.seconds ?? "?"} second session`,
            },
          },
        },
      ],
      success_url: `${origin}/billing?status=success`,
      cancel_url: `${origin}/billing?status=cancelled`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[create-payment-intent]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
