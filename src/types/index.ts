// ==================== AUTH ====================
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'PARTNER';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ==================== PARTNER ====================
export interface Partner {
  id: number;
  email: string;
  brandName: string;
  businessNumber: string;
  isActive: boolean;
  createdAt: string;
}

export interface PartnerCreateRequest {
  email: string;
  password: string;
  brandName: string;
  businessNumber: string;
}

// ==================== PRODUCT ====================
export interface ProductOption {
  id: number;
  color: string;
  size: string;
  additionalPrice: number;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  basePrice: number;
  imageUrl: string;
  category: string;
  brandName: string;
  isVisible: boolean;
  options: ProductOption[];
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface ProductListResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ProductCreateRequest {
  name: string;
  basePrice: number;
  isVisible: boolean;
  category: string;
  options: Omit<ProductOption, 'id'>[];
}

// ==================== CART ====================
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  optionId: number;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

// ==================== ORDER ====================
export type OrderStatus = '주문완료' | '배송준비중' | '배송중' | '배송완료' | '취소';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  optionId: number;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  shippingAddressId: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateRequest {
  items: { productId: number; optionId: number; quantity: number }[];
  shippingAddressId: number;
}

// ==================== SHIPPING ====================
export interface ShippingAddress {
  id: number;
  userId: number;
  address: string;
  detailAddress: string;
  zipCode: string;
}

export interface ShippingAddressCreateRequest {
  address: string;
  detailAddress: string;
  zipCode: string;
}

// ==================== REVIEW ====================
export interface Review {
  id: number;
  userId: number;
  productId: number;
  orderId: number;
  content: string;
  rating: number;
  createdAt: string;
}

export interface ReviewCreateRequest {
  orderId: number;
  productId: number;
  content: string;
  rating: number;
}

// ==================== COMMON ====================
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ApiError {
  message: string;
  status: number;
}
