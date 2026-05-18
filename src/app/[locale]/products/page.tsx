"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "@components/product/ProductCard";
import { CATEGORY_VALUES } from "@constants/index";
import { cn } from "@utils/cn";
import { useGetProducts } from "@/react-query/queries/useProducts";

export default function ProductsPage() {
  const t = useTranslations("products");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const listParams = useMemo(
    () =>
      selectedCategory === "all"
        ? { page: 0, size: 50 }
        : { page: 0, size: 50, category: selectedCategory },
    [selectedCategory]
  );

  const { data, isFetching, isError, error } = useGetProducts(listParams);

  const products = data?.content ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">{t("title")}</h1>

      {isError && (
        <p className="mb-4 text-sm text-error" role="alert">
          {tCommon("errorLoad")}
          {"message" in (error as Error) ? ` (${(error as Error).message})` : ""}
        </p>
      )}

<div
        className="mb-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label={t("categoryFilter")}
      >
        {CATEGORY_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={selectedCategory === value}
            onClick={() => setSelectedCategory(value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors sm:px-4",
              "whitespace-nowrap",
              selectedCategory === value
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-600",
            )}
          >
            {tCat(value)}
          </button>
        ))}
      </div>

      {isFetching ? (
        <div className="py-20 text-center text-gray-500">{tCommon("loading")}</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-400">{t("noProducts")}</div>
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
