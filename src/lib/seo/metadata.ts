import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/config/site";

export type SeoPageKey =
  | "home"
  | "products"
  | "productDetail"
  | "category"
  | "cart"
  | "wishlist"
  | "mypage"
  | "login"
  | "signup"
  | "admin"
  | "adminPartners"
  | "adminProducts";

type BuildPageMetadataOptions = {
  locale: string;
  page: SeoPageKey;
  /** locale 제외 경로 (예: `/products`, ``) */
  path: string;
  title?: string;
  description?: string;
  noIndex?: boolean;
  openGraphImage?: string;
};

export async function buildPageMetadata({
  locale,
  page,
  path,
  title,
  description,
  noIndex = false,
  openGraphImage,
}: BuildPageMetadataOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const siteName = t("siteName");

  const pageTitle = title ?? t(`${page}.title`);
  const pageDescription = description ?? t(`${page}.description`);
  const fullTitle = page === "home" ? pageTitle : `${pageTitle} | ${siteName}`;

  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") || path === "" ? path : `/${path}`;
  const canonical = new URL(`/${locale}${normalizedPath}`, baseUrl);

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = new URL(`/${loc}${normalizedPath}`, baseUrl).toString();
  }
  languages["x-default"] = new URL(
    `/${routing.defaultLocale}${normalizedPath}`,
    baseUrl,
  ).toString();

  const ogLocale =
    locale === "ar" ? "ar_SA" : locale === "ko" ? "ko_KR" : "en_US";

  return {
    metadataBase: new URL(baseUrl),
    title: fullTitle,
    description: pageDescription,
    alternates: {
      canonical: canonical.toString(),
      languages,
    },
    openGraph: {
      title: fullTitle,
      description: pageDescription,
      url: canonical.toString(),
      siteName,
      locale: ogLocale,
      type: "website",
      ...(openGraphImage ? { images: [{ url: openGraphImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: pageDescription,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function assertLocale(locale: string): Locale {
  if (!routing.locales.includes(locale as Locale)) {
    return routing.defaultLocale;
  }
  return locale as Locale;
}
