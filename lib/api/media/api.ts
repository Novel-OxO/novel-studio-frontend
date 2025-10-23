import { post } from "../common/client";
import type {
  GeneratePresignedUrlRequest,
  PresignedUrlResponse,
} from "./types";

// ============================================
// API Endpoints
// ============================================

const ENDPOINTS = {
  PRESIGNED_URL: "/media/presigned-url",
} as const;

// ============================================
// API Functions
// ============================================

/**
 * Generate presigned URL for uploading media to S3
 *
 * Requires admin authentication
 *
 * @param data - File name for upload
 * @returns Presigned URL and file access information
 *
 * @example
 * ```ts
 * const { presignedUrl, key, cloudFrontUrl } = await generatePresignedUrl({
 *   fileName: 'video.mp4'
 * });
 *
 * // Upload file to S3 using presigned URL
 * await fetch(presignedUrl, {
 *   method: 'PUT',
 *   body: file,
 *   headers: { 'Content-Type': file.type }
 * });
 *
 * // Use cloudFrontUrl to access the file
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 */
const generatePresignedUrl = async (
  data: GeneratePresignedUrlRequest
): Promise<PresignedUrlResponse> => {
  return post<PresignedUrlResponse, GeneratePresignedUrlRequest>(
    ENDPOINTS.PRESIGNED_URL,
    data
  );
};

/**
 * Upload file directly to S3 using presigned URL
 *
 * This is a helper function that combines presigned URL generation and file upload.
 *
 * @param file - File to upload
 * @param onProgress - Optional progress callback
 * @returns CloudFront URL and S3 key for the uploaded file
 *
 * @example
 * ```ts
 * const { cloudFrontUrl, key } = await uploadFile(file, (progress) => {
 *   console.log(`Upload progress: ${progress}%`);
 * });
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {Error} Upload failed
 */
const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ cloudFrontUrl: string; key: string }> => {
  // Generate presigned URL
  const { presignedUrl, key, cloudFrontUrl } = await generatePresignedUrl({
    fileName: file.name,
  });

  // Upload file to S3
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    // Handle upload completion
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ cloudFrontUrl, key });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // Handle upload errors
    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    // Send request
    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
};

/**
 * Upload file using fetch API (alternative to XMLHttpRequest)
 *
 * Simpler implementation without progress tracking.
 *
 * @param file - File to upload
 * @returns CloudFront URL and S3 key for the uploaded file
 *
 * @example
 * ```ts
 * const { cloudFrontUrl, key } = await uploadFileWithFetch(file);
 * ```
 *
 * @throws {ApiErrorResponse} 401 Unauthorized - Not authenticated
 * @throws {ApiErrorResponse} 403 Forbidden - Not an admin user
 * @throws {Error} Upload failed
 */
const uploadFileWithFetch = async (
  file: File
): Promise<{ cloudFrontUrl: string; key: string }> => {
  // Generate presigned URL
  const { presignedUrl, key, cloudFrontUrl } = await generatePresignedUrl({
    fileName: file.name,
  });

  // Upload file to S3
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  return { cloudFrontUrl, key };
};

// ============================================
// Media API Object (alternative usage pattern)
// ============================================

/**
 * Media API client object
 *
 * Provides an alternative object-based API for media operations
 *
 * @example
 * ```ts
 * import { mediaApi } from '@/lib/api/media/api';
 *
 * // Generate presigned URL only
 * const urlData = await mediaApi.generatePresignedUrl({ fileName: 'video.mp4' });
 *
 * // Upload file directly (with progress)
 * const { cloudFrontUrl } = await mediaApi.upload(file, (progress) => {
 *   console.log(`${progress}%`);
 * });
 *
 * // Upload file directly (without progress)
 * const result = await mediaApi.uploadWithFetch(file);
 * ```
 */
export const mediaApi = {
  generatePresignedUrl,
  upload: uploadFile,
  uploadWithFetch: uploadFileWithFetch,
} as const;

export default mediaApi;
