"use client";

import Image from "next/image";
import { Button } from "@components/ui/button";
import { toast } from "@hooks/useToast";
import { formatPrice } from "@utils/format";
import { Product } from "@/types/index";
import { Trash2, Eye, EyeOff } from "lucide-react";
import {
  useGetProducts,
  usePutProduct,
  useDeleteProduct,
} from "@/react-query/queries/useProducts";

const listParams = { page: 0, size: 50 } as const;

export default function AdminProductsPage() {
  const { data, isFetching, isError, error } = useGetProducts(listParams);

  const putProductMutation = usePutProduct();
  const deleteProductMutation = useDeleteProduct();

  const products = data?.content ?? [];

  const toggleVisible = (product: Product) => {
    putProductMutation.mutate(
      { id: product.id, body: { isVisible: !product.isVisible } },
      {
        onSuccess: () => {
          toast({ title: "노출 상태가 변경되었습니다" });
        },
        onError: () => {
          toast({
            title: "노출 변경에 실패했습니다",
            variant: "destructive",
          });
        },
      },
    );
  };

  const removeProduct = (id: number) => {
    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "상품이 삭제되었습니다" });
      },
      onError: () => {
        toast({
          title: "삭제에 실패했습니다",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
        <Button className="bg-primary-600 hover:bg-primary-700">
          + 상품 등록
        </Button>
      </div>

      {isError && (
        <p className="mb-4 text-sm text-error" role="alert">
          상품 목록을 불러오지 못했습니다.
          {"message" in (error as Error)
            ? ` (${(error as Error).message})`
            : ""}
        </p>
      )}

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">상품</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">
                브랜드
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                카테고리
              </th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">
                가격
              </th>
              <th className="px-4 py-3 text-center">노출</th>
              <th className="px-4 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isFetching ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  불러오는 중…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  등록된 상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100 shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {product.brandName}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-right font-medium hidden sm:table-cell">
                    {formatPrice(product.basePrice)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleVisible(product)}
                      disabled={putProductMutation.isPending}
                      aria-label="노출 토글"
                    >
                      {product.isVisible ? (
                        <Eye className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-300 mx-auto" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        수정
                      </Button>
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        disabled={deleteProductMutation.isPending}
                        aria-label="삭제"
                        className="text-gray-300 hover:text-error transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalElements > 0 && (
        <p className="mt-4 text-xs text-gray-500">
          총 {data.totalElements}건 · {data.number + 1} / {data.totalPages}
          페이지
        </p>
      )}
    </div>
  );
}
