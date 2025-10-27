import { post, get } from "../common/client";
import { setTokens } from "@/lib/token/storage";
import type { SignInRequest, AuthTokens, CurrentUser } from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  SIGN_IN: "/auth/signin",
  ME: "/auth/me",
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Sign in with email and password
 *
 * @param credentials - User credentials (email and password)
 * @returns Authentication tokens
 *
 * @example
 * ```ts
 * const tokens = await signIn({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 401 Unauthorized - Email or password incorrect
 */
const signIn = async (credentials: SignInRequest): Promise<AuthTokens> => {
  const tokens = await post<AuthTokens, SignInRequest>(
    ENDPOINTS.SIGN_IN,
    credentials
  );

  // TODO: 로컬 스토리지에 저장안하고 다른데에 저장할 것 추후에 수정
  // Store tokens in localStorage
  setTokens(tokens.accessToken, tokens.refreshToken);

  return tokens;
};

/**
 * Get current authenticated user information
 *
 * Requires valid access token in Authorization header
 *
 * @returns Current user information
 *
 * @example
 * ```ts
 * const user = await getCurrentUser();
 * console.log(user.email, user.role);
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Invalid or missing token
 */
const getCurrentUser = async (): Promise<CurrentUser> => {
  return get<CurrentUser>(ENDPOINTS.ME);
};

// ============================================
// Auth API Object (alternative usage pattern)
// ============================================

/**
 * Authentication API client object
 *
 * Provides an alternative object-based API for authentication operations
 *
 * @example
 * ```ts
 * import { authApi } from '@/lib/api/auth/api';
 *
 * const tokens = await authApi.signIn({ email, password });
 * const user = await authApi.getCurrentUser();
 * ```
 */
export const authApi = {
  signIn,
  getCurrentUser,
} as const;

export default authApi;
