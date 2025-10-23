import type { ISODateString } from "../common/types";

// ============================================
// Request Types
// ============================================

export interface CreateQuestionRequest {
  title: string;
  content: string;
}

export interface UpdateQuestionRequest {
  title?: string;
  content?: string;
}

export interface CreateAnswerRequest {
  content: string;
}

export interface UpdateAnswerRequest {
  content: string;
}

// ============================================
// Response Types
// ============================================

export interface Question {
  id: string;
  title: string;
  content: string;
  userId: string;
  courseId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Answer {
  id: string;
  content: string;
  userId: string;
  questionId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Answer {
  id: string;
  content: string;
  userId: string;
  questionId: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
