import { authApi } from "./auth/api";
import { usersApi } from "./users/api";
import { coursesApi } from "./courses/api";
import { sectionsApi } from "./sections/api";
import { lecturesApi } from "./lectures/api";
import { cartApi } from "./cart/api";
import { ordersApi } from "./orders/api";
import { paymentsApi } from "./payments/api";
import { questionsApi } from "./questions/api";
import { reviewsApi } from "./reviews/api";
import { mediaApi } from "./media/api";

/**
 * Centralized API client
 *
 * Provides a single object to access all API endpoints across all domains.
 *
 * @example
 * ```ts
 * import api from '@/lib/api/api-client';
 *
 * // All API operations are accessible through this object
 * const user = await api.auth.getCurrentUser();
 * const courses = await api.courses.list();
 * await api.cart.add({ courseId: 'id' });
 * ```
 */
const api = {
  auth: authApi,
  users: usersApi,
  courses: coursesApi,
  sections: sectionsApi,
  lectures: lecturesApi,
  cart: cartApi,
  orders: ordersApi,
  payments: paymentsApi,
  questions: questionsApi,
  reviews: reviewsApi,
  media: mediaApi,
} as const;

export default api;
