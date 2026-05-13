"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, User, Menu, X, Shield, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@store/authStore";
import { useCartStore } from "@store/cartStore";
import { useWishlistStore } from "@store/wishlistStore";
import { CATEGORIES } from "@constants/index";
import { cn } from "@utils/cn";
import { Button } from "@components/ui/button";

export default function Gnb() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="메인 네비게이션">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-rose-600">GLOW</span>
          <span className="text-xl font-light text-gray-700">shop</span>
        </Link>

        {/* 데스크탑 메뉴 */}
        <div className="hidden items-center gap-6 md:flex">
          {/* 카테고리 드롭다운 */}
          <div className="relative">
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setCategoryOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={categoryOpen}
            >
              카테고리 <ChevronDown className="h-4 w-4" />
            </button>
            {categoryOpen && (
              <div className="absolute left-0 top-8 z-50 w-40 rounded-lg border bg-white p-1 shadow-lg">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={cat.value === "all" ? "/products" : `/products/category/${cat.value}`}
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => setCategoryOpen(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 우측 아이콘 메뉴 */}
        <div className="flex items-center gap-2">
          {/* 즐겨찾기 */}
          <Link href="/wishlist" aria-label="즐겨찾기" className="relative p-2 text-gray-600 hover:text-rose-600 transition-colors">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 장바구니 */}
          <Link href="/cart" aria-label="장바구니" className="relative p-2 text-gray-600 hover:text-rose-600 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 인증 영역 */}
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/mypage" aria-label="마이페이지" className="p-2 text-gray-600 hover:text-rose-600 transition-colors">
                <User className="h-5 w-5" />
              </Link>
              {user?.role === "ADMIN" && (
                <Link href="/admin" aria-label="어드민" className="p-2 text-gray-600 hover:text-rose-600 transition-colors">
                  <Shield className="h-5 w-5" />
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-rose-600">
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="hidden gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700" asChild>
                <Link href="/auth/signup">회원가입</Link>
              </Button>
            </div>
          )}

          {/* 모바일 햄버거 */}
          <button
            className="p-2 text-gray-600 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="메뉴 열기"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">카테고리</p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === "all" ? "/products" : `/products/category/${cat.value}`}
                className="text-sm text-gray-700 hover:text-rose-600"
                onClick={() => setMobileOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <hr className="my-2" />
            {isAuthenticated ? (
              <>
                <Link href="/mypage" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>마이페이지</Link>
                {user?.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>어드민</Link>
                )}
                <button onClick={handleLogout} className="text-left text-sm text-gray-700">로그아웃</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>로그인</Link>
                <Link href="/auth/signup" className="text-sm text-rose-600 font-medium" onClick={() => setMobileOpen(false)}>회원가입</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
