import { CATEGORY_VALUES } from "@constants/index";
import { API_QUERY_ENABLED } from "@constants/index";
import type { Product } from "@/types/index";

/** sitemap에 포함할 공개 정적 경로 (locale prefix 제외) */
export function getPublicStaticPaths(): string[] {
  const categoryPaths = CATEGORY_VALUES.filter((c) => c !== "all").map(
    (c) => `/products/category/${c}`,
  );

  return [
    "",
    "/products",
    ...categoryPaths,
    "/auth/login",
    "/auth/signup",
  ];
}

/** 빌드/요청 시 상품 ID 목록 (API 미연동 시 빈 배열) */
export async function fetchProductIdsForSitemap(): Promise<number[]> {
  if (!API_QUERY_ENABLED.PRODUCTS) return [];

  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base) return [];

  try {
    const res = await fetch(`${base}/products?page=0&size=500`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { content?: Product[] };
    return (data.content ?? [])
      .filter((p) => p.isVisible !== false)
      .map((p) => p.id);
  } catch {
    return [];
  }
}

/** 상품 상세 SEO용 (서버) */
export async function fetchProductForSeo(
  id: number,
): Promise<Product | null> {
  if (!API_QUERY_ENABLED.PRODUCT_DETAIL) return null;

  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!base || !Number.isFinite(id) || id <= 0) return null;

  try {
    const res = await fetch(`${base}/products/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch {
    return null;
  }
}
