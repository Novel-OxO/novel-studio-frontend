import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api/payments/api";
import type { VerifyPaymentRequest } from "@/lib/api/payments/types";

/**
 * React Query mutation hook for verifying payment
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const verifyPayment = useVerifyPayment();
 *
 * const handleVerify = (paymentId: string, orderId: string) => {
 *   verifyPayment.mutate(
 *     { paymentId, orderId },
 *     {
 *       onSuccess: (payment) => {
 *         console.log('Payment verified:', payment.id);
 *         router.push(`/orders/${orderId}/complete`);
 *       },
 *       onError: (error) => {
 *         console.error('Payment verification failed', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) => paymentsApi.verify(data),
    onSuccess: () => {
      // Invalidate cart queries to clear cart after payment
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
