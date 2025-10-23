import type { ISODateString } from "../common/types";

// ============================================
// Shared Types
// ============================================

/**
 * Video storage information (S3/CloudFront)
 */
export interface VideoStorageInfo {
  url: string;
  key: string;
}

// ============================================
// Request Types
// ============================================

export interface CreateLectureRequest {
  title: string;
  description?: string;
  order: number;
  duration?: number;
  isPreview?: boolean;
  sectionId: string;
  videoStorageInfo?: string;
}

export interface UpdateLectureRequest {
  title?: string;
  description?: string;
  order?: number;
  duration?: number;
  isPreview?: boolean;
  videoStorageInfo?: string;
}

// ============================================
// Response Types
// ============================================

export interface Lecture {
  id: string;
  title: string;
  description: string | null;
  order: number;
  duration: number | null;
  isPreview: boolean;
  sectionId: string;
  courseId: string;
  videoStorageInfo: VideoStorageInfo | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
