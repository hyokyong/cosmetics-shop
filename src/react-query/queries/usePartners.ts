import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getPartners, postPartner, patchPartnerActive } from '@api/partners';
import { Partner, PartnerCreateRequest, ApiError } from '@/types/index';
import { QUERY_KEYS } from '@constants/index';

export const useGetPartners = (
  options?: Partial<UseQueryOptions<Partner[], AxiosError<ApiError>>>,
) => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEYS.PARTNERS],
    queryFn: getPartners,
  });
};

export const usePostPartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PartnerCreateRequest) => postPartner(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PARTNERS] });
    },
  });
};

export const usePatchPartnerActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      patchPartnerActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PARTNERS] });
    },
  });
};
