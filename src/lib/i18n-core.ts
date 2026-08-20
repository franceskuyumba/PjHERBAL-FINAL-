import { navEn, navSw } from "@/i18n/nav";
import { footerEn, footerSw } from "@/i18n/footer";
import { authEn, authSw } from "@/i18n/auth";
import { homeEn, homeSw } from "@/i18n/home";
import { shopEn, shopSw } from "@/i18n/shop";
import { productEn, productSw } from "@/i18n/product";
import { cartEn, cartSw } from "@/i18n/cart";
import { checkoutEn, checkoutSw } from "@/i18n/checkout";
import { searchEn, searchSw } from "@/i18n/search";
import { dashEn, dashSw } from "@/i18n/dash";
import { invoiceEn, invoiceSw } from "@/i18n/invoice";
import { blogEn, blogSw } from "@/i18n/blog";
import { aboutEn, aboutSw } from "@/i18n/about";
import { contactEn, contactSw } from "@/i18n/contact";
import { liveEn, liveSw } from "@/i18n/live";
import { adminEn, adminSw } from "@/i18n/admin";
import { admin2En, admin2Sw } from "@/i18n/admin2";
import { uiEn, uiSw } from "@/i18n/ui";
import { admin3En, admin3Sw } from "@/i18n/admin3";
import { dashSpotlightEn, dashSpotlightSw } from "@/i18n/dashSpotlight";

export type Locale = "en" | "sw";
export const DEFAULT_LOCALE: Locale = "en";
export const LANG_COOKIE = "pjherbal_lang";

export type DictValue = string | { [key: string]: DictValue };
export type Dict = { [key: string]: DictValue };

export const en: Dict = {
  nav: navEn,
  footer: footerEn,
  auth: authEn,
  home: homeEn,
  shop: shopEn,
  product: productEn,
  cart: cartEn,
  checkout: checkoutEn,
  search: searchEn,
  dash: { ...dashEn, spotlight: dashSpotlightEn },
  invoice: invoiceEn,
  blog: blogEn,
  about: aboutEn,
  contact: contactEn,
  live: liveEn,
  ui: uiEn,
  admin: { ...adminEn, ...admin2En, ...admin3En },
  admin2: admin2En,
  admin3: admin3En,
};

export const sw: Dict = {
  nav: navSw,
  footer: footerSw,
  auth: authSw,
  home: homeSw,
  shop: shopSw,
  product: productSw,
  cart: cartSw,
  checkout: checkoutSw,
  search: searchSw,
  dash: { ...dashSw, spotlight: dashSpotlightSw },
  invoice: invoiceSw,
  blog: blogSw,
  about: aboutSw,
  contact: contactSw,
  live: liveSw,
  ui: uiSw,
  admin: { ...adminSw, ...admin2Sw, ...admin3Sw },
  admin2: admin2Sw,
  admin3: admin3Sw,
};

export const dictionaries: Record<Locale, Dict> = { en, sw };

/** Resolves a dotted key (e.g. "home.hero.title") inside a dictionary. Falls back to the key itself. */
export function resolvePath(dict: Dict, path: string): string {
  const value = path.split(".").reduce<DictValue | undefined>((node, key) => {
    if (node && typeof node === "object") return (node as Dict)[key];
    return undefined;
  }, dict);
  return typeof value === "string" ? value : path;
}

/** Translate helper. Safe to use in both server and client code (no request-scoped APIs). */
export function t(lang: Locale, path: string): string {
  return resolvePath(dictionaries[lang], path);
}
