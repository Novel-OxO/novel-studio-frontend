import { post, get, del } from "../common/client";
import type { AddToCartRequest, CartItem } from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  CART: "/cart",
  CART_ITEM: (courseId: string) => `/cart/${courseId}`,
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Add a course to the shopping cart
 *
 * Requires authentication
 *
 * @param data - Course to add
 * @returns Created cart item
 *
 * @example
 * ```ts
 * const cartItem = await addToCart({ courseId: 'course_id' });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 404 Not Found - Course not found
 * @throws {ApiErrorResponse} 409 Conflict - Course already in cart
 */
const addToCart = async (data: AddToCartRequest): Promise<CartItem> => {
  return post<CartItem, AddToCartRequest>(ENDPOINTS.CART, data);
};

/**
 * Get all items in the user's cart
 *
 * Requires authentication
 *
 * @returns Array of cart items
 *
 * @example
 * ```ts
 * const items = await getCartItems();
 * const totalPrice = items.reduce((sum, item) => sum + item.course.price, 0);
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 */
const getCartItems = async (): Promise<CartItem[]> => {
  return get<CartItem[]>(ENDPOINTS.CART);
};

/**
 * Remove a course from the cart
 *
 * Requires authentication
 *
 * @param courseId - Course ID to remove
 *
 * @example
 * ```ts
 * await removeFromCart('course_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 404 Not Found - Course not in cart
 */
const removeFromCart = async (courseId: string): Promise<void> => {
  return del(ENDPOINTS.CART_ITEM(courseId));
};

// ============================================
// Cart API Object
// ============================================

/**
 * Cart API client object
 *
 * Provides an alternative object-based API for cart operations
 *
 * @example
 * ```ts
 * import { cartApi } from '@/lib/api/cart/api';
 *
 * await cartApi.add({ courseId: 'id' });
 * const items = await cartApi.getAll();
 * await cartApi.remove('course_id');
 * ```
 */
export const cartApi = {
  add: addToCart,
  getAll: getCartItems,
  remove: removeFromCart,
} as const;

export default cartApi;
