export const CATEGORIES = [
  { label: '전체', value: 'all' },
  { label: '스킨케어', value: 'skincare' },
  { label: '메이크업', value: 'makeup' },
  { label: '클렌징', value: 'cleansing' },
  { label: '선케어', value: 'suncare' },
  { label: '마스크', value: 'mask' },
  { label: '바디케어', value: 'bodycare' },
];

export const ORDER_STATUS_MAP: Record<string, string> = {
  '주문완료': '주문완료',
  '배송준비중': '배송준비중',
  '배송중': '배송중',
  '배송완료': '배송완료',
  '취소': '취소',
};

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CART: 'cart',
  ORDERS: 'orders',
  ORDER: 'order',
  WISHLIST: 'wishlist',
  REVIEWS: 'reviews',
  SHIPPING_ADDRESSES: 'shippingAddresses',
  PARTNERS: 'partners',
  USER: 'user',
} as const;

/** 백엔드·인증 준비 후 `true`로 바꿔 실제 API 요청을 보냅니다. */
export const API_QUERY_ENABLED = {
  PRODUCTS: false,
  PRODUCT_DETAIL: false,
  ORDERS: false,
  SHIPPING_ADDRESSES: false,
  ADMIN_PARTNERS: false,
  ADMIN_PRODUCTS: false,
} as const;
