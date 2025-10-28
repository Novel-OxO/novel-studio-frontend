import type { ISODateString } from "../common/types";

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
  videoUrl?: string;
}

export interface UpdateLectureRequest {
  title?: string;
  description?: string;
  order?: number;
  duration?: number;
  isPreview?: boolean;
  videoUrl?: string;
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
  videoUrl: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
