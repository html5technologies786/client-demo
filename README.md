# Client Demo — Full-Stack Portfolio Project

A multi-platform demonstration project showcasing modern full-stack development across five progressive tasks. The project spans a Next.js web application, a React Native mobile app, a containerised backend infrastructure, internationalisation with RTL support, and a Stripe-powered metered billing feature.

---

## Project Structure

```
client-demo/
├── web/               Task 1 · Task 3 · Task 4 · Task 5  (Next.js app)
├── mobile/            Task 2                              (Expo / React Native)
├── api/               Task 3                              (Express API)
├── docker-compose.yml Task 3                              (Infrastructure)
└── .env.example       Task 3                              (Environment template)
```

---

## Tasks at a Glance

| # | Title | Stack | Location |
|---|---|---|---|
| 1 | Real-Time Dashboard | Next.js, Tailwind CSS | `web/` |
| 2 | Mobile Approval Workflow | React Native, Expo | `mobile/` |
| 3 | Dockerised Full-Stack Infrastructure | Docker Compose, Express, PostgreSQL | root |
| 4 | Multi-Language Support with RTL | next-intl, Arabic, Spanish | `web/` |
| 5 | Metered Billing with Stripe | Stripe API, Next.js API Routes | `web/` |

---

## Task 1 — Real-Time Dashboard

**Location:** `web/`

A live metrics dashboard built with Next.js (App Router) and Tailwind CSS. It displays three system counters — Requests Made, Tokens Used, and Active Connections — that automatically refresh every 10 seconds without any page reload.

### How it works
- A Next.js API route at `/api/stats` simulates live data by randomly incrementing values on each request.
- The frontend polls this endpoint every 10 seconds using `setInterval` inside a `useEffect` hook.
- Each counter is rendered inside a reusable `CounterCard` component.

### How to run
```bash
cd web
npm install
npm run dev
```
Open `http://localhost:3000`

### Key files
```
web/app/page.tsx                  Dashboard UI
web/app/api/stats/route.ts        Mock stats API
web/app/components/CounterCard.tsx Reusable metric card
```

---

## Task 2 — Mobile Message Approval Workflow

**Location:** `mobile/`

A React Native screen built with Expo that simulates a message triage workflow. A user can review a list of incoming messages — each annotated with an AI-generated summary — and either approve or reject them. Approved messages move to a handled section; rejected messages are dismissed.

### How it works
- A mock API function (`getMessages`) returns 5 sample messages with a simulated 500–1000ms network delay.
- The screen manages two state arrays: `incoming` and `handled`.
- Approving a message moves it from `incoming` to `handled`. Rejecting removes it entirely.
- A loading spinner displays while the mock API resolves, and an empty state appears when all messages have been actioned.

### How to run
```bash
cd mobile
npm install
npx expo start
```
- Press `i` to open in the iOS Simulator
- Press `a` to open in the Android Emulator
- Scan the QR code to open on a physical device via Expo Go

### Key files
```
mobile/api/mockApi.ts              Mock data and Message type
mobile/components/MessageCard.tsx  Reusable card with Approve / Reject
mobile/screens/MessagesScreen.tsx  Main screen with workflow state
mobile/App.tsx                     Entry point
```

---

## Task 3 — Dockerised Full-Stack Infrastructure

**Location:** `docker-compose.yml`, `api/`, `web/Dockerfile`

A production-ready Docker Compose setup that starts three services — a Next.js frontend, an Express API, and a PostgreSQL database — with a single command. Services communicate over a shared internal Docker network using service hostnames, never `localhost`.

### How it works
- **PostgreSQL** starts first, protected by a healthcheck (`pg_isready`).
- **Express API** waits for the database healthcheck to pass, then connects with retry logic (up to 10 attempts, 3 seconds apart).
- **Next.js** waits for the API to be available before starting.
- Data is persisted to a named Docker volume so the database survives container restarts.

### How to run
```bash
cp .env.example .env
docker compose up --build
```

| Service | URL |
|---|---|
| Next.js Frontend | `http://localhost:3000` |
| Express API | `http://localhost:5000/health` |
| PostgreSQL | `localhost:5432` |

### Key files
```
docker-compose.yml                 Service definitions, network, volumes
api/server.js                      Express server with DB retry logic
api/Dockerfile                     Multi-stage Node.js image
web/Dockerfile                     Multi-stage Next.js standalone image
.env.example                       Environment variable template
```

