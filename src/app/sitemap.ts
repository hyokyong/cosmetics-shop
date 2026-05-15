import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/config/site";
import {
  fetchProductIdsForSitemap,
  getPublicStaticPaths,
} from "@/lib/seo/sitemap-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const staticPaths = getPublicStaticPaths();
  const productIds = await fetchProductIdsForSitemap();
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      const isHome = path === "";
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: isHome ? "daily" : "weekly",
        priority: isHome ? 1 : path.startsWith("/products") ? 0.8 : 0.5,
      });
    }

    for (const id of productIds) {
      entries.push({
        url: `${baseUrl}/${locale}/products/${id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
