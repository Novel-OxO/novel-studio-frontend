/**
 * Token management utilities
 *
 * This module provides functions for managing authentication tokens
 * in localStorage. Includes support for access tokens and refresh tokens.
 *
 * @example
 * ```ts
 * import { setTokens, getAccessToken, clearTokens } from '@/lib/token';
 *
 * // Store tokens after login
 * setTokens(accessToken, refreshToken);
 *
 * // Check if user is authenticated
 * if (isAuthenticated()) {
 *   // User is logged in
 * }
 *
 * // Clear tokens on logout
 * clearTokens();
 * ```
 */

export {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
  setTokens,
  isAuthenticated,
} from "./storage";
