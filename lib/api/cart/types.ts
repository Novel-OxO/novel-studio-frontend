/**
 * Cart API Types
 */

import type { ISODateString } from "../common/types";

// ============================================
// Request Types
// ============================================

export interface AddToCartRequest {
  courseId: string;
}

// ============================================
// Response Types
// ============================================

export interface CartCourse {
  id: string;
  title: string;
  price: number;
  thumbnailUrl: string | null;
}

export interface CartItem {
  userId: string;
  courseId: string;
  course: CartCourse;
  createdAt: ISODateString;
}
