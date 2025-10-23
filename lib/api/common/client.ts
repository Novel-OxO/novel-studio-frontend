import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "./types";

// ============================================
// Configuration
// ============================================

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const TIMEOUT = 30000; // 30 seconds

// ============================================
// Token Management
// ============================================

const TOKEN_STORAGE_KEY = "novel_studio_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "novel_studio_refresh_token";

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

export const setRefreshToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
};

export const clearTokens = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

// ============================================
// Axios Instance Creation
// ============================================

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${BASE_URL}`,
    timeout: TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // ============================================
  // Request Interceptor
  // ============================================

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add Authorization header if token exists
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // ============================================
  // Response Interceptor
  // ============================================

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Return successful responses as-is
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle token expiration (401 Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Attempt to refresh token
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            // TODO: Token 재발급 기능 구현
            // For now, clear tokens and redirect to login
            clearTokens();

            // Redirect to login page (client-side only)
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect
            clearTokens();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token available, redirect to login
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }

      // Transform error to standard format
      return Promise.reject(transformError(error));
    }
  );

  return instance;
};

// ============================================
// Error Transformation
// ============================================

const transformError = (error: AxiosError): ApiErrorResponse => {
  if (error.response) {
    // Server responded with error
    const data = error.response.data as ApiErrorResponse | undefined;

    if (data && "error" in data) {
      // API returned standard error format
      return data;
    }

    // Fallback for non-standard error responses
    return {
      success: false,
      error: {
        code: "SERVER_001",
        message: error.message || "An unexpected error occurred",
      },
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      error: {
        code: "SERVER_001",
        message: "No response from server. Please check your connection.",
      },
    };
  } else {
    // Error in request setup
    return {
      success: false,
      error: {
        code: "SERVER_001",
        message: error.message || "Failed to send request",
      },
    };
  }
};

// ============================================
// Typed Request Methods
// ============================================

export const apiClient = createApiClient();

export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.get<ApiSuccessResponse<T>>(url, config);
  return response.data.data;
};

export const post = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.post<ApiSuccessResponse<T>>(
    url,
    data,
    config
  );
  return response.data.data;
};

export const patch = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.patch<ApiSuccessResponse<T>>(
    url,
    data,
    config
  );
  return response.data.data;
};

export const put = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.put<ApiSuccessResponse<T>>(
    url,
    data,
    config
  );
  return response.data.data;
};

export const del = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<void> => {
  await apiClient.delete(url, config);
};

export const deleteWithData = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.delete<ApiSuccessResponse<T>>(url, config);
  return response.data.data;
};

export default apiClient;
