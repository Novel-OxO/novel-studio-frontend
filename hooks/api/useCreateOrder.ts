import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders/api";

/**
 * React Query mutation hook for creating an order from cart items
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const createOrder = useCreateOrder();
 *
 * const handleCheckout = () => {
 *   createOrder.mutate(undefined, {
 *     onSuccess: (order) => {
 *       console.log('Order created:', order.id);
 *       // Proceed to payment
 *     },
 *     onError: (error) => {
 *       console.error('Failed to create order', error);
 *     }
 *   });
 * };
 * ```
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: () => ordersApi.create(),
  });
};
