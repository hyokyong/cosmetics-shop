import { axiosWithAuth } from "@/api/axiosInstance";
import {
  Product,
  ProductListResponse,
  ProductCreateRequest,
} from "@/types/index";

// 상품 목록 조회 (페이징)
export const getProducts = async (params?: {
  page?: number;
  size?: number;
  category?: string;
  brandName?: string;
}): Promise<ProductListResponse> => {
  const { data } = await axiosWithAuth.get("/products", { params });
  return data;
};

// 브랜드 목록 조회
export const getBrands = async (): Promise<string[]> => {
  const { data } = await axiosWithAuth.get("/products/brands");
  return data;
};

// 상품 상세 조회
export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await axiosWithAuth.get(`/products/${id}`);
  return data;
};

// 상품 등록 (어드민/파트너)
export const postProduct = async (
  body: ProductCreateRequest,
): Promise<Product> => {
  const { data } = await axiosWithAuth.post("/products", body);
  return data;
};

// 상품 수정
export const putProduct = async (
  id: number,
  body: Partial<ProductCreateRequest>,
): Promise<Product> => {
  const { data } = await axiosWithAuth.put(`/products/${id}`, body);
  return data;
};

// 상품 삭제 (소프트)
export const deleteProduct = async (id: number): Promise<void> => {
  const { data } = await axiosWithAuth.delete(`/products/${id}`);
  return data;
};
