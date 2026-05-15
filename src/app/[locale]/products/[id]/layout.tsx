import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { fetchProductForSeo } from "@/lib/seo/sitemap-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const productId = Number(id);
  const t = await getTranslations({ locale, namespace: "seo" });
  const path = `/products/${id}`;

  if (Number.isFinite(productId) && productId > 0) {
    const product = await fetchProductForSeo(productId);
    if (product) {
      const description = product.brandName
        ? `${product.name} — ${product.brandName}. ${t("productDetail.description")}`
        : `${product.name}. ${t("productDetail.description")}`;
      return buildPageMetadata({
        locale,
        page: "productDetail",
        path,
        title: product.name,
        description,
        openGraphImage: product.imageUrl,
      });
    }
  }

  return buildPageMetadata({ locale, page: "productDetail", path });
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
