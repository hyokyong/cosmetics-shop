"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useTranslations } from "next-intl";
import { useGetProducts } from "@/react-query/queries/useProducts";
import ProductCard from "./ProductCard";

export default function ProductCarousel() {
  const t = useTranslations("carousel");
  const tCommon = useTranslations("common");
  const { data, isFetching } = useGetProducts({ page: 0, size: 8 });

  const products = data?.content ?? [];

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })],
  );

  if (isFetching) {
    return (
      <section aria-label={t("label")}>
        <div className="py-8 text-center text-sm text-gray-500">{tCommon("loading")}</div>
      </section>
    );
  }

if (products.length === 0) {
    return (
      <section aria-label={t("label")}>
        <div className="py-8 text-center text-sm text-gray-400">{tCommon("empty")}</div>
      </section>
    );
  }

  return (
    <section aria-label={t("label")}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 touch-pan-y">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
