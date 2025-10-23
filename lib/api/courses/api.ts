import { get, post, patch, del } from "../common/client";
import type { PaginatedData } from "../common/types";
import type {
  GetCoursesParams,
  GetCourseByIdParams,
  CreateCourseRequest,
  UpdateCourseRequest,
  Course,
  CourseWithDetails,
} from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  COURSES: "/courses",
  COURSE_BY_ID: (id: string) => `/courses/${id}`,
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Get list of courses with optional filters and pagination
 *
 * Public endpoint - no authentication required
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Paginated list of courses
 *
 * @example
 * ```ts
 * const { items, pagination } = await getCourses({
 *   page: 1,
 *   pageSize: 10,
 *   status: CourseStatus.PUBLISHED,
 *   level: CourseLevel.BEGINNER
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid query parameters
 */
const getCourses = async (
  params?: GetCoursesParams
): Promise<PaginatedData<Course>> => {
  return get<PaginatedData<Course>>("/courses", { params });
};

/**
 * Get course by ID with optional nested sections and lectures
 *
 * Public endpoint - no authentication required
 *
 * @param id - Course unique identifier
 * @param params - Query parameters for including nested data
 * @returns Course details with optional sections and lectures
 *
 * @example
 * ```ts
 * // Get basic course info
 * const course = await getCourseById('course_id');
 *
 * // Get course with sections
 * const courseWithSections = await getCourseById('course_id', {
 *   includeSections: true
 * });
 *
 * // Get course with sections and lectures
 * const fullCourse = await getCourseById('course_id', {
 *   includeSections: true,
 *   includeLectures: true
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid query parameters
 * @throws {ApiErrorResponse} 404 Not Found - Course not found
 */
const getCourseById = async (
  id: string,
  params?: GetCourseByIdParams
): Promise<CourseWithDetails> => {
  return get<CourseWithDetails>(ENDPOINTS.COURSE_BY_ID(id), { params });
};

/**
 * Create a new course
 *
 * Requires admin authentication
 *
 * @param courseData - Course creation data
 * @returns Created course information
 *
 * @example
 * ```ts
 * const course = await createCourse({
 *   slug: 'nestjs-fundamentals',
 *   title: 'NestJS Fundamentals',
 *   description: 'Learn NestJS from scratch',
 *   price: 50000,
 *   level: CourseLevel.BEGINNER,
 *   status: CourseStatus.DRAFT
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 409 Conflict - Slug already in use
 */
const createCourse = async (
  courseData: CreateCourseRequest
): Promise<Course> => {
  return post<Course, CreateCourseRequest>(ENDPOINTS.COURSES, courseData);
};

/**
 * Update an existing course
 *
 * Requires admin authentication
 *
 * @param id - Course unique identifier
 * @param updates - Course update data
 * @returns Updated course information
 *
 * @example
 * ```ts
 * const updated = await updateCourse('course_id', {
 *   title: 'NestJS Advanced',
 *   status: CourseStatus.PUBLISHED
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 404 Not Found - Course not found
 * @throws {ApiErrorResponse} 409 Conflict - Slug already in use
 */
const updateCourse = async (
  id: string,
  updates: UpdateCourseRequest
): Promise<Course> => {
  return patch<Course, UpdateCourseRequest>(
    ENDPOINTS.COURSE_BY_ID(id),
    updates
  );
};

/**
 * Delete a course
 *
 * Requires admin authentication. Soft deletes the course.
 *
 * @param id - Course unique identifier
 *
 * @example
 * ```ts
 * await deleteCourse('course_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 404 Not Found - Course not found
 */
const deleteCourse = async (id: string): Promise<void> => {
  return del(ENDPOINTS.COURSE_BY_ID(id));
};

// ============================================
// Courses API Object
// ============================================

/**
 * Courses API client object
 *
 * Provides an alternative object-based API for course operations
 *
 * @example
 * ```ts
 * import { coursesApi } from '@/lib/api/courses/api';
 *
 * const { items } = await coursesApi.list({ page: 1 });
 * const course = await coursesApi.getById('id');
 * const created = await coursesApi.create({ ... });
 * const updated = await coursesApi.update('id', { ... });
 * await coursesApi.delete('id');
 * ```
 */
export const coursesApi = {
  list: getCourses,
  getById: getCourseById,
  create: createCourse,
  update: updateCourse,
  delete: deleteCourse,
} as const;

export default coursesApi;
