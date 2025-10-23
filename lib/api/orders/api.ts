import { post, get, del } from "../common/client";
import type { PaginatedData } from "../common/types";
import type { GetOrdersParams, Order } from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  ORDERS: "/orders",
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Create an order from all items in the user's cart
 *
 * Requires authentication. Automatically creates order from all cart items.
 *
 * @returns Created order information
 *
 * @example
 * ```ts
 * const order = await createOrder();
 * console.log(order.totalAmount, order.orderItems);
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Cart is empty
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 */
const createOrder = async (): Promise<Order> => {
  return post<Order>(ENDPOINTS.ORDERS);
};

/**
 * Get list of user's orders with optional filters and pagination
 *
 * Requires authentication. Returns only the authenticated user's orders.
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of orders
 *
 * @example
 * ```ts
 * const { items, pagination } = await getOrders({
 *   page: 1,
 *   pageSize: 10,
 *   status: OrderStatus.COMPLETED
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 */
 const getOrders = async (
  params?: GetOrdersParams
): Promise<PaginatedData<Order>> => {
  return get<PaginatedData<Order>>(ENDPOINTS.ORDERS, { params });
};

/**
 * Get order by ID
 *
 * Requires authentication. User can only access their own orders.
 *
 * @param id - Order unique identifier
 * @returns Order details
 *
 * @example
 * ```ts
 * const order = await getOrderById('order_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Order belongs to another user
 * @throws {ApiErrorResponse} 404 Not Found - Order not found
 */
export const getOrderById = async (id: string): Promise<Order> => {
  return get<Order>(ENDPOINTS.ORDER_BY_ID(id));
};

/**
 * Cancel an order
 *
 * Requires authentication. Only pending orders can be cancelled.
 *
 * @param id - Order unique identifier
 *
 * @example
 * ```ts
 * await cancelOrder('order_id');
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Order status is not PENDING
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Order belongs to another user
 * @throws {ApiErrorResponse} 404 Not Found - Order not found
 */
export const cancelOrder = async (id: string): Promise<void> => {
  return del(ENDPOINTS.ORDER_BY_ID(id));
};

// ============================================
// Orders API Object (alternative usage pattern)
// ============================================

/**
 * Orders API client object
 *
 * Provides an alternative object-based API for order operations
 *
 * @example
 * ```ts
 * import { ordersApi } from '@/lib/api/orders/api';
 *
 * const order = await ordersApi.create();
 * const { items } = await ordersApi.list({ page: 1 });
 * const single = await ordersApi.getById('id');
 * await ordersApi.cancel('id');
 * ```
 */
export const ordersApi = {
  create: createOrder,
  list: getOrders,
  getById: getOrderById,
  cancel: cancelOrder,
} as const;

export default ordersApi;
