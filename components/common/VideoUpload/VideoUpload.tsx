"use client";

import { useRef, useState } from "react";
import { mediaApi } from "@/lib/api/media/api";
import { Button } from "../Button/Button";
import type { VideoUploadProps } from "./types";

export const VideoUpload: React.FC<VideoUploadProps> = ({
  value,
  onChange,
  onDurationChange,
  onError,
  maxSizeInMB = 5120,
  disabled = false,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const calculateVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        resolve(duration);
      };

      video.onerror = () => {
        reject(new Error("비디오 메타데이터를 읽을 수 없습니다"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      onError?.("비디오 파일만 업로드 가능합니다");
      return;
    }

    // Validate file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      onError?.(`파일 크기는 ${maxSizeInMB}MB 이하여야 합니다`);
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Calculate video duration before upload
      const duration = await calculateVideoDuration(file);

      const { cloudFrontUrl } = await mediaApi.upload(file, (progress) => {
        setUploadProgress(progress);
      });

      onChange(cloudFrontUrl);
      onDurationChange?.(duration);
      setUploadProgress(0);
    } catch (error) {
      console.error("Video upload failed:", error);
      onError?.("비디오 업로드에 실패했습니다");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange(null);
    onDurationChange?.(0);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      onError?.("비디오 파일만 업로드 가능합니다");
      return;
    }

    // Validate file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      onError?.(`파일 크기는 ${maxSizeInMB}MB 이하여야 합니다`);
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Calculate video duration before upload
      const duration = await calculateVideoDuration(file);

      const { cloudFrontUrl } = await mediaApi.upload(file, (progress) => {
        setUploadProgress(progress);
      });

      onChange(cloudFrontUrl);
      onDurationChange?.(duration);
      setUploadProgress(0);
    } catch (error) {
      console.error("Video upload failed:", error);
      onError?.("비디오 업로드에 실패했습니다");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload progress - 업로드 중일 때만 표시 */}
      {isUploading && (
        <div className="w-full aspect-video rounded-lg bg-neutral-10 border-2 border-neutral-20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-neutral-70">
              {uploadProgress}%
            </div>
            <div className="text-sm text-neutral-50 mt-2">업로드 중...</div>
            <div className="w-64 h-2 bg-neutral-20 rounded-full mt-4">
              <div
                className="h-full bg-mint-50 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Video preview - 업로드 중이 아닐 때만 표시 */}
      {!isUploading && value && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-neutral-10 border-2 border-neutral-20">
          <video
            src={value}
            controls
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* No video placeholder with drag and drop - 업로드 중이 아니고 비디오가 없을 때만 표시 */}
      {!isUploading && !value && (
        <div
          className={`w-full aspect-video rounded-lg bg-neutral-10 border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? "border-mint-50 bg-mint-5"
              : "border-neutral-30 hover:border-neutral-40 hover:bg-neutral-5"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="text-center">
            <span className="text-neutral-50 text-sm block mb-2">
              {isDragging
                ? "여기에 비디오를 드롭하세요"
                : "비디오를 드래그하거나 클릭하여 업로드"}
            </span>
            <span className="text-neutral-40 text-xs">
              MP4, MOV, AVI (최대 {maxSizeInMB}MB)
            </span>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
        >
          {value ? "비디오 변경" : "비디오 업로드"}
        </Button>

        {value && !isUploading && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleRemove}
            disabled={disabled}
            className="!text-red-50 hover:!bg-red-5"
          >
            삭제
          </Button>
        )}
      </div>

    </div>
  );
};
