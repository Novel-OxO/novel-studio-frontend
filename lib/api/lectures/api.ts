import { post, patch, del } from "../common/client";
import type {
  CreateLectureRequest,
  UpdateLectureRequest,
  Lecture,
} from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  LECTURES: (courseId: string) => `/courses/${courseId}/lectures`,
  LECTURE_BY_ID: (courseId: string, lectureId: string) =>
    `/courses/${courseId}/lectures/${lectureId}`,
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Create a new lecture within a course
 *
 * Requires admin authentication
 *
 * @param courseId - Parent course ID
 * @param lectureData - Lecture creation data
 * @returns Created lecture information
 *
 * @example
 * ```ts
 * const lecture = await createLecture('course_id', {
 *   title: '1. TypeScript Basics',
 *   description: 'Introduction to TypeScript...',
 *   order: 0,
 *   duration: 600,
 *   isPreview: false,
 *   sectionId: 'section_uuid',
 *   videoUrl: 'https://example.com/video.mp4'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 404 Not Found - Course or section not found
 */
const createLecture = async (
  courseId: string,
  lectureData: CreateLectureRequest
): Promise<Lecture> => {
  return post<Lecture, CreateLectureRequest>(
    ENDPOINTS.LECTURES(courseId),
    lectureData
  );
};

/**
 * Update an existing lecture
 *
 * Requires admin authentication
 *
 * @param courseId - Parent course ID
 * @param lectureId - Lecture unique identifier
 * @param updates - Lecture update data
 * @returns Updated lecture information
 *
 * @example
 * ```ts
 * const updated = await updateLecture('course_id', 'lecture_id', {
 *   title: '1. TypeScript Advanced',
 *   duration: 720,
 *   videoUrl: 'https://example.com/new-video.mp4'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 404 Not Found - Lecture not found
 */
const updateLecture = async (
  courseId: string,
  lectureId: string,
  updates: UpdateLectureRequest
): Promise<Lecture> => {
  return patch<Lecture, UpdateLectureRequest>(
    ENDPOINTS.LECTURE_BY_ID(courseId, lectureId),
    updates
  );
};

/**
 * Delete a lecture
 *
 * Requires admin authentication. Soft deletes the lecture.
 *
 * @param courseId - Parent course ID
 * @param lectureId - Lecture unique identifier
 *
 * @example
 * ```ts
 * await deleteLecture('course_id', 'lecture_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 404 Not Found - Lecture not found
 */
const deleteLecture = async (
  courseId: string,
  lectureId: string
): Promise<void> => {
  return del(ENDPOINTS.LECTURE_BY_ID(courseId, lectureId));
};

// ============================================
// Lectures API Object
// ============================================

/**
 * Lectures API client object
 *
 * Provides an alternative object-based API for lecture operations
 *
 * @example
 * ```ts
 * import { lecturesApi } from '@/lib/api/lectures/api';
 *
 * const lecture = await lecturesApi.create('course_id', { ... });
 * const updated = await lecturesApi.update('course_id', 'lecture_id', { ... });
 * await lecturesApi.delete('course_id', 'lecture_id');
 * ```
 */
export const lecturesApi = {
  create: createLecture,
  update: updateLecture,
  delete: deleteLecture,
} as const;

export default lecturesApi;
