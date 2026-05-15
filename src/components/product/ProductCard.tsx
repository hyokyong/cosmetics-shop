"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types/index";
import { useCartStore } from "@store/cartStore";
import { useWishlistStore } from "@store/wishlistStore";
import { formatPrice } from "@utils/format";
import { cn } from "@utils/cn";
import { toast } from "@hooks/useToast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWished } = useWishlistStore();
  const wished = isWished(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultOption = product.options[0];
    if (!defaultOption) return;
    addItem({
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      optionId: defaultOption.id,
      color: defaultOption.color,
      size: defaultOption.size,
      price: product.basePrice + defaultOption.additionalPrice,
      quantity: 1,
    });
    toast({ title: "장바구니에 담았어요!", description: product.name });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    toast({
      title: wished ? "즐겨찾기에서 제거했어요" : "즐겨찾기에 추가했어요!",
    });
  };

  return (
    <article className="group relative rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/products/${product.id}`}>
        {/* 상품 이미지 */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* 액션 버튼 */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={handleWishlist}
              aria-label="즐겨찾기"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-colors",
                wished ? "text-primary-500" : "text-gray-400 hover:text-primary-500"
              )}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-primary-500")} />
            </button>
            <button
              onClick={handleAddToCart}
              aria-label="장바구니 담기"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="p-4">
          <p className="text-xs text-primary-500 font-medium mb-1">{product.brandName}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* 별점 */}
          {product.averageRating !== undefined && (
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-gray-500">
                {product.averageRating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          )}

          <p className="mt-2 text-base font-bold text-gray-900">
            {formatPrice(product.basePrice)}
          </p>
        </div>
      </Link>
    </article>
  );
}
