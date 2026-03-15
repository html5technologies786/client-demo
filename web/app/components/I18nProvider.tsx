"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import {
  type Locale,
  defaultLocale,
  isRTL,
  LOCALE_STORAGE_KEY,
} from "../i18n/config";

// ──────────────────────────────────────────────
//  Import all message bundles statically.
//  They are tiny JSON files — no async loading
//  needed, which prevents any translation flash.
// ──────────────────────────────────────────────
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";
import es from "../../messages/es.json";

const allMessages = { en, ar, es } as const;

// ──────────────────────────────────────────────
//  Locale context — lets any child component
//  read and change the current locale without
//  prop drilling
// ──────────────────────────────────────────────
interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

// ──────────────────────────────────────────────
//  I18nProvider
//  - Restores saved locale from localStorage on mount
//  - Syncs document lang + dir on every locale change
//  - Wraps children with NextIntlClientProvider so
//    useTranslations() works anywhere in the tree
// ──────────────────────────────────────────────
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Restore persisted locale after first render (client-only)
  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (saved && saved in allMessages) {
      setLocaleState(saved);
    }
  }, []);

  // Sync document attributes and persist whenever locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr";
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: setLocaleState }}>
      {/*
        Pass the matching messages bundle to NextIntlClientProvider.
        Switching locale re-renders this provider with new messages,
        which instantly re-translates every useTranslations() call.
      */}
      <NextIntlClientProvider locale={locale} messages={allMessages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
