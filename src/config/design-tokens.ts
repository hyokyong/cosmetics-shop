/**
 * 디자인 토큰 참조
 *
 * 색상 값: src/app/globals.css (:root)
 * Tailwind:  tailwind.config.ts → theme.extend.colors
 *
 * @example
 * className="bg-primary-500 text-primary-foreground"
 * className="text-gray-500"
 * className="text-error"
 */

export const orderStatusClass: Record<string, string> = {
  주문완료: "bg-blue-100 text-blue-700",
  배송준비중: "bg-yellow-100 text-yellow-700",
  배송중: "bg-orange-100 text-orange-700",
  배송완료: "bg-green-100 text-green-700",
  취소: "bg-gray-100 text-gray-500",
};
