import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart/api";

/**
 * React Query mutation hook for removing a course from cart
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const removeFromCart = useRemoveFromCart();
 *
 * const handleRemove = (courseId: string) => {
 *   removeFromCart.mutate(courseId, {
 *     onSuccess: () => {
 *       console.log('Removed from cart');
 *     },
 *     onError: (error) => {
 *       console.error('Failed to remove from cart', error);
 *     }
 *   });
 * };
 * ```
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => cartApi.remove(courseId),
    onSuccess: () => {
      // Invalidate cart queries to refetch cart items
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
