import { post, patch, del } from "../common/client";
import type { CreateUserRequest, UpdateUserRequest, User } from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  USERS: "/users",
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Create a new user account (sign up)
 *
 * Public endpoint - no authentication required
 *
 * @param userData - User registration data
 * @returns Created user information
 *
 * @example
 * ```ts
 * const user = await createUser({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!',
 *   nickname: 'JohnDoe'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 400 Bad Request - Invalid request data
 * @throws {ApiErrorResponse} 409 Conflict - Email already in use
 */
const createUser = async (userData: CreateUserRequest): Promise<User> => {
  return post<User, CreateUserRequest>(ENDPOINTS.USERS, userData);
};

/**
 * Update current user's profile
 *
 * Requires authentication. Updates the authenticated user's profile.
 *
 * @param updates - Profile update data
 * @returns Updated user information
 *
 * @example
 * ```ts
 * const user = await updateUserProfile({
 *   nickname: 'NewNickname',
 *   profileImageUrl: 'https://example.com/avatar.jpg'
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 404 Not Found - User not found
 */
const updateUserProfile = async (updates: UpdateUserRequest): Promise<User> => {
  return patch<User, UpdateUserRequest>(ENDPOINTS.USERS, updates);
};

/**
 * Delete current user's account
 *
 * Requires authentication. Permanently deletes the authenticated user's account.
 *
 * @example
 * ```ts
 * await deleteUserAccount();
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 404 Not Found - User not found
 */
const deleteUserAccount = async (): Promise<void> => {
  return del(ENDPOINTS.USERS);
};

// ============================================
// Users API Object
// ============================================

/**
 * Users API client object
 *
 * Provides an alternative object-based API for user operations
 *
 * @example
 * ```ts
 * import { usersApi } from '@/lib/api/users/api';
 *
 * const user = await usersApi.create({ email, password, nickname });
 * const updated = await usersApi.updateProfile({ nickname });
 * await usersApi.deleteAccount();
 * ```
 */
export const usersApi = {
  create: createUser,
  updateProfile: updateUserProfile,
  deleteAccount: deleteUserAccount,
} as const;

export default usersApi;
