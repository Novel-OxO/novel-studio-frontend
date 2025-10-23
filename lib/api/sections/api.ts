import { post, patch, del } from "../common/client";
import type {
  CreateSectionRequest,
  UpdateSectionRequest,
  Section,
} from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  SECTIONS: (courseId: string) => `/courses/${courseId}/sections`,
  SECTION_BY_ID: (courseId: string, sectionId: string) =>
    `/courses/${courseId}/sections/${sectionId}`,
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Create a new section within a course
 *
 * Requires admin authentication
 *
 * @param courseId - Parent course ID
 * @param sectionData - Section creation data
 * @returns Created section information
 *
 * @example
 * ```ts
 * const section = await createSection('course_id', {
 *   title: '1. Introduction',
 *   order: 0
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 404 Not Found - Course not found
 */
const createSection = async (
  courseId: string,
  sectionData: CreateSectionRequest
): Promise<Section> => {
  return post<Section, CreateSectionRequest>(
    ENDPOINTS.SECTIONS(courseId),
    sectionData
  );
};

/**
 * Update an existing section
 *
 * Requires admin authentication
 *
 * @param courseId - Parent course ID
 * @param sectionId - Section unique identifier
 * @param updates - Section update data
 * @returns Updated section information
 *
 * @example
 * ```ts
 * const updated = await updateSection('course_id', 'section_id', {
 *   title: '1. Getting Started',
 *   order: 0
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 404 Not Found - Section not found
 */
const updateSection = async (
  courseId: string,
  sectionId: string,
  updates: UpdateSectionRequest
): Promise<Section> => {
  return patch<Section, UpdateSectionRequest>(
    ENDPOINTS.SECTION_BY_ID(courseId, sectionId),
    updates
  );
};

/**
 * Delete a section
 *
 * Requires admin authentication. Soft deletes the section.
 *
 * @param courseId - Parent course ID
 * @param sectionId - Section unique identifier
 *
 * @example
 * ```ts
 * await deleteSection('course_id', 'section_id');
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {ApiErrorResponse} 404 Not Found - Section not found
 */
const deleteSection = async (
  courseId: string,
  sectionId: string
): Promise<void> => {
  return del(ENDPOINTS.SECTION_BY_ID(courseId, sectionId));
};

// ============================================
// Sections API Object
// ============================================

/**
 * Sections API client object
 *
 * Provides an alternative object-based API for section operations
 *
 * @example
 * ```ts
 * import { sectionsApi } from '@/lib/api/sections/api';
 *
 * const section = await sectionsApi.create('course_id', { ... });
 * const updated = await sectionsApi.update('course_id', 'section_id', { ... });
 * await sectionsApi.delete('course_id', 'section_id');
 * ```
 */
export const sectionsApi = {
  create: createSection,
  update: updateSection,
  delete: deleteSection,
} as const;

export default sectionsApi;
