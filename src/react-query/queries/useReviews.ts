import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getReviews, postReview } from '@api/reviews';
import { Review, ReviewCreateRequest, ApiError } from '@/types/index';
import { QUERY_KEYS } from '@constants/index';

export const useGetReviews = (
  productId: number,
  options?: Partial<UseQueryOptions<Review[], AxiosError<ApiError>>>,
) => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEYS.REVIEWS, productId],
    queryFn: () => getReviews(productId),
    enabled: !!productId && (options?.enabled ?? true),
  });
};

export const usePostReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ReviewCreateRequest) => postReview(body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS, variables.productId] });
    },
  });
};
