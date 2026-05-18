"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuthStore } from "@store/authStore";
import { useGetReviews, usePostReview } from "@/react-query/queries/useReviews";
import { Button } from "@components/ui/button";
import { cn } from "@utils/cn";
import { formatDate } from "@utils/format";
import { Link } from "@/i18n/navigation";

interface Props {
  productId: number;
}

export default function ReviewSection({ productId }: Props) {
  const { isAuthenticated } = useAuthStore();
  const { data: reviews = [], isLoading } = useGetReviews(productId);
  const { mutate: submitReview, isPending } = usePostReview();

  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    submitReview(
      { productId, content: content.trim(), rating },
      {
        onSuccess: () => {
          setContent("");
          setRating(5);
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        },
      }
    );
  };

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        리뷰 {reviews.length > 0 && <span className="text-primary-600">({reviews.length})</span>}
      </h2>

      {/* 별점 요약 */}
      {reviews.length > 0 && (
        <div className="mb-8 flex items-center gap-4 rounded-2xl bg-gray-50 px-6 py-5">
          <span className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
          <div>
            <StarRow rating={averageRating} size="lg" />
            <p className="mt-1 text-sm text-gray-500">총 {reviews.length}개 리뷰</p>
          </div>
        </div>
      )}

      {/* 리뷰 목록 */}
      {isLoading ? (
        <p className="py-8 text-center text-sm text-gray-400">불러오는 중…</p>
      ) : reviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <li key={review.id} className="py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                    {review.userName?.[0] ?? "?"}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{review.userName ?? "익명"}</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
              </div>
              <div className="mt-2">
                <StarRow rating={review.rating} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{review.content}</p>
            </li>
          ))}
        </ul>
      )}

      {/* 리뷰 작성 폼 */}
      <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-6">
        {isAuthenticated ? (
          <>
            <h3 className="mb-4 text-base font-semibold text-gray-900">리뷰 작성</h3>
            {submitted && (
              <p className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
                리뷰가 등록됐습니다. 감사합니다!
              </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* 별점 선택 */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">별점</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          star <= (hovered || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* 내용 */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">내용</p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="상품에 대한 솔직한 리뷰를 남겨주세요."
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <p className="mt-1 text-right text-xs text-gray-400">{content.length} / 500</p>
              </div>

              <Button
                type="submit"
                disabled={!content.trim() || isPending}
                className="self-end bg-primary-600 hover:bg-primary-700 disabled:opacity-40"
              >
                {isPending ? "등록 중…" : "리뷰 등록"}
              </Button>
            </form>
          </>
        ) : (
          <p className="text-center text-sm text-gray-500">
            리뷰를 작성하려면{" "}
            <Link href="/auth/login" className="font-medium text-primary-600 underline-offset-2 hover:underline">
              로그인
            </Link>
            이 필요합니다.
          </p>
        )}
      </div>
    </section>
  );
}

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            cls,
            star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"
          )}
        />
      ))}
    </div>
  );
}
