import type { UserRole } from "../common/types";

// ============================================
// Request Types
// ============================================

export interface SignInRequest {
  email: string;
  password: string;
}

// ============================================
// Response Types
// ============================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUser {
  userId: string;
  email: string;
  role: UserRole;
  nickname: string;
  profileImageUrl: string | null;
}
