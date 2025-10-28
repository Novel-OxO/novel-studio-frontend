/**
 * Courses API Types
 */

import type {
  CourseLevel,
  CourseStatus,
  ISODateString,
  PaginationParams,
} from "../common/types";

// ============================================
// Request Types
// ============================================

export interface GetCoursesParams extends PaginationParams {
  status?: CourseStatus;
  level?: CourseLevel;
}

export interface GetCourseByIdParams {
  includeSections?: boolean;
  includeLectures?: boolean;
}

export interface CreateCourseRequest {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  price?: number;
  level?: CourseLevel;
  status?: CourseStatus;
}

export interface UpdateCourseRequest {
  slug?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  price?: number;
  level?: CourseLevel;
  status?: CourseStatus;
}

// ============================================
// Response Types
// ============================================

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  price: number;
  level: CourseLevel;
  status: CourseStatus;
  createdAt: ISODateString;
}

export interface CourseSection {
  id: string;
  title: string;
  order: number;
  courseId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CourseLecture {
  id: string;
  title: string;
  description: string | null;
  order: number;
  duration: number | null;
  isPreview: boolean;
  sectionId: string;
  courseId: string;
  videoUrl: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CourseWithDetails extends Course {
  sections?: CourseSection[];
  lectures?: CourseLecture[];
}
