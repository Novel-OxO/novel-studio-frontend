import { useQuery } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart/api";

/**
 * React Query hook for fetching cart items
 *
 * @returns Query result with cart items, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: cartItems, isLoading, error } = useCartItems();
 * const totalPrice = cartItems?.reduce((sum, item) => sum + item.course.price, 0) || 0;
 * ```
 */
export const useCartItems = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => cartApi.getAll(),
  });
};
