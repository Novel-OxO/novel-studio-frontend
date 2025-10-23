
import type { ISODateString } from "../common/types";

// ============================================
// Request Types
// ============================================

export interface CreateSectionRequest {
  title: string;
  order: number;
}
export interface UpdateSectionRequest {
  title?: string;
  order?: number;
}

// ============================================
// Response Types
// ============================================

export interface Section {
  id: string;
  title: string;
  order: number;
  courseId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
