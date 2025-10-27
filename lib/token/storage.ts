// ============================================
// Token Storage Keys
// ============================================

const TOKEN_STORAGE_KEY = "novel_studio_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "novel_studio_refresh_token";

// ============================================
// Token Management Functions
// ============================================

/**
 * Get access token from localStorage
 *
 * @returns Access token or null if not found or in SSR context
 *
 * @example
 * ```ts
 * const token = getAccessToken();
 * if (token) {
 *   // Use token for authenticated requests
 * }
 * ```
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Set access token in localStorage
 *
 * @param token - Access token to store
 *
 * @example
 * ```ts
 * setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * ```
 */
export const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

/**
 * Get refresh token from localStorage
 *
 * @returns Refresh token or null if not found or in SSR context
 *
 * @example
 * ```ts
 * const refreshToken = getRefreshToken();
 * if (refreshToken) {
 *   // Use refresh token to get new access token
 * }
 * ```
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Set refresh token in localStorage
 *
 * @param token - Refresh token to store
 *
 * @example
 * ```ts
 * setRefreshToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * ```
 */
export const setRefreshToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
};

/**
 * Clear all tokens from localStorage
 *
 * Usually called on logout or when tokens are invalid
 *
 * @example
 * ```ts
 * clearTokens();
 * // User is now logged out
 * ```
 */
export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Set both access and refresh tokens at once
 *
 * Convenient method for storing both tokens after successful login
 *
 * @param accessToken - Access token to store
 * @param refreshToken - Refresh token to store
 *
 * @example
 * ```ts
 * setTokens(
 *   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * );
 * ```
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

/**
 * Check if user is authenticated (has access token)
 *
 * @returns True if access token exists, false otherwise
 *
 * @example
 * ```ts
 * if (isAuthenticated()) {
 *   // Show authenticated UI
 * } else {
 *   // Show login UI
 * }
 * ```
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
