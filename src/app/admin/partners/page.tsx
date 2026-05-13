"use client";

import { useState } from "react";
import {
  useGetPartners,
  usePostPartner,
  usePatchPartnerActive,
} from "@/react-query/queries/usePartners";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { toast } from "@hooks/useToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Partner } from "@/types/index";
import { API_QUERY_ENABLED } from "@constants/index";

// 목업 파트너 데이터 (로컬 목업 사용 시 아래 주석 해제 후 `API_QUERY_ENABLED.ADMIN_PARTNERS` 끄기)
// const MOCK_PARTNERS: Partner[] = [
//   {
//     id: 1,
//     email: "innisfree@partner.com",
//     brandName: "이니스프리",
//     businessNumber: "123-45-67890",
//     isActive: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: 2,
//     email: "lrp@partner.com",
//     brandName: "라로슈포제",
//     businessNumber: "234-56-78901",
//     isActive: true,
//     createdAt: "2024-02-01T00:00:00Z",
//   },
//   {
//     id: 3,
//     email: "cosrx@partner.com",
//     brandName: "코스알엑스",
//     businessNumber: "345-67-89012",
//     isActive: false,
//     createdAt: "2024-03-01T00:00:00Z",
//   },
// ];

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요"),
  password: z.string().min(6, "6자 이상"),
  brandName: z.string().min(1, "브랜드명을 입력해주세요"),
  businessNumber: z.string().min(1, "사업자등록번호를 입력해주세요"),
});
type FormData = z.infer<typeof schema>;

export default function AdminPartnersPage() {
  const [showForm, setShowForm] = useState(false);

  const {
    data: partners = [],
    isFetching,
    isError,
    error,
  } = useGetPartners({
    enabled: API_QUERY_ENABLED.ADMIN_PARTNERS,
  });

  const postPartnerMutation = usePostPartner();
  const patchActiveMutation = usePatchPartnerActive();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    postPartnerMutation.mutate(
      {
        email: data.email,
        password: data.password,
        brandName: data.brandName,
        businessNumber: data.businessNumber,
      },
      {
        onSuccess: () => {
          toast({ title: "파트너가 등록되었습니다!" });
          reset();
          setShowForm(false);
        },
        onError: () => {
          toast({
            title: "등록에 실패했습니다",
            variant: "destructive",
          });
        },
      },
    );
  };

  const toggleActive = (partner: Partner) => {
    patchActiveMutation.mutate(
      { id: partner.id, isActive: !partner.isActive },
      {
        onSuccess: () => {
          toast({ title: "파트너 상태가 변경되었습니다" });
        },
        onError: () => {
          toast({
            title: "상태 변경에 실패했습니다",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">파트너 관리</h1>
        <Button
          className="bg-rose-600 hover:bg-rose-700"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "취소" : "+ 파트너 등록"}
        </Button>
      </div>

      {/* 등록 폼 */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-8 rounded-2xl border bg-white p-6 shadow-sm space-y-4"
        >
          <h2 className="font-bold text-gray-900">파트너 등록</h2>
          <Separator />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>이메일</Label>
              <Input placeholder="partner@email.com" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>브랜드명</Label>
              <Input placeholder="브랜드명 입력" {...register("brandName")} />
              {errors.brandName && (
                <p className="text-xs text-red-500">
                  {errors.brandName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>사업자등록번호</Label>
              <Input
                placeholder="000-00-00000"
                {...register("businessNumber")}
              />
              {errors.businessNumber && (
                <p className="text-xs text-red-500">
                  {errors.businessNumber.message}
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="bg-rose-600 hover:bg-rose-700"
            disabled={postPartnerMutation.isPending}
          >
            {postPartnerMutation.isPending ? "등록 중…" : "등록하기"}
          </Button>
        </form>
      )}

      {isError && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          파트너 목록을 불러오지 못했습니다.
          {"message" in (error as Error)
            ? ` (${(error as Error).message})`
            : ""}
        </p>
      )}

      {/* 파트너 목록 */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">브랜드</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">
                이메일
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                사업자번호
              </th>
              <th className="px-4 py-3 text-center">상태</th>
              <th className="px-4 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isFetching ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  불러오는 중…
                </td>
              </tr>
            ) : partners.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  등록된 파트너가 없습니다.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {partner.brandName}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                    {partner.email}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {partner.businessNumber}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={partner.isActive ? "default" : "secondary"}>
                      {partner.isActive ? "활성" : "비활성"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(partner)}
                      disabled={patchActiveMutation.isPending}
                      className="text-xs"
                    >
                      {partner.isActive ? "비활성화" : "활성화"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
