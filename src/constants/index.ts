/** 카테고리 slug — 라벨은 `categories.{value}` 번역 키 사용 */
export const CATEGORY_VALUES = [
  "all",
  "skincare",
  "makeup",
  "cleansing",
  "suncare",
  "mask",
  "bodycare",
] as const;

export type CategoryValue = (typeof CATEGORY_VALUES)[number];

/** @deprecated 라벨은 useTranslations('categories') 사용 */
export const CATEGORIES = CATEGORY_VALUES.map((value) => ({
  label: value,
  value,
}));

export const ORDER_STATUS_MAP: Record<string, string> = {
  주문완료: "주문완료",
  배송준비중: "배송준비중",
  배송중: "배송중",
  배송완료: "배송완료",
  취소: "취소",
};

export const QUERY_KEYS = {
  PRODUCTS: "products",
  PRODUCT: "product",
  CART: "cart",
  ORDERS: "orders",
  ORDER: "order",
  WISHLIST: "wishlist",
  REVIEWS: "reviews",
  SHIPPING_ADDRESSES: "shippingAddresses",
  PARTNERS: "partners",
  USER: "user",
} as const;

/** 백엔드·인증 준비 후 `true`로 바꿔 실제 API 요청을 보냅니다. */
export const API_QUERY_ENABLED = {
  PRODUCTS: true,
  PRODUCT_DETAIL: true,
  ORDERS: true,
  SHIPPING_ADDRESSES: true,
  ADMIN_PARTNERS: true,
  ADMIN_PRODUCTS: true,
} as const;
