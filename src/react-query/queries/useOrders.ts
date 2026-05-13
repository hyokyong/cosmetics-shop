import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getOrders, getOrder, postOrder, deleteOrder } from '@api/orders';
import { Order, OrderCreateRequest, ApiError } from '@/types/index';
import { QUERY_KEYS } from '@constants/index';

export const useGetOrders = (
  options?: Partial<UseQueryOptions<Order[], AxiosError<ApiError>>>,
) => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: getOrders,
  });
};

export const useGetOrder = (
  id: number,
  options?: Partial<UseQueryOptions<Order, AxiosError<ApiError>>>,
) => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEYS.ORDER, id],
    queryFn: () => getOrder(id),
    enabled: !!id && (options?.enabled ?? true),
  });
};

export const usePostOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: OrderCreateRequest) => postOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
  });
};
