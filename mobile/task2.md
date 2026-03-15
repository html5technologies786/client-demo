# Task 2 — Message Approval Workflow (Video Script)

## What Was Built

A real-world React Native mobile screen using **Expo** and **TypeScript** that simulates a message approval workflow — where a user can review incoming messages, approve or reject them, and see approved ones in a handled section.

---

## Project Structure

```
mobile/
├── App.tsx                        ← Entry point
├── api/
│   └── mockApi.ts                 ← Mock API: getMessages()
├── components/
│   └── MessageCard.tsx            ← Reusable message card component
└── screens/
    └── MessagesScreen.tsx         ← Main screen with workflow logic
```

---

## What Each File Does

### `api/mockApi.ts` — Mock API
- Defines the `Message` TypeScript interface with fields: `id`, `sender`, `message`, `aiSummary`.
- Contains 5 hardcoded sample messages from realistic senders:
  - Customer Support
  - Website Contact Form
  - WhatsApp Lead
  - Email Inquiry
- `getMessages()` returns a `Promise<Message[]>` with a simulated **500–1000ms network delay** using `setTimeout` — mimicking a real API call.

### `components/MessageCard.tsx` — Reusable Card Component
- Accepts props: `message`, `onApprove`, `onReject`, and `handled`.
- Renders:
  - A **sender badge** (purple) identifying the message source.
  - The **message body** text.
  - An **AI Summary box** with a left accent border — styled to look like an AI insight panel.
  - **Approve (green)** and **Reject (red)** action buttons — only shown when `handled=false`.
  - A **"✓ Approved" badge** in place of buttons when `handled=true`.
- Uses `StyleSheet.create` for clean, maintainable styles with shadows and rounded corners.
- Works identically on both **iOS and Android**.

### `screens/MessagesScreen.tsx` — Main Screen
- Manages three pieces of React state:
  - `incoming` — messages waiting for review.
  - `handled` — messages that were approved.
  - `loading` — controls the loading spinner.
- On mount, `useEffect` calls `getMessages()` and populates `incoming` once resolved.
- **Approve logic**: finds the message by ID, removes it from `incoming`, prepends it to `handled`.
- **Reject logic**: removes the message from `incoming` — it disappears entirely.
- Renders two clearly labeled sections:
  - **Incoming Messages** — with a live count badge and action cards.
  - **Handled** — with a green count badge showing approved messages.
- **Loading state**: shows an `ActivityIndicator` spinner while the API call is in flight.
- **Empty state**: shows a "🎉 All clear!" card when all incoming messages have been actioned.

### `App.tsx` — Entry Point
- Replaces the default Expo boilerplate.
- Mounts `MessagesScreen` as the root component with a dark `StatusBar`.

---

## Key Concepts Demonstrated

| Concept | Where |
|---|---|
| TypeScript interfaces | `Message` type in `mockApi.ts` |
| Mock API with async delay | `getMessages()` using `setTimeout` + `Promise` |
| `useEffect` for data fetching | On mount in `MessagesScreen.tsx` |
| `useState` for workflow state | `incoming`, `handled`, `loading` |
| Conditional rendering | Loading spinner, empty state, handled badge vs buttons |
| Reusable typed component | `MessageCard.tsx` with props interface |
| React Native styling | `StyleSheet.create`, shadows, rounded corners |
| Cross-platform compatibility | Pure RN + Expo — works on iOS and Android |

---

## How to Run

```bash
cd mobile
npx expo start
```

- Press `i` — opens iOS Simulator
- Press `a` — opens Android Emulator
- Scan QR code — opens on a physical device via Expo Go

---

## Demo Script Talking Points

1. **Launch the app** — show the loading spinner while the mock API resolves (500–1000ms delay).
2. **Show the Incoming Messages section** — walk through the 5 message cards: sender badge, message text, AI summary.
3. **Tap Approve on a message** — watch it instantly move to the Handled section below.
4. **Tap Reject on a message** — watch it disappear from the list entirely.
5. **Open `mockApi.ts`** — explain the `Message` interface and how `getMessages()` simulates a real API with a random delay.
6. **Open `MessagesScreen.tsx`** — show the three state variables and walk through `handleApprove` and `handleReject`.
7. **Open `MessageCard.tsx`** — highlight how the same component renders differently based on the `handled` prop.
8. **Approve all remaining messages** — trigger the "🎉 All clear!" empty state to show the workflow is complete.
