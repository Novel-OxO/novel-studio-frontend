import type {
  OrderStatus,
  ISODateString,
  PaginationParams,
} from "../common/types";

// ============================================
// Request Types
// ============================================

export interface GetOrdersParams extends PaginationParams {
  status?: OrderStatus;
}

// ============================================
// Response Types
// ============================================

export interface OrderItem {
  courseId: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  orderItems: OrderItem[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
