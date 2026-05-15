"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingCart, Star, ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@store/cartStore";
import { useWishlistStore } from "@store/wishlistStore";
import { formatPrice } from "@utils/format";
import { cn } from "@utils/cn";
import { Button } from "@components/ui/button";
import { toast } from "@hooks/useToast";
import { API_QUERY_ENABLED } from "@constants/index";
import { useGetProduct } from "@/react-query/queries/useProducts";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const idValid = Number.isFinite(id) && id > 0;
  const queryEnabled = API_QUERY_ENABLED.PRODUCT_DETAIL && idValid;

  const { data: product, isFetching, isError, error } = useGetProduct(id, {
    enabled: queryEnabled,
  });

  const [pickedOptionId, setPickedOptionId] = useState<number | null>(null);

  const selectedOption = useMemo(() => {
    if (!product?.options?.length) return null;
    if (pickedOptionId != null) {
      const found = product.options.find((o) => o.id === pickedOptionId);
      if (found) return found;
    }
    return product.options[0];
  }, [product, pickedOptionId]);

  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWished } = useWishlistStore();

  if (!idValid) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-600 sm:px-6 lg:px-8">
        잘못된 상품입니다.
        <div className="mt-4">
          <Link href="/products" className="text-rose-600 hover:underline">상품 목록</Link>
        </div>
      </div>
    );
  }

  if (!API_QUERY_ENABLED.PRODUCT_DETAIL) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-gray-600">
          상품 상세는 백엔드 연동 후 표시됩니다.{" "}
          <code className="rounded bg-gray-100 px-1 text-xs">API_QUERY_ENABLED.PRODUCT_DETAIL</code>을
          true로 설정하세요.
        </p>
        <Link href="/products" className="mt-4 inline-block text-rose-600 hover:underline">
          상품 목록
        </Link>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-500 sm:px-6 lg:px-8">
        불러오는 중…
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-red-600">
          상품을 불러오지 못했습니다.
          {error && "message" in (error as Error) ? ` (${(error as Error).message})` : ""}
        </p>
        <Link href="/products" className="mt-4 inline-block text-rose-600 hover:underline">
          상품 목록으로
        </Link>
      </div>
    );
  }

  if (!selectedOption) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-600 sm:px-6 lg:px-8">
        이 상품에 선택 가능한 옵션이 없습니다.
        <Link href="/products" className="mt-4 block text-rose-600 hover:underline">
          상품 목록
        </Link>
      </div>
    );
  }

  const wished = isWished(product.id);
  const totalPrice = (product.basePrice + selectedOption.additionalPrice) * quantity;

  const handleAddToCart = () => {
    addItem({
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      optionId: selectedOption.id,
      color: selectedOption.color,
      size: selectedOption.size,
      price: product.basePrice + selectedOption.additionalPrice,
      quantity,
    });
    toast({ title: "장바구니에 담았어요!", description: product.name });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-rose-600">
        <ChevronLeft className="h-4 w-4" /> 상품 목록
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold text-rose-500">{product.brandName}</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h1>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.averageRating ?? 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {(product.averageRating ?? 0).toFixed(1)} ({product.reviewCount ?? 0}개 리뷰)
              </span>
            </div>
          </div>

          <p className="text-3xl font-bold text-gray-900">{formatPrice(product.basePrice)}</p>

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">옵션 선택</p>
            <div className="flex flex-wrap gap-2">
              {product.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPickedOptionId(opt.id)}
                  disabled={opt.quantity === 0}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40",
                    selectedOption.id === opt.id
                      ? "border-rose-500 bg-rose-50 text-rose-600"
                      : "border-gray-200 bg-white text-gray-700 hover:border-rose-300"
                  )}
                >
                  {opt.color} / {opt.size}
                  {opt.additionalPrice > 0 && (
                    <span className="ml-1 text-xs text-rose-500">+{formatPrice(opt.additionalPrice)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">수량</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border text-gray-600 hover:border-rose-300"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(selectedOption.quantity, q + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border text-gray-600 hover:border-rose-300"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">총 금액</span>
            <span className="text-xl font-bold text-rose-600">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggle(product.id)}
              className={cn("shrink-0", wished && "border-rose-500 text-rose-500")}
              aria-label="즐겨찾기"
            >
              <Heart className={cn("h-5 w-5", wished && "fill-rose-500 text-rose-500")} />
            </Button>
            <Button
              className="flex-1 bg-rose-600 hover:bg-rose-700"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              장바구니 담기
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-gray-900">상품 설명</h2>
        <div className="rounded-2xl bg-gray-50 p-6 text-sm leading-relaxed text-gray-600">
          <p>피부 깊은 곳까지 수분을 공급하는 광채 크림입니다.</p>
          <p className="mt-2">제주 녹차 성분이 풍부하게 함유되어 있어 피부를 진정시키고 영양을 공급합니다.</p>
          <p className="mt-2">모든 피부 타입에 사용 가능하며, 자극 없는 순한 성분으로 만들어졌습니다.</p>
        </div>
      </div>
    </div>
  );
}
