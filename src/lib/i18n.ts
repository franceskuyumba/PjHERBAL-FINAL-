import { cookies } from "next/headers";
import { LANG_COOKIE, dictionaries, type Locale } from "@/lib/i18n-core";

export {
  en,
  sw,
  dictionaries,
  resolvePath,
  t,
  DEFAULT_LOCALE,
  LANG_COOKIE,
  type Dict,
  type DictValue,
  type Locale,
} from "@/lib/i18n-core";

/** Server-side locale from the pjherbal_lang cookie. Only callable in a Server Component / route handler. */
export function getLocale(): Locale {
  const value = cookies().get(LANG_COOKIE)?.value;
  return value === "sw" ? "sw" : "en";
}
