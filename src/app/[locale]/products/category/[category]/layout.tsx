import { getTranslations } from "next-intl/server";
import { CATEGORY_VALUES, type CategoryValue } from "@constants/index";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const tCat = await getTranslations({ locale, namespace: "categories" });
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  const categoryLabel = (CATEGORY_VALUES as readonly string[]).includes(category)
    ? tCat(category as CategoryValue)
    : category;

  return buildPageMetadata({
    locale,
    page: "category",
    path: `/products/category/${category}`,
    title: tSeo("category.title", { category: categoryLabel }),
    description: tSeo("category.description", { category: categoryLabel }),
  });
}

export function generateStaticParams() {
  return CATEGORY_VALUES.filter((c) => c !== "all").map((category) => ({
    category,
  }));
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
