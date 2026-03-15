# Task 5 — Metered Billing with Stripe (Video Script)

## What Was Built

Extended the existing Next.js dashboard with a metered billing demo page at `/billing`. Users start a timed session, watch the cost accumulate in real time at $0.02 per second, and end the session to trigger a Stripe PaymentIntent creation via a secure backend API route. A persistent navigation bar was also added to connect all pages.

---

## Project Structure (New Files Only)

```
web/
├── .env.example                                ← UPDATED: Added Stripe keys
├── lib/
│   └── stripe.ts                               ← NEW: Stripe singleton (server-side)
├── app/
│   ├── billing/
│   │   └── page.tsx                            ← NEW: /billing page (RSC shell)
│   ├── api/
│   │   └── create-payment-intent/
│   │       └── route.ts                        ← NEW: POST /api/create-payment-intent
│   └── components/
│       ├── SessionTimer.tsx                    ← NEW: Timer + billing state + UI
│       └── Nav.tsx                             ← NEW: Sticky navigation header
├── layout.tsx                                  ← UPDATED: Nav added to root layout
```

---

## What Each File Does

### `lib/stripe.ts` — Stripe Singleton
- Instantiates the Stripe Node SDK once using the `STRIPE_SECRET_KEY` environment variable.
- Throws a clear error at startup if the key is missing, rather than failing silently at runtime.
- Exported and reused by any API route that needs Stripe — the key never reaches the browser.

### `app/api/create-payment-intent/route.ts` — Backend API Route
- Exposes `POST /api/create-payment-intent`.
- Receives `{ amount: number }` in dollars from the frontend.
- Validates that the amount is a positive number.
- Converts dollars to cents using `Math.round(amount * 100)` to avoid floating-point drift (e.g. $0.84 → 84 cents — Stripe requires integer cents).
- Calls `stripe.paymentIntents.create()` in test mode.
- Returns `{ paymentIntentId: "pi_xxx" }` to the frontend.
- Handles errors gracefully and returns appropriate HTTP status codes.

### `app/components/SessionTimer.tsx` — The Core Component
This is the most important new file. It manages the entire billing session lifecycle:

**State:**
- `sessionState` — `"idle"` | `"running"` | `"ended"`, controls which buttons are enabled.
- `seconds` — incremented by a `setInterval` every 1000ms while the session is running.
- `result` — holds the final `{ seconds, cost, paymentIntentId }` after a successful API call.
- `loading` — disables buttons and shows "Processing…" while the API request is in flight.
- `error` — displays a red error card if the API call fails.

**Behaviour:**
- **Start**: resets all state, sets `sessionState` to `"running"`, starts the interval.
- **End**: clears the interval, sets `sessionState` to `"ended"`, POSTs the final cost to `/api/create-payment-intent`, and stores the result.
- Running cost displayed as `(seconds × PRICE_PER_SECOND).toFixed(2)` — updates live every second.
- The timer displays in `mm:ss` format using `padStart(2, "0")`.
- `NEXT_PUBLIC_PRICE_PER_SECOND` is read from the environment so the rate can be configured without a code change.

### `app/billing/page.tsx` — Billing Page
- A lightweight React Server Component that acts as the page shell for `/billing`.
- Renders `<SessionTimer />` (a client component) inside a centred Tailwind layout.
- Includes a footer note confirming Stripe test mode is active.

### `app/components/Nav.tsx` — Navigation Header
- A sticky `"use client"` component using `usePathname()` from Next.js to detect the active route.
- Highlights the current page with an indigo filled pill; inactive links use a ghost style.
- Links: **Dashboard** (`/`) and **Billing** (`/billing`).
- Adding a new page requires only a one-line addition to the `links` array.

### `app/layout.tsx` — Updated Root Layout
- `<Nav />` inserted directly inside `<I18nProvider>` so it renders above every page globally.
- No other changes — the existing provider chain is preserved.

---

## Key Concepts Demonstrated

| Concept | Where |
|---|---|
| Stripe PaymentIntent creation | `app/api/create-payment-intent/route.ts` |
| Server-side secret key isolation | `lib/stripe.ts` — never in browser bundle |
| Dollars → cents conversion | `Math.round(amount * 100)` in API route |
| `setInterval` session timer | `SessionTimer.tsx` useEffect |
| Session state machine | `"idle"` → `"running"` → `"ended"` |
| `NEXT_PUBLIC_` env var in browser | `NEXT_PUBLIC_PRICE_PER_SECOND` |
| Active route detection | `usePathname()` in `Nav.tsx` |
| RSC + Client Component split | `billing/page.tsx` (RSC) wraps `SessionTimer` (client) |

---

## How the Billing Flow Works

```
User clicks Start
  → sessionState = "running"
  → setInterval ticks every 1s
  → seconds++ → cost = seconds × $0.02 (updates live)

User clicks End
  → interval cleared
  → sessionState = "ended"
  → POST /api/create-payment-intent { amount: finalCost }
      → Server: Math.round(finalCost × 100) = cents
      → Server: stripe.paymentIntents.create({ amount: cents, currency: "usd" })
      → Server: returns { paymentIntentId: "pi_xxx" }
  → Frontend: displays billing summary card with cost + PaymentIntent ID
```

---

## Security Model

| Layer | What it does |
|---|---|
| `STRIPE_SECRET_KEY` | Lives only in `.env.local`, never in browser bundle |
| `lib/stripe.ts` | Only imported by server-side API routes |
| Frontend | Only ever receives the public-safe `paymentIntentId` |
| Stripe test mode | No real charges — safe to demo freely |

---

## Environment Variables

```bash
# Copy the template before running
cp .env.example .env.local
```

| Variable | Side | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server only | Authenticates Stripe API calls |
| `NEXT_PUBLIC_PRICE_PER_SECOND` | Browser + Server | Billing rate displayed in the UI |

---

## How to Run

```bash
cd web
cp .env.example .env.local
# Add your Stripe test key — get one free at dashboard.stripe.com/test/apikeys
npm run dev
```

Open `http://localhost:3000/billing`

---

## Demo Script Talking Points

1. **Show the nav bar** — point out the Dashboard and Billing links, highlight active state highlighting as you switch pages.
2. **Open the Billing page** — show the idle state with Start button enabled and End button greyed out.
3. **Click Start Session** — watch the `mm:ss` timer tick and the running cost increment live every second.
4. **Let it run for ~10 seconds** — show the cost formula in action: 10 seconds × $0.02 = $0.20.
5. **Click End Session** — show the "Processing…" loading state while the API call is in flight.
6. **Show the billing summary card** — point out the final cost and the `pi_xxx` PaymentIntent ID returned from Stripe.
7. **Open `route.ts`** — walk through the dollars-to-cents conversion and `stripe.paymentIntents.create()` call.
8. **Open `lib/stripe.ts`** — explain the singleton pattern and why the secret key stays server-side only.
9. **Open `SessionTimer.tsx`** — show the state machine (`idle` → `running` → `ended`) and the `useEffect` interval.
10. **Open `Nav.tsx`** — show `usePathname()` and the active link highlighting logic.
