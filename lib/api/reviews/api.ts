import { post, get, patch, del } from "../common/client";
import type { PaginatedData, PaginationParams } from "../common/types";
import type {
  CreateReviewRequest,
  UpdateReviewRequest,
  CreateReviewReplyRequest,
  UpdateReviewReplyRequest,
  Review,
  ReviewReply,
  ReviewStatistics,
} from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  REVIEWS_BY_COURSE: (courseId: string) => `/reviews/courses/${courseId}`,
  REVIEW_STATISTICS: (courseId: string) =>
    `/reviews/courses/${courseId}/statistics`,
  REVIEW_BY_ID: (reviewId: string) => `/reviews/${reviewId}`,
  REVIEW_REPLY: (reviewId: string) => `/reviews/${reviewId}/reply`,
  REPLY_BY_ID: (replyId: string) => `/reviews/replies/${replyId}`,
} as const;

// ============================================
// Review API Functions
// ============================================

/**
 * Create a review for a course
 *
 * Requires authentication. Only enrolled students can write reviews.
 *
 * @param courseId - Course ID
 * @param data - Review data
 * @returns Created review
 *
 * @example
 * ```ts
 * const review = await createReview('course_id', {
 *   rating: 5,
 *   title: 'Excellent course!',
 *   content: 'This course helped me a lot...'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not enrolled in the course
 * @throws {ApiErrorResponse} 409 Conflict - Already reviewed this course
 */
const createReview = async (
  courseId: string,
  data: CreateReviewRequest
): Promise<Review> => {
  return post<Review, CreateReviewRequest>(
    ENDPOINTS.REVIEWS_BY_COURSE(courseId),
    data
  );
};

/**
 * Get reviews for a course with pagination
 *
 * Public endpoint - no authentication required
 *
 * @param courseId - Course ID
 * @param params - Pagination parameters
 * @returns Paginated list of reviews
 *
 * @example
 * ```ts
 * const { items, pagination } = await getReviewsByCourse('course_id', {
 *   page: 1,
 *   pageSize: 10
 * });
 * ```
 */
const getReviewsByCourse = async (
  courseId: string,
  params?: PaginationParams
): Promise<PaginatedData<Review>> => {
  return get<PaginatedData<Review>>(ENDPOINTS.REVIEWS_BY_COURSE(courseId), {
    params,
  });
};

/**
 * Get review statistics for a course
 *
 * Public endpoint - no authentication required
 *
 * @param courseId - Course ID
 * @returns Review statistics
 *
 * @example
 * ```ts
 * const stats = await getReviewStatistics('course_id');
 * console.log(stats.averageRating, stats.totalReviews);
 * ```
 */
const getReviewStatistics = async (
  courseId: string
): Promise<ReviewStatistics> => {
  return get<ReviewStatistics>(ENDPOINTS.REVIEW_STATISTICS(courseId));
};

/**
 * Get review by ID
 *
 * Public endpoint - no authentication required
 *
 * @param reviewId - Review ID
 * @returns Review details
 *
 * @example
 * ```ts
 * const review = await getReviewById('review_id');
 * ```
 *
 * @throws {ApiErrorResponse} 404 Not Found - Review not found
 */
const getReviewById = async (reviewId: string): Promise<Review> => {
  return get<Review>(ENDPOINTS.REVIEW_BY_ID(reviewId));
};

/**
 * Update a review
 *
 * Requires authentication. Only the review author can update.
 *
 * @param reviewId - Review ID
 * @param updates - Review update data
 * @returns Updated review
 *
 * @example
 * ```ts
 * const updated = await updateReview('review_id', {
 *   rating: 4,
 *   title: 'Updated title',
 *   content: 'Updated content...'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the author
 */
const updateReview = async (
  reviewId: string,
  updates: UpdateReviewRequest
): Promise<Review> => {
  return patch<Review, UpdateReviewRequest>(
    ENDPOINTS.REVIEW_BY_ID(reviewId),
    updates
  );
};

