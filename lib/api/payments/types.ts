import type { PaymentStatus, ISODateString } from "../common/types";

// ============================================
// Request Types
// ============================================

export interface VerifyPaymentRequest {
  paymentId: string;
  orderId: string;
}
export interface PaymentWebhookRequest {
  paymentId: string;
  status: PaymentStatus;
  transactionId?: string;
}

// ============================================
// Response Types
// ============================================

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
