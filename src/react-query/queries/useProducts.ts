import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getProducts, getProduct, getBrands, postProduct, putProduct, deleteProduct } from '@api/products';
import { Product, ProductListResponse, ProductCreateRequest, ApiError } from '@/types/index';
import { QUERY_KEYS } from '@constants/index';

// 상품 목록
export const useGetProducts = (
  params?: { page?: number; size?: number; category?: string; brandName?: string },
  options?: Partial<UseQueryOptions<ProductListResponse, AxiosError<ApiError>>>,
) => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => getProducts(params),
  });
};

// 브랜드 목록
export const useGetBrands = (
  options?: Partial<UseQueryOptions<string[], AxiosError<ApiError>>>,
) => {
  return useQuery({
    ...options,
    queryKey: ['brands'],
    queryFn: getBrands,
  });
};

// 상품 상세
export const useGetProduct = (
  id: number,
  options?: Partial<UseQueryOptions<Product, AxiosError<ApiError>>>,
) => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => getProduct(id),
    enabled: !!id && (options?.enabled ?? true),
  });
};

// 상품 등록
export const usePostProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductCreateRequest) => postProduct(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
  });
};

// 상품 수정
export const usePutProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<ProductCreateRequest> }) =>
      putProduct(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT, id] });
    },
  });
};

// 상품 삭제
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
  });
};