/**
 * Delete a review
 *
 * Requires authentication. Only the review author can delete.
 *
 * @param reviewId - Review ID
 *
 * @example
 * ```ts
 * await deleteReview('review_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the author
 */
const deleteReview = async (reviewId: string): Promise<void> => {
  return del(ENDPOINTS.REVIEW_BY_ID(reviewId));
};

// ============================================
// Review Reply API Functions
// ============================================

/**
 * Create a reply to a review
 *
 * Requires authentication. Only instructors can reply.
 *
 * @param reviewId - Review ID
 * @param data - Reply data
 * @returns Created reply
 *
 * @example
 * ```ts
 * const reply = await createReviewReply('review_id', {
 *   content: 'Thank you for your feedback!'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the instructor
 * @throws {ApiErrorResponse} 409 Conflict - Reply already exists
 */
const createReviewReply = async (
  reviewId: string,
  data: CreateReviewReplyRequest
): Promise<ReviewReply> => {
  return post<ReviewReply, CreateReviewReplyRequest>(
    ENDPOINTS.REVIEW_REPLY(reviewId),
    data
  );
};

/**
 * Get reply for a review
 *
 * Public endpoint - no authentication required
 *
 * @param reviewId - Review ID
 * @returns Review reply or null if no reply exists
 *
 * @example
 * ```ts
 * const reply = await getReviewReply('review_id');
 * if (reply) {
 *   console.log(reply.content);
 * }
 * ```
 */
const getReviewReply = async (
  reviewId: string
): Promise<ReviewReply | null> => {
  return get<ReviewReply | null>(ENDPOINTS.REVIEW_REPLY(reviewId));
};

/**
 * Update a review reply
 *
 * Requires authentication. Only the reply author can update.
 *
 * @param replyId - Reply ID
 * @param updates - Reply update data
 * @returns Updated reply
 *
 * @example
 * ```ts
 * const updated = await updateReviewReply('reply_id', {
 *   content: 'Updated reply content...'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the author
 */
const updateReviewReply = async (
  replyId: string,
  updates: UpdateReviewReplyRequest
): Promise<ReviewReply> => {
  return patch<ReviewReply, UpdateReviewReplyRequest>(
    ENDPOINTS.REPLY_BY_ID(replyId),
    updates
  );
};

/**
 * Delete a review reply
 *
 * Requires authentication. Only the reply author can delete.
 *
 * @param replyId - Reply ID
 *
 * @example
 * ```ts
 * await deleteReviewReply('reply_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not the author
 */
const deleteReviewReply = async (replyId: string): Promise<void> => {
  return del(ENDPOINTS.REPLY_BY_ID(replyId));
};

// ============================================
// Reviews API Object
// ============================================

/**
 * Reviews API client object
 *
 * Provides an alternative object-based API for review operations
 *
 * @example
 * ```ts
 * import { reviewsApi } from '@/lib/api/reviews/api';
 *
 * // Reviews
 * const review = await reviewsApi.reviews.create('course_id', { ... });
 * const { items } = await reviewsApi.reviews.getByCourse('course_id');
 * const stats = await reviewsApi.reviews.getStatistics('course_id');
 * const single = await reviewsApi.reviews.getById('review_id');
 * await reviewsApi.reviews.update('review_id', { ... });
 * await reviewsApi.reviews.delete('review_id');
 *
 * // Replies
 * const reply = await reviewsApi.replies.create('review_id', { ... });
 * const existing = await reviewsApi.replies.get('review_id');
 * await reviewsApi.replies.update('reply_id', { ... });
 * await reviewsApi.replies.delete('reply_id');
 * ```
 */
export const reviewsApi = {
  reviews: {
    create: createReview,
    getByCourse: getReviewsByCourse,
    getStatistics: getReviewStatistics,
    getById: getReviewById,
    update: updateReview,
    delete: deleteReview,
  },
  replies: {
    create: createReviewReply,
    get: getReviewReply,
    update: updateReviewReply,
    delete: deleteReviewReply,
  },
} as const;

export default reviewsApi;
