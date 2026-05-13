"use client";

import Link from "next/link";
import { useAuthStore } from "@store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, Users, BarChart3, Shield } from "lucide-react";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const menus = [
    { href: "/admin/partners", icon: Users, label: "파트너 관리", desc: "파트너 등록/조회/활성화 관리" },
    { href: "/admin/products", icon: Package, label: "상품 관리", desc: "상품 등록/수정/삭제 관리" },
    { href: "#", icon: BarChart3, label: "판매 수익 조회", desc: "파트너별 판매 수익 현황" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-7 w-7 text-rose-500" />
        <h1 className="text-2xl font-bold text-gray-900">어드민 페이지</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {menus.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-3 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
              <Icon className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{label}</p>
              <p className="mt-1 text-sm text-gray-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
