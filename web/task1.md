# Task 1 — Real-Time Dashboard (Video Script)

## What Was Built

A live, auto-updating dashboard using **Next.js (App Router)** and **Tailwind CSS**.

---

## Project Structure

```
client-demo/
├── app/
│   ├── page.tsx                  ← Dashboard UI (client component)
│   ├── layout.tsx                ← Root layout
│   ├── globals.css               ← Global styles
│   ├── components/
│   │   └── CounterCard.tsx       ← Reusable card component
│   └── api/
│       └── stats/
│           └── route.ts          ← API endpoint: GET /api/stats
```

---

## What Each File Does

### `app/api/stats/route.ts` — The API Endpoint
- Exposes a `GET /api/stats` route using Next.js App Router conventions.
- Maintains in-memory counters for `requests`, `tokens`, and `activeConnections`.
- Every time the endpoint is called, it **randomly increments** the values to simulate live traffic.
- Returns a JSON response:
  ```json
  { "requests": 1245, "tokens": 98543, "activeConnections": 37 }
  ```

### `app/components/CounterCard.tsx` — Reusable Card Component
- A simple, typed React component that accepts: `title`, `value`, `icon`, and `color`.
- Renders a white card with a shadow, rounded corners, large bold number, and an icon badge.
- Shows a pulsing dash (`—`) while data is loading (when `value` is `null`).

### `app/page.tsx` — Dashboard Page
- Marked `"use client"` so it can use React hooks in the App Router.
- Uses `useState` to hold the latest stats and last-updated timestamp.
- Uses `useEffect` to:
  1. Fetch `/api/stats` immediately on mount.
  2. Set a `setInterval` to re-fetch **every 10 seconds**.
  3. Clean up the interval on unmount to prevent memory leaks.
- Renders three `CounterCard` components in a **responsive CSS Grid** (1 column on mobile, 3 columns on tablet+).
- Shows a live animated green dot at the bottom to indicate real-time status.

---

## Key Concepts Demonstrated

| Concept | Where |
|---|---|
| Next.js App Router | `app/` directory structure |
| API Route Handler | `app/api/stats/route.ts` |
| Client Component | `"use client"` in `page.tsx` |
| `useEffect` polling | `setInterval` every 10 seconds |
| Reusable components | `CounterCard.tsx` with typed props |
| Tailwind CSS | Cards, grid, gradient background, animations |
| Responsive layout | `grid-cols-1 sm:grid-cols-3` |

---

## How to Run

```bash
npm run dev
```

Open `http://localhost:3000` — the dashboard loads, fetches live data, and automatically refreshes every 10 seconds.

---

## Demo Script Talking Points

1. **Show the running dashboard** — point out the three counter cards and the live indicator.
2. **Explain the auto-refresh** — watch the numbers increment on their own every 10 seconds.
3. **Open `route.ts`** — show how the API simulates live data with random increments.
4. **Open `page.tsx`** — highlight `useEffect` with `setInterval` and the cleanup return.
5. **Open `CounterCard.tsx`** — show how it's a simple reusable component driven by props.
6. **Resize the browser** — demonstrate the responsive grid collapsing to a single column on mobile.
