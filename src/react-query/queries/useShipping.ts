import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getShippingAddresses, postShippingAddress, deleteShippingAddress } from '@api/shipping';
import { ShippingAddress, ShippingAddressCreateRequest, ApiError } from '@/types/index';
import { QUERY_KEYS } from '@constants/index';

export const useGetShippingAddresses = (
  options?: Partial<UseQueryOptions<ShippingAddress[], AxiosError<ApiError>>>,
) => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEYS.SHIPPING_ADDRESSES],
    queryFn: getShippingAddresses,
  });
};

export const usePostShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ShippingAddressCreateRequest) => postShippingAddress(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHIPPING_ADDRESSES] });
    },
  });
};

export const useDeleteShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteShippingAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHIPPING_ADDRESSES] });
    },
  });
};
