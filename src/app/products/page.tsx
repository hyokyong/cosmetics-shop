"use client";

import { useState } from "react";
import ProductCard from "@components/product/ProductCard";
import { CATEGORIES, API_QUERY_ENABLED } from "@constants/index";
import { cn } from "@utils/cn";
import { useGetProducts } from "@/react-query/queries/useProducts";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const listParams =
    selectedCategory === "all"
      ? { page: 0, size: 50 }
      : { page: 0, size: 50, category: selectedCategory };

  const { data, isFetching, isError, error } = useGetProducts(listParams, {
    enabled: API_QUERY_ENABLED.PRODUCTS,
  });

  const products = data?.content ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">전체 상품</h1>

      {isError && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          상품 목록을 불러오지 못했습니다.
          {"message" in (error as Error) ? ` (${(error as Error).message})` : ""}
        </p>
      )}

      {!API_QUERY_ENABLED.PRODUCTS && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          상품 목록은 <code className="rounded bg-white px-1 text-xs">API_QUERY_ENABLED.PRODUCTS</code>를
          true로 바꾼 뒤 GET /products 로 불러옵니다.
        </p>
      )}

      {/* 카테고리 필터 */}
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="카테고리 필터">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            role="tab"
            aria-selected={selectedCategory === cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              selectedCategory === cat.value
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:text-rose-600"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 상품 그리드 */}
      {!API_QUERY_ENABLED.PRODUCTS ? null : isFetching ? (
        <div className="py-20 text-center text-gray-500">불러오는 중…</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-400">표시할 상품이 없습니다.</div>
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
