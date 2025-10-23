// ============================================
// Standard Response Formats
// ============================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export type PaginatedResponse<T> = ApiSuccessResponse<PaginatedData<T>>;

// ============================================
// Query Parameters
// ============================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// ============================================
// Enums
// ============================================


export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum CourseLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  READY = "READY",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

// ============================================
// Error Codes
// ============================================


export type ErrorCode =
  // Authentication Errors
  | "AUTH_001" // Authentication failed
  | "AUTH_002" // Token expired
  | "AUTH_003" // Invalid token
  // Validation Errors
  | "VALIDATION_001" // Invalid input data
  | "VALIDATION_002" // Required field missing
  // Permission Errors
  | "PERMISSION_001" // Insufficient permissions
  // Resource Errors
  | "RESOURCE_001" // Resource not found
  // Server Errors
  | "SERVER_001"; // Internal server error

export const ERROR_DESCRIPTIONS: Record<ErrorCode, string> = {
  AUTH_001: "Authentication failed",
  AUTH_002: "Token expired",
  AUTH_003: "Invalid token",
  VALIDATION_001: "Invalid input data",
  VALIDATION_002: "Required field missing",
  PERMISSION_001: "Insufficient permissions",
  RESOURCE_001: "Resource not found",
  SERVER_001: "Internal server error",
};

// ============================================
// Utility Types
// ============================================

export type ISODateString = string;

export interface Timestamped {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export const isSuccessResponse = <T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

export const isErrorResponse = (
  response: ApiResponse<unknown>
): response is ApiErrorResponse => {
  return response.success === false;
};

export type UnwrapPaginatedData<T> = T extends PaginatedResponse<infer U>
  ? U
  : never;

export type UnwrapApiResponse<T> = T extends ApiSuccessResponse<infer U>
  ? U
  : never;
