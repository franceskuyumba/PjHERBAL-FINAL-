"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { dictionaries, resolvePath, DEFAULT_LOCALE, LANG_COOKIE, type Locale } from "@/lib/i18n-core";

interface LanguageContextValue {
  lang: Locale;
  setLang: (lang: Locale) => void;
  toggle: () => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readSavedLang(): Locale {
  try {
    const fromStorage = localStorage.getItem(LANG_COOKIE);
    if (fromStorage === "sw") return "sw";
    const fromCookie = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${LANG_COOKIE}=`));
    if (fromCookie?.endsWith("=sw")) return "sw";
  } catch {
    // ignore storage errors
  }
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [lang, setLangState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLangState(readSavedLang());
  }, []);

  const setLang = useCallback(
    (next: Locale) => {
      setLangState(next);
      try {
        localStorage.setItem(LANG_COOKIE, next);
      } catch {
        // ignore storage errors
      }
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [router]
  );

  const toggle = useCallback(() => {
    setLang(lang === "en" ? "sw" : "en");
  }, [lang, setLang]);

  const t = useCallback((path: string) => resolvePath(dictionaries[lang], path), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}
