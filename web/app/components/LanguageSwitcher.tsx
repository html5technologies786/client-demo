"use client";

import { useLocale } from "./I18nProvider";
import { locales, localeNames, type Locale } from "../i18n/config";

// ──────────────────────────────────────────────
//  LanguageSwitcher
//  Renders one button per supported locale.
//  The active locale is highlighted with an
//  indigo fill; others use a ghost style.
// ──────────────────────────────────────────────
export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-sm"
      role="group"
      aria-label="Language selector"
    >
      {locales.map((lang: Locale) => {
        const isActive = locale === lang;
        return (
          <button
            key={lang}
            onClick={() => setLocale(lang)}
            aria-pressed={isActive}
            className={[
              "px-3 py-1.5 rounded-xl text-sm font-semibold",
              "transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
              isActive
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
            ].join(" ")}
          >
            {localeNames[lang]}
          </button>
        );
      })}
    </div>
  );
}