### Environment variables
```
POSTGRES_DB        Database name
POSTGRES_USER      Database user
POSTGRES_PASSWORD  Database password
DATABASE_URL       Full connection string for Express
API_URL            Internal Docker hostname for Next.js → Express
```

---

## Task 4 — Multi-Language Support with RTL

**Location:** `web/` (extends Task 1)

The dashboard is extended with full internationalisation using `next-intl`. Users can switch between English, Arabic (RTL), and Spanish at any time. The selected language is persisted in `localStorage` and restored on page reload. When Arabic is selected, the entire page layout mirrors correctly from right to left.

### How it works
- Three JSON translation bundles (`en.json`, `ar.json`, `es.json`) hold all UI strings.
- A custom `I18nProvider` component wraps the app. It reads the saved locale from `localStorage` on mount and updates `document.lang` and `document.dir` whenever the locale changes.
- `NextIntlClientProvider` receives the matching message bundle and makes it available to the entire component tree via `useTranslations()`.
- Tailwind logical properties (e.g. `ms-2` instead of `ml-2`) ensure spacing and alignment adapt automatically under RTL.

### How to run
```bash
cd web
npm run dev
```
Open `http://localhost:3000` and use the language buttons in the header.

### Key files
```
web/messages/en.json              English translations
web/messages/ar.json              Arabic translations
web/messages/es.json              Spanish translations
web/app/i18n/config.ts            Locale list, RTL detection helper
web/app/components/I18nProvider.tsx  Context, localStorage, document direction
web/app/components/LanguageSwitcher.tsx  Language picker UI
```

---

## Task 5 — Metered Billing with Stripe

**Location:** `web/` (extends Task 1)

A metered billing demo page at `/billing` that lets a user start and stop a timed session. The UI counts elapsed seconds, calculates a running cost in real time at $0.02 per second, and — when the session ends — sends the final amount to a backend API route that creates a Stripe PaymentIntent in test mode and returns its ID.

### How it works
- The `SessionTimer` component manages session state (`idle`, `running`, `ended`) and a `setInterval` tick.
- On end, the final cost (in dollars) is `POST`-ed to `/api/create-payment-intent`.
- The API route converts dollars to cents (`Math.round(amount × 100)`), calls the Stripe Node SDK, and returns the `paymentIntentId`.
- The Stripe secret key lives exclusively in the server-side environment — it is never exposed to the browser.

### How to run
```bash
cd web
cp .env.example .env.local
# Add your Stripe test secret key to .env.local
npm run dev
```
Open `http://localhost:3000/billing`

> Get a free test key at [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys).
> No real charges are made in test mode.

### Key files
```
web/app/billing/page.tsx                      Billing page (RSC shell)
web/app/components/SessionTimer.tsx           Timer, cost calculation, session state
web/app/api/create-payment-intent/route.ts    Stripe PaymentIntent API route
web/lib/stripe.ts                             Stripe singleton (server-side only)
web/.env.example                              Environment variable template
```

### Environment variables
```
STRIPE_SECRET_KEY              Stripe test secret key (server-side only)
NEXT_PUBLIC_PRICE_PER_SECOND   Billing rate shown in the UI (default: 0.02)
```

---

## Running the Full Web Application

All five web tasks run together in a single Next.js dev server.

```bash
cd web
cp .env.example .env.local       # add STRIPE_SECRET_KEY
npm install
npm run dev
```

| Page | URL | Task |
|---|---|---|
| Dashboard | `http://localhost:3000` | Task 1 + Task 4 |
| Billing | `http://localhost:3000/billing` | Task 5 |

Use the navigation bar at the top to move between pages. The language switcher on the dashboard page applies to all translated content.

---

## Technology Summary

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Web framework, API routes, server components |
| React 19 | UI component model |
| Tailwind CSS 4 | Utility-first styling |
| TypeScript | Type safety across all packages |
| next-intl | Internationalisation and RTL support |
| Stripe Node SDK | PaymentIntent creation (test mode) |
| Expo / React Native | Cross-platform mobile application |
| Express.js | REST API server |
| PostgreSQL | Relational database |
| Docker Compose | Multi-service container orchestration |
