/**
 * Format price to Korean currency format
 *
 * @param price - Price in won
 * @returns Formatted price string (e.g., "49,000원")
 *
 * @example
 * ```ts
 * formatPrice(49000); // "49,000원"
 * formatPrice(0); // "무료"
 * ```
 */
export const formatPrice = (price: number): string => {
  if (price === 0) {
    return "무료";
  }

  return `${price.toLocaleString("ko-KR")}원`;
};
