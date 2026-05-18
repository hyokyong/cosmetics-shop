import type { Order, Partner, Product, ShippingAddress } from "@/types/index";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "촉촉 수분크림 50ml",
    basePrice: 28000,
    imageUrl: "https://picsum.photos/seed/cosmetic1/100/100",
    category: "skincare",
    brandName: "이니스프리",
    isVisible: true,
    options: [],
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
  },
  {
    id: 2,
    name: "비타민C 세럼",
    basePrice: 45000,
    imageUrl: "https://picsum.photos/seed/cosmetic2/100/100",
    category: "skincare",
    brandName: "라로슈포제",
    isVisible: true,
    options: [],
    createdAt: new Date("2024-02-01T00:00:00Z").toISOString(),
  },
  {
    id: 3,
    name: "선크림 SPF50+",
    basePrice: 22000,
    imageUrl: "https://picsum.photos/seed/cosmetic3/100/100",
    category: "suncare",
    brandName: "아넥스",
    isVisible: false,
    options: [],
    createdAt: new Date("2024-03-01T00:00:00Z").toISOString(),
  },
];

export const MOCK_PARTNERS: Partner[] = [
  {
    id: 1,
    email: "innisfree@partner.com",
    brandName: "이니스프리",
    businessNumber: "123-45-67890",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    email: "lrp@partner.com",
    brandName: "라로슈포제",
    businessNumber: "234-56-78901",
    isActive: true,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: 3,
    email: "cosrx@partner.com",
    brandName: "코스알엑스",
    businessNumber: "345-67-89012",
    isActive: false,
    createdAt: "2024-03-01T00:00:00Z",
  },
];

export const MOCK_SHIPPING_ADDRESSES: ShippingAddress[] = [
  {
    id: 1,
    userId: 1,
    address: "서울 강남구 테헤란로 1",
    detailAddress: "101호",
    zipCode: "06134",
  },
  {
    id: 2,
    userId: 1,
    address: "서울 서초구 반포대로 12",
    detailAddress: "202호",
    zipCode: "06500",
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    userId: 1,
    status: "주문완료",
    totalPrice: 58000,
    items: [
      {
        id: 1,
        productId: 1,
        productName: "촉촉 수분크림 50ml",
        imageUrl: "https://picsum.photos/seed/cosmetic1/100/100",
        optionId: 1,
        color: "핑크",
        size: "M",
        price: 28000,
        quantity: 1,
      },
      {
        id: 2,
        productId: 2,
        productName: "비타민C 세럼",
        imageUrl: "https://picsum.photos/seed/cosmetic2/100/100",
        optionId: 2,
        color: "화이트",
        size: "L",
        price: 30000,
        quantity: 1,
      },
    ],
    shippingAddressId: 1,
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-05-01T10:00:00Z",
  },
  {
    id: 2,
    userId: 1,
    status: "배송준비중",
    totalPrice: 22000,
    items: [
      {
        id: 3,
        productId: 3,
        productName: "선크림 SPF50+",
        imageUrl: "https://picsum.photos/seed/cosmetic3/100/100",
        optionId: 3,
        color: "베이지",
        size: "S",
        price: 22000,
        quantity: 1,
      },
    ],
    shippingAddressId: 2,
    createdAt: "2024-05-10T14:30:00Z",
    updatedAt: "2024-05-10T14:30:00Z",
  },
];
