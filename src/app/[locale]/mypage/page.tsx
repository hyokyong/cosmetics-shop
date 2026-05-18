"use client";

import { useAuthStore } from "@store/authStore";
import { useGetOrders } from "@/react-query/queries/useOrders";
import { useGetShippingAddresses } from "@/react-query/queries/useShipping";
import { formatPrice, formatDate } from "@utils/format";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { User, Package, MapPin, LogOut } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "@hooks/useToast";
import { cn } from "@utils/cn";
import { orderStatusClass } from "@/config/design-tokens";

export default function MyPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const {
    data: orders = [],
    isFetching: ordersLoading,
    isError: ordersError,
    error: ordersErr,
  } = useGetOrders();

  const {
    data: addresses = [],
    isFetching: shippingLoading,
    isError: shippingError,
    error: shippingErr,
  } = useGetShippingAddresses();

  const handleLogout = () => {
    logout();
    toast({ title: "로그아웃 되었습니다" });
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">마이페이지</h1>

      <div className="grid gap-6">
        <section
          className="rounded-2xl border bg-white p-6 shadow-sm"
          aria-label="계정 정보"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                <User className="h-7 w-7 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {user?.email ?? "게스트"}
                </p>
                <p className="text-sm text-gray-400">
                  {user?.role ?? "CUSTOMER"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </section>

        <section
          className="rounded-2xl border bg-white p-6 shadow-sm"
          aria-label="주문 내역"
        >
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary-500" />
            <h2 className="text-lg font-bold text-gray-900">주문 내역</h2>
          </div>

          {ordersError && (
            <p className="mb-3 text-sm text-error" role="alert">
              주문 내역을 불러오지 못했습니다.
              {ordersErr && "message" in (ordersErr as Error)
                ? ` (${(ordersErr as Error).message})`
                : ""}
            </p>
          )}

          {ordersLoading ? (
            <p className="text-sm text-gray-500">불러오는 중…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-500">주문 내역이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.items[0]?.productName ?? "상품"}
                        {order.items.length > 1 &&
                          ` 외 ${order.items.length - 1}건`}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        orderStatusClass[order.status],
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {formatPrice(order.totalPrice)}
                    </span>
                    {order.status === "주문완료" && (
                      <Button variant="outline" size="sm" className="text-xs">
                        주문 취소
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          className="rounded-2xl border bg-white p-6 shadow-sm"
          aria-label="배송지 관리"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-bold text-gray-900">배송지 관리</h2>
            </div>
            <Button size="sm" variant="outline">
              + 배송지 추가
            </Button>
          </div>

          {shippingError && (
            <p className="mb-3 text-sm text-error" role="alert">
              배송지를 불러오지 못했습니다.
              {shippingErr && "message" in (shippingErr as Error)
                ? ` (${(shippingErr as Error).message})`
                : ""}
            </p>
          )}

          {shippingLoading ? (
            <p className="text-sm text-gray-500">불러오는 중…</p>
          ) : addresses.length === 0 ? (
            <div className="rounded-xl border p-4 text-center text-sm text-gray-500">
              등록된 배송지가 없습니다
            </div>
          ) : (
            <ul className="space-y-3">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className="rounded-xl border p-4 text-sm text-gray-700"
                >
                  <p>{addr.address}</p>
                  <p className="text-gray-500">{addr.detailAddress}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {addr.zipCode}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
