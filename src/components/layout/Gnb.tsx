"use client";

import { useCallback, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { ShoppingCart, Heart, User, Menu, X, Shield, ChevronDown } from "lucide-react";
import { useAuthStore } from "@store/authStore";
import { useCartStore } from "@store/cartStore";
import { useWishlistStore } from "@store/wishlistStore";
import { CATEGORY_VALUES } from "@constants/index";
import { Button } from "@components/ui/button";
import LanguageSwitcher from "@components/layout/LanguageSwitcher";

export default function Gnb() {
  const t = useTranslations("gnb");
  const tCat = useTranslations("categories");
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalCount());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const categoryHref = useCallback(
    (value: string) => (value === "all" ? "/products" : `/products/category/${value}`),
    []
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav
        className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8"
        aria-label={t("mainNav")}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-primary-600">GLOW</span>
          <span className="text-xl font-light text-gray-700">shop</span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 md:flex">
          <div className="relative">
            <button
              type="button"
              className="flex max-w-full items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
              onClick={() => setCategoryOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={categoryOpen}
            >
              <span className="truncate">{t("category")}</span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </button>
            {categoryOpen && (
              <div className="absolute start-0 top-full z-50 mt-2 min-w-[10rem] max-w-xs rounded-lg border bg-white p-1 shadow-lg">
                {CATEGORY_VALUES.map((value) => (
                  <Link
                    key={value}
                    href={categoryHref(value)}
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    onClick={() => setCategoryOpen(false)}
                  >
                    {tCat(value)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <LanguageSwitcher />

          <Link
            href="/wishlist"
            aria-label={t("wishlist")}
            className="relative shrink-0 p-2 text-gray-600 transition-colors hover:text-primary-600"
          >
            <Heart className="h-5 w-5" />
            {mounted && wishlistCount > 0 && (
              <span className="absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={t("cart")}
            className="relative shrink-0 p-2 text-gray-600 transition-colors hover:text-primary-600"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {mounted && isAuthenticated ? (
            <div className="hidden min-w-0 flex-wrap items-center gap-1 md:flex">
              <Link
                href="/mypage"
                aria-label={t("mypage")}
                className="shrink-0 p-2 text-gray-600 transition-colors hover:text-primary-600"
              >
                <User className="h-5 w-5" />
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  aria-label={t("admin")}
                  className="shrink-0 p-2 text-gray-600 transition-colors hover:text-primary-600"
                >
                  <Shield className="h-5 w-5" />
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="max-w-[8rem] truncate text-gray-600 hover:text-primary-600 sm:max-w-none"
              >
                {t("logout")}
              </Button>
            </div>
          ) : (
            <div className="hidden min-w-0 flex-wrap items-center gap-1 md:flex">
              <Button variant="ghost" size="sm" className="whitespace-nowrap" asChild>
                <Link href="/auth/login">{t("login")}</Link>
              </Button>
              <Button size="sm" className="whitespace-nowrap bg-primary-600 hover:bg-primary-700" asChild>
                <Link href="/auth/signup">{t("signup")}</Link>
              </Button>
            </div>
          )}

          <button
            type="button"
            className="shrink-0 p-2 text-gray-600 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("openMenu")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("categorySection")}
            </p>
            {CATEGORY_VALUES.map((value) => (
              <Link
                key={value}
                href={categoryHref(value)}
                className="text-sm text-gray-700 hover:text-primary-600"
                onClick={() => setMobileOpen(false)}
              >
                {tCat(value)}
              </Link>
            ))}
            <hr className="my-2" />
            {mounted && isAuthenticated ? (
              <>
                <Link href="/mypage" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                  {t("mypage")}
                </Link>
                {user?.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                    {t("admin")}
                  </Link>
                )}
                <button type="button" onClick={handleLogout} className="text-start text-sm text-gray-700">
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                  {t("login")}
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium text-primary-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("signup")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
