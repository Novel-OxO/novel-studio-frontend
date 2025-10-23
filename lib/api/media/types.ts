// ============================================
// Request Types
// ============================================

export interface GeneratePresignedUrlRequest {
  fileName: string;
}

// ============================================
// Response Types
// ============================================

export interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
  cloudFrontUrl: string;
}
