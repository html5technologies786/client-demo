# Task 4 — Multi-Language i18n with RTL Support (Video Script)

## What Was Built

Extended the existing Next.js real-time dashboard from Task 1 with full internationalization (i18n) support using **next-intl**. The dashboard now supports three languages — English, Arabic (RTL), and Spanish — with a live language switcher and persistent locale memory.

---

## Project Structure (Changes Only)

```
web/
├── messages/                          ← NEW: Translation bundles
│   ├── en.json                        ← English strings
│   ├── ar.json                        ← Arabic strings (RTL)
│   └── es.json                        ← Spanish strings
│
├── app/
│   ├── i18n/
│   │   └── config.ts                  ← NEW: Locale config & RTL helper
│   ├── components/
│   │   ├── I18nProvider.tsx           ← NEW: Context + NextIntlClientProvider
│   │   ├── LanguageSwitcher.tsx       ← NEW: 3-button language picker
│   │   └── CounterCard.tsx            ← Unchanged
│   ├── layout.tsx                     ← UPDATED: Wraps app with I18nProvider
│   └── page.tsx                       ← UPDATED: All strings use t() hook
```

---

## What Each File Does

### `messages/en.json`, `ar.json`, `es.json` — Translation Bundles
- Each file holds the same set of keys with translated values.
- Keys used across the dashboard: `dashboardTitle`, `subtitle`, `lastUpdated`, `requestsMade`, `tokensUsed`, `activeConnections`, `live`, `language`.
- Arabic strings are fully right-to-left and use Arabic numerals in the subtitle.
- These are plain JSON — easy to hand off to a translator.

### `app/i18n/config.ts` — Central i18n Configuration
- Defines the `Locale` type (`"en" | "ar" | "es"`) as a TypeScript const array.
- Exports `localeNames` — the human-readable label shown in the switcher button for each locale.
- Exports `rtlLocales` — the list of locales that need `dir="rtl"` (currently just Arabic).
- Exports `isRTL(locale)` — a pure helper function used by the provider to set document direction.
- Exports `LOCALE_STORAGE_KEY` — the localStorage key used for persistence, kept in one place to avoid typos.

### `app/components/I18nProvider.tsx` — The i18n Brain
This is the most important new file. It does three things:

1. **State management** — holds `locale` in `useState`, starting with the default (`"en"`).
2. **Persistence** — on mount, reads `localStorage` and restores the previously saved locale.
3. **Document sync** — whenever locale changes, updates `document.documentElement.lang` and `document.documentElement.dir` (`"rtl"` or `"ltr"`), and writes the new value back to `localStorage`.

It also wraps children with `NextIntlClientProvider`, passing the matching message bundle. Because all three bundles are statically imported at the top of the file (they're tiny JSON), switching languages is instant with zero loading flash.

Exposes a `useLocale()` hook via React Context so any component in the tree can read or change the current locale.

### `app/components/LanguageSwitcher.tsx` — Language Picker UI
- Renders one button per locale using the `locales` array from config.
- The active locale gets an indigo filled background with a subtle scale-up — all other buttons use a ghost style.
- Uses `aria-pressed` for accessibility.
- Calls `setLocale()` from the `useLocale()` hook on click — the entire UI re-translates instantly.

### `app/layout.tsx` — Updated Root Layout
- Imports `I18nProvider` and wraps `<body>` contents with it.
- Adds `suppressHydrationWarning` to the `<html>` tag — this is required because the server renders `lang="en"` but the client may immediately change it to `"ar"` after reading localStorage. Without this attribute React would log a hydration warning.

### `app/page.tsx` — Updated Dashboard Page
- Imports `useTranslations` from `next-intl` and calls `t("key")` for every visible string.
- Adds `<LanguageSwitcher />` above the header.
- Replaces `ml-2` (left margin) with `ms-2` (margin-inline-start) — a Tailwind logical property that automatically flips to the correct side in RTL layouts.

---

## Key Concepts Demonstrated

| Concept | Where |
|---|---|
| next-intl without URL routing | `I18nProvider` + `NextIntlClientProvider` |
| TypeScript `as const` locale types | `app/i18n/config.ts` |
| Client-side locale persistence | `localStorage` in `I18nProvider` useEffect |
| RTL document direction switching | `document.documentElement.dir` in `I18nProvider` |
| `suppressHydrationWarning` | `app/layout.tsx` — prevents SSR/client mismatch warning |
| React Context for locale sharing | `LocaleContext` + `useLocale()` hook |
| Tailwind logical properties | `ms-2` instead of `ml-2` for RTL-safe spacing |
| Zero-flash locale switching | All message bundles statically imported |

---

## How RTL Works

When Arabic is selected:
1. `isRTL("ar")` returns `true`
2. `document.documentElement.dir = "rtl"` is set on the `<html>` element
3. The browser automatically mirrors all flex and grid layouts
4. Tailwind utilities like `justify-between`, `flex`, and `grid` follow the document direction natively
5. `ms-2` (margin-inline-start) flips to become a right margin automatically

No CSS overrides or manual mirroring needed.

---

## How Persistence Works

```
Page load → I18nProvider mounts
          → useEffect reads localStorage.getItem("preferred-locale")
          → If found and valid, calls setLocale(saved)
          → document dir/lang update
          → NextIntlClientProvider re-renders with correct messages
```

On every language change:
```
User clicks button → setLocale("ar")
                   → localStorage.setItem("preferred-locale", "ar")
                   → document.dir = "rtl"
                   → NextIntlClientProvider receives ar.json messages
                   → All t() calls re-render with Arabic text
```

---

## How to Run

```bash
cd web
npm run dev
```

Open `http://localhost:3000` and use the language buttons at the top to switch between English, العربية, and Español. Refresh the page — the selected language is restored automatically.

---

## Demo Script Talking Points

1. **Show the dashboard in English** — point out the three counter cards and the language switcher at the top.
2. **Click Español** — watch every label on the page translate instantly without a page reload.
3. **Click العربية** — show the full RTL flip: text direction, card layout, and alignment all mirror correctly.
4. **Refresh the page with Arabic active** — demonstrate that the language is restored from localStorage.
5. **Open `messages/ar.json`** — show the translated keys and explain how they map to the UI.
6. **Open `I18nProvider.tsx`** — walk through the three `useEffect` calls: mount restore, locale sync, document direction.
7. **Open `config.ts`** — show `isRTL()` and explain how adding a new RTL language is a one-line change.
8. **Open `page.tsx`** — highlight `useTranslations()` and `t("key")` replacing every hardcoded string, and explain `ms-2` vs `ml-2`.
