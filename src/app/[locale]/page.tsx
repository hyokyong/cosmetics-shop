import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ProductCarouselLazy from "@components/product/ProductCarouselLazy";
import { CATEGORY_VALUES } from "@constants/index";
import { Button } from "@components/ui/button";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";

const CATEGORY_EMOJI: Record<string, string> = {
  skincare: "🧴",
  makeup: "💄",
  cleansing: "🫧",
  suncare: "☀️",
  mask: "🎭",
  bodycare: "🛁",
};

export default async function HomePage() {
  const t = await getTranslations("home");
  const tCat = await getTranslations("categories");

  const benefits = [
    { icon: Truck, titleKey: "benefitShippingTitle" as const, descKey: "benefitShippingDesc" as const },
    { icon: Shield, titleKey: "benefitAuthenticTitle" as const, descKey: "benefitAuthenticDesc" as const },
    { icon: Sparkles, titleKey: "benefitPointsTitle" as const, descKey: "benefitPointsDesc" as const },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="py-16 text-center sm:py-24" aria-label={t("heroBadge")}>
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-500">
            {t("heroBadge")}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {t("heroTitle")} <br />
            <span className="text-primary-600">{t("heroTitleHighlight")}</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">{t("heroDesc")}</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="w-full bg-primary-600 hover:bg-primary-700 sm:w-auto" asChild>
              <Link href="/products" className="inline-flex items-center justify-center gap-2">
                {t("viewAllProducts")}
                <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/products/category/skincare">{t("viewSkincare")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8" aria-label={t("categoriesTitle")}>
        <h2 className="mb-6 text-xl font-bold text-gray-900">{t("categoriesTitle")}</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {CATEGORY_VALUES.filter((v) => v !== "all").map((value) => (
            <Link
              key={value}
              href={`/products/category/${value}`}
              className="flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-2xl border bg-white p-3 text-center text-sm font-medium leading-snug text-gray-700 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
            >
              <span className="text-2xl">{CATEGORY_EMOJI[value]}</span>
              <span className="line-clamp-2 break-words">{tCat(value)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12" aria-label={t("popularTitle")}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            <Sparkles className="me-2 inline-block h-5 w-5 text-primary-500" />
            {t("popularTitle")}
          </h2>
          <Link
            href="/products"
            className="flex shrink-0 items-center gap-1 text-sm text-primary-600 hover:underline"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
        <ProductCarouselLazy />
      </section>

      <section className="py-12" aria-label={t("benefitsTitle")}>
        <div className="grid grid-cols-1 gap-6 rounded-3xl bg-primary-50 p-8 sm:grid-cols-3">
          {benefits.map(({ icon: Icon, titleKey, descKey }) => (
            <div key={titleKey} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">{t(titleKey)}</h3>
                <p className="text-sm text-gray-600">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
