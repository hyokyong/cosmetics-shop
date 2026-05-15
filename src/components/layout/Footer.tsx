"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tGnb = useTranslations("gnb");
  const tCat = useTranslations("categories");
  const tCommon = useTranslations("common");

  return (
    <footer className="mt-20 border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-primary-600">GLOW</span>
            <span className="text-xl font-light text-gray-700">shop</span>
            <p className="mt-3 text-sm text-gray-500">{t("tagline")}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t("shopping")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-gray-500 hover:text-primary-600">
                  {t("allProducts")}
                </Link>
              </li>
              <li>
                <Link href="/products/category/skincare" className="text-sm text-gray-500 hover:text-primary-600">
                  {tCat("skincare")}
                </Link>
              </li>
              <li>
                <Link href="/products/category/makeup" className="text-sm text-gray-500 hover:text-primary-600">
                  {tCat("makeup")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t("customer")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/mypage" className="text-sm text-gray-500 hover:text-primary-600">
                  {tGnb("mypage")}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-gray-500 hover:text-primary-600">
                  {tGnb("cart")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t("account")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/auth/login" className="text-sm text-gray-500 hover:text-primary-600">
                  {tGnb("login")}
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-sm text-gray-500 hover:text-primary-600">
                  {tGnb("signup")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-gray-400">{tCommon("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
