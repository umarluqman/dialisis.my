import {getRequestConfig} from "next-intl/server";

import {defaultLocale, locales} from "./routing";

export default getRequestConfig(async ({locale}) => {
  const resolvedLocale = locales.includes(locale as (typeof locales)[number])
    ? (locale as (typeof locales)[number])
    : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
    timeZone: "Asia/Kuala_Lumpur",
  };
});
