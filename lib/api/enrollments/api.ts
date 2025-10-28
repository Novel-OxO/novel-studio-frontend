import { get, post } from "../common/client";
import type {
  EnrollmentWithCourse,
  EnrolledCourseDetail,
  UpdateProgressRequest,
  UpdateProgressResponse,
} from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  ENROLLMENTS: "/enrollments",
  ENROLLMENT_COURSE: (enrollmentId: string) =>
    `/enrollments/${enrollmentId}/course`,
  ENROLLMENT_PROGRESS: (enrollmentId: string) =>
    `/enrollments/${enrollmentId}/progress`,
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Get user's enrolled courses with progress
 *
 * Requires authentication
 *
 * @returns List of enrolled courses with progress information
 *
 * @example
 * ```ts
 * const enrollments = await getEnrollments();
 * enrollments.forEach(({ enrollment, course }) => {
 *   console.log(`${course.title}: ${enrollment.progress}% complete`);
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 */
const getEnrollments = async (): Promise<EnrollmentWithCourse[]> => {
  return get<EnrollmentWithCourse[]>(ENDPOINTS.ENROLLMENTS);
};

/**
 * Get enrolled course detail with video URLs and progress
 *
 * Requires authentication and enrollment in the course
 *
 * @param enrollmentId - Enrollment unique identifier
 * @returns Course details with sections, lectures (including video URLs), and progress
 *
 * @example
 * ```ts
 * const courseDetail = await getEnrolledCourseDetail('enrollment_id');
 * console.log(`Course: ${courseDetail.title}`);
 * console.log(`Progress: ${courseDetail.enrollment.progress}%`);
 * courseDetail.sections.forEach(section => {
 *   section.lectures.forEach(lecture => {
 *     console.log(`${lecture.title}: ${lecture.videoUrl}`);
 *   });
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not enrolled in this course
 * @throws {ApiErrorResponse} 404 Not Found - Enrollment not found
 */
const getEnrolledCourseDetail = async (
  enrollmentId: string
): Promise<EnrolledCourseDetail> => {
  return get<EnrolledCourseDetail>(ENDPOINTS.ENROLLMENT_COURSE(enrollmentId));
};

/**
 * Update lecture progress
 *
 * Requires authentication and enrollment in the course
 *
 * @param enrollmentId - Enrollment unique identifier
 * @param request - Progress update data
 * @returns Updated lecture progress and overall enrollment progress
 *
 * @example
 * ```ts
 * const result = await updateProgress('enrollment_id', {
 *   lectureId: 'lecture_id',
 *   watchTime: 120,
 *   isCompleted: false
 * });
 * console.log(`Lecture progress: ${result.lectureProgress.watchTime}s`);
 * console.log(`Course progress: ${result.enrollment.progress}%`);
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not enrolled in this course
 * @throws {ApiErrorResponse} 404 Not Found - Enrollment or lecture not found
 */
const updateProgress = async (
  enrollmentId: string,
  request: UpdateProgressRequest
): Promise<UpdateProgressResponse> => {
  return post<UpdateProgressResponse, UpdateProgressRequest>(
    ENDPOINTS.ENROLLMENT_PROGRESS(enrollmentId),
    request
  );
};

// ============================================
// Enrollments API Object
// ============================================

/**
 * Enrollments API client object
 *
 * Provides API functions for enrollment-related operations
 *
 * @example
 * ```ts
 * import { enrollmentsApi } from '@/lib/api/enrollments/api';
 *
 * const enrollments = await enrollmentsApi.list();
 * const courseDetail = await enrollmentsApi.getCourseDetail('enrollment_id');
 * const progress = await enrollmentsApi.updateProgress('enrollment_id', {
 *   lectureId: 'lecture_id',
 *   watchTime: 120,
 *   isCompleted: false
 * });
 * ```
 */
export const enrollmentsApi = {
  list: getEnrollments,
  getCourseDetail: getEnrolledCourseDetail,
  updateProgress,
} as const;

export default enrollmentsApi;
