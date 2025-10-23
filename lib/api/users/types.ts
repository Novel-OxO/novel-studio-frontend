import type { UserRole, ISODateString } from "../common/types";

// ============================================
// Request Types
// ============================================

export interface CreateUserRequest {
  email: string;
  password: string;
  nickname: string;
}
export interface UpdateUserRequest {
  nickname?: string;
  profileImageUrl?: string | null;
}

// ============================================
// Response Types
// ============================================

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  role: UserRole;
  createdAt: ISODateString;
}
