"use client";

import dynamic from "next/dynamic";

function CarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden" aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-56 w-[calc(50%-8px)] shrink-0 animate-pulse rounded-2xl bg-gray-100 sm:h-64 sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
        />
      ))}
    </div>
  );
}

const ProductCarousel = dynamic(() => import("./ProductCarousel"), {
  ssr: false,
  loading: () => <CarouselSkeleton />,
});

export default function ProductCarouselLazy() {
  return <ProductCarousel />;
}
