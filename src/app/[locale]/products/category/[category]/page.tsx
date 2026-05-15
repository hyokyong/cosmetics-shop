"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ProductCard from "@components/product/ProductCard";
import { API_QUERY_ENABLED, CATEGORY_VALUES, type CategoryValue } from "@constants/index";
import { useGetProducts } from "@/react-query/queries/useProducts";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const t = useTranslations("products");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");

  const categoryLabel = (CATEGORY_VALUES as readonly string[]).includes(category)
    ? tCat(category as CategoryValue)
    : category;

  const { data, isFetching, isError, error } = useGetProducts(
    { page: 0, size: 50, category },
    { enabled: API_QUERY_ENABLED.PRODUCTS },
  );

  const products = data?.content ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">{categoryLabel}</h1>

      {!API_QUERY_ENABLED.PRODUCTS && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t("apiDisabled")}
        </p>
      )}

      {isError && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {tCommon("errorLoad")}
          {"message" in (error as Error) ? ` (${(error as Error).message})` : ""}
        </p>
      )}

      {!API_QUERY_ENABLED.PRODUCTS ? null : isFetching ? (
        <div className="py-20 text-center text-gray-500">{tCommon("loading")}</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-400">{t("noCategoryProducts")}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
