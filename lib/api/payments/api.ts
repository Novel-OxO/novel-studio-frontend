import { post } from "../common/client";
import type {
  VerifyPaymentRequest,
  PaymentWebhookRequest,
  Payment,
} from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  VERIFY: "/payments/verify",
  WEBHOOK: "/payments/webhook",
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Verify payment for an order
 *
 * Public endpoint - no authentication required.
 * Mock implementation that always succeeds in development.
 *
 * @param data - Payment verification data
 * @returns Payment information
 *
 * @example
 * ```ts
 * const payment = await verifyPayment({
 *   paymentId: 'payment_mock_1234567890',
 *   orderId: 'order_id'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request (already paid, not PENDING, etc.)
 * @throws {ApiErrorResponse} 404 Not Found - Order not found
 */
const verifyPayment = async (
  data: VerifyPaymentRequest
): Promise<Payment> => {
  return post<Payment, VerifyPaymentRequest>(ENDPOINTS.VERIFY, data);
};

/**
 * Handle payment webhook callback
 *
 * Public endpoint - webhook signature verification in production.
 * Mock implementation for development.
 *
 * @param data - Webhook payload
 * @returns Updated payment information
 *
 * @example
 * ```ts
 * const payment = await handlePaymentWebhook({
 *   paymentId: 'payment_mock_1234567890',
 *   status: PaymentStatus.PAID,
 *   transactionId: 'tx_mock_1234567890'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Unsupported payment status
 * @throws {ApiErrorResponse} 404 Not Found - Payment not found
 */
const handlePaymentWebhook = async (
  data: PaymentWebhookRequest
): Promise<Payment> => {
  return post<Payment, PaymentWebhookRequest>(ENDPOINTS.WEBHOOK, data);
};

// ============================================
// Payments API Object
// ============================================

/**
 * Payments API client object
 *
 * Provides an alternative object-based API for payment operations
 *
 * @example
 * ```ts
 * import { paymentsApi } from '@/lib/api/payments/api';
 *
 * const payment = await paymentsApi.verify({ paymentId, orderId });
 * const updated = await paymentsApi.webhook({ paymentId, status });
 * ```
 */
export const paymentsApi = {
  verify: verifyPayment,
  webhook: handlePaymentWebhook,
} as const;

export default paymentsApi;
