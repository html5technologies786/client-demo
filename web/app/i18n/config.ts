// ──────────────────────────────────────────────
//  i18n configuration
//  Single source of truth for supported locales,
//  display names, and RTL detection
// ──────────────────────────────────────────────

export const locales = ["en", "ar", "es"] as const;
export type Locale = (typeof locales)[number];

/** Human-readable label shown in the language switcher */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  es: "Español",
};

/** Locales that require right-to-left layout */
export const rtlLocales: ReadonlyArray<Locale> = ["ar"];

export const defaultLocale: Locale = "en";

export const LOCALE_STORAGE_KEY = "preferred-locale";

/** Returns true when the given locale needs dir="rtl" */
export function isRTL(locale: Locale): boolean {
  return (rtlLocales as ReadonlyArray<string>).includes(locale);
}
