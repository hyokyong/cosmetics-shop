"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@store/cartStore";
import { formatPrice } from "@utils/format";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">장바구니가 비어 있어요</h2>
        <p className="mt-2 text-sm text-gray-400">마음에 드는 상품을 담아보세요!</p>
        <Button className="mt-8 bg-primary-600 hover:bg-primary-700" asChild>
          <Link href="/products">쇼핑 계속하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">장바구니</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 상품 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-2xl border bg-white p-4 shadow-sm">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <Image
                  src={item.imageUrl || `https://picsum.photos/seed/${item.productId}/200/200`}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-gray-400">{item.color} / {item.size}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="삭제"
                    className="text-gray-300 hover:text-primary-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-md border text-sm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 결제 요약 */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">결제 요약</h2>
            <Separator className="my-4" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>상품 금액</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span>{totalPrice() >= 30000 ? "무료" : formatPrice(3000)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>총 결제 금액</span>
                <span className="text-primary-600">
                  {formatPrice(totalPrice() + (totalPrice() >= 30000 ? 0 : 3000))}
                </span>
              </div>
            </div>
            <Button className="mt-6 w-full bg-primary-600 hover:bg-primary-700" asChild>
              <Link href="/mypage">주문하기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
