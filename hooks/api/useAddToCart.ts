import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart/api";
import type { AddToCartRequest } from "@/lib/api/cart/types";

/**
 * React Query mutation hook for adding a course to cart
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const addToCart = useAddToCart();
 *
 * const handleAddToCart = () => {
 *   addToCart.mutate(
 *     { courseId: 'course_id' },
 *     {
 *       onSuccess: () => {
 *         console.log('Added to cart');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to add to cart', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.add(data),
    onSuccess: () => {
      // Invalidate cart queries to refetch cart items
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
