import Link from "next/link";
import ProductCarousel from "@components/product/ProductCarousel";
import { CATEGORIES } from "@constants/index";
import { Button } from "@components/ui/button";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 히어로 섹션 */}
      <section className="py-16 text-center sm:py-24" aria-label="히어로">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-rose-500">
            New Collection 2024
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            당신의 피부에 <br />
            <span className="text-rose-600">빛을 더하다</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            엄선된 국내외 브랜드의 화장품을 한 곳에서. 피부 타입에 맞는 제품을
            찾아보세요.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto"
              asChild
            >
              <Link href="/products">
                전체 상품 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/products/category/skincare">스킨케어 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 카테고리 빠른 이동 */}
      <section className="py-8" aria-label="카테고리">
        <h2 className="mb-6 text-xl font-bold text-gray-900">카테고리</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
            <Link
              key={cat.value}
              href={`/products/category/${cat.value}`}
              className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
            >
              <span className="text-2xl">
                {
                  {
                    skincare: "🧴",
                    makeup: "💄",
                    cleansing: "🫧",
                    suncare: "☀️",
                    mask: "🎭",
                    bodycare: "🛁",
                  }[cat.value]
                }
              </span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 추천 상품 캐러셀 */}
      <section className="py-12" aria-label="추천 상품">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            <Sparkles className="mr-2 inline-block h-5 w-5 text-rose-500" />
            이번 주 인기 상품
          </h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm text-rose-600 hover:underline"
          >
            전체보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductCarousel />
      </section>

      {/* 혜택 섹션 */}
      <section className="py-12" aria-label="혜택">
        <div className="grid grid-cols-1 gap-6 rounded-3xl bg-rose-50 p-8 sm:grid-cols-3">
          {[
            {
              icon: Truck,
              title: "무료 배송",
              desc: "3만원 이상 구매 시 무료 배송",
            },
            {
              icon: Shield,
              title: "정품 보장",
              desc: "모든 상품 100% 정품 보장",
            },
            {
              icon: Sparkles,
              title: "적립 혜택",
              desc: "구매 금액의 1% 포인트 적립",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100">
                <Icon className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
