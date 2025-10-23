import type { ISODateString } from "../common/types";

// ============================================
// Request Types
// ============================================

export interface CreateReviewRequest {
  rating: number;
  title: string;
  content: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
}

export interface CreateReviewReplyRequest {
  content: string;
}

export interface UpdateReviewReplyRequest {
  content: string;
}

// ============================================
// Response Types
// ============================================

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  userId: string;
  courseId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ReviewReply {
  id: string;
  content: string;
  reviewId: string;
  userId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}
