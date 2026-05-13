import { axiosWithAuth } from "@/api/axiosInstance";
import { Review, ReviewCreateRequest } from "@/types/index";

export const getReviews = async (productId: number): Promise<Review[]> => {
  const { data } = await axiosWithAuth.get(`/reviews?productId=${productId}`);
  return data;
};

export const postReview = async (
  body: ReviewCreateRequest,
): Promise<Review> => {
  const { data } = await axiosWithAuth.post("/reviews", body);
  return data;
};
