"use client";

import { useEffect, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@store/wishlistStore";
import { Button } from "@components/ui/button";
import ProductCard from "@components/product/ProductCard";
import { useGetProducts } from "@/react-query/queries/useProducts";

export default function WishlistPage() {
  const { productIds, keepOnly } = useWishlistStore();

  const { data, isFetching } = useGetProducts({ page: 0, size: 200 });

  const allProducts = useMemo(() => data?.content ?? [], [data]);
  const wishedProducts = useMemo(
    () => allProducts.filter((p) => productIds.includes(p.id)),
    [allProducts, productIds]
  );

  useEffect(() => {
    if (!isFetching && data) {
      const validIds = allProducts.map((p) => p.id);
      keepOnly(validIds);
    }
  }, [isFetching, data]);

  if (isFetching) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-500 sm:px-6 lg:px-8">
        불러오는 중…
      </div>
    );
  }

  if (productIds.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Heart className="mx-auto h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">즐겨찾기가 비어 있어요</h2>
        <p className="mt-2 text-sm text-gray-400">마음에 드는 상품을 즐겨찾기에 추가해보세요!</p>
        <Button className="mt-8 bg-primary-600 hover:bg-primary-700" asChild>
          <Link href="/products">상품 둘러보기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        즐겨찾기 <span className="text-primary-500">({wishedProducts.length})</span>
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {wishedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
