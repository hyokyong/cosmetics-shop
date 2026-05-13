// 가격 포맷 (12000 → 12,000원)
export const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR') + '원';
};

// 날짜 포맷 (2024-01-01T00:00:00 → 2024.01.01)
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
};

// 별점 배열 생성 (rating: 4 → [1,1,1,1,0])
export const getRatingArray = (rating: number): number[] => {
  return Array.from({ length: 5 }, (_, i) => (i < rating ? 1 : 0));
};
