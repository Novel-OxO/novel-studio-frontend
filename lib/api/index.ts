// ============================================
// Common Types and Utilities
// ============================================

export * from "./common/types";
export * from "./common/client";

// ============================================
// Authentication
// ============================================

export * from "./auth/types";
export * from "./auth/api";

// ============================================
// Users
// ============================================

export * from "./users/types";
export * from "./users/api";

// ============================================
// Courses
// ============================================

export * from "./courses/types";
export * from "./courses/api";

// ============================================
// Sections
// ============================================

export * from "./sections/types";
export * from "./sections/api";

// ============================================
// Lectures
// ============================================

export * from "./lectures/types";
export * from "./lectures/api";

// ============================================
// Cart
// ============================================

export * from "./cart/types";
export * from "./cart/api";

// ============================================
// Orders
// ============================================

export * from "./orders/types";
export * from "./orders/api";

// ============================================
// Payments
// ============================================

export * from "./payments/types";
export * from "./payments/api";

// ============================================
// Questions & Answers
// ============================================

export * from "./questions/types";
export * from "./questions/api";

// ============================================
// Reviews
// ============================================

export * from "./reviews/types";
export * from "./reviews/api";

// ============================================
// Media
// ============================================

export * from "./media/types";
export * from "./media/api";

// ============================================
// Aggregated API Object
// ============================================

/**
 * Aggregated API client object containing all domain APIs
 *
 * Provides a centralized access point for all API operations
 *
 * @example
 * ```ts
 * import { api } from '@/lib/api';
 *
 * // Authentication
 * await api.auth.signIn({ email, password });
 * const user = await api.auth.getCurrentUser();
 *
 * // Users
 * await api.users.create({ email, password, nickname });
 * await api.users.updateProfile({ nickname });
 *
 * // Courses
 * const { items } = await api.courses.list({ page: 1 });
 * const course = await api.courses.getById('id');
 *
 * // Cart
 * await api.cart.add({ courseId: 'id' });
 * const cartItems = await api.cart.getAll();
 *
 * // Orders
 * const order = await api.orders.create();
 * const { items: orders } = await api.orders.list();
 *
 * // Questions
 * await api.questions.questions.create('course_id', { title, content });
 * await api.questions.answers.create('question_id', { content });
 *
 * // Reviews
 * await api.reviews.reviews.create('course_id', { rating, title, content });
 * const stats = await api.reviews.reviews.getStatistics('course_id');
 *
 * // Media
 * const { cloudFrontUrl } = await api.media.upload(file);
 * ```
 */
export { default as api } from "./api-client";
