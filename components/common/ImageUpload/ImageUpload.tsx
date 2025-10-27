"use client";

import { useRef, useState } from "react";
import { mediaApi } from "@/lib/api/media/api";
import { Button } from "../Button/Button";
import type { ImageUploadProps } from "./types";

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onError,
  maxSizeInMB = 5,
  disabled = false,
  className = "",
  variant = "profile",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onError?.("이미지 파일만 업로드 가능합니다");
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

      const { cloudFrontUrl } = await mediaApi.upload(file, (progress) => {
        setUploadProgress(progress);
      });

      onChange(cloudFrontUrl);
      setUploadProgress(0);
    } catch (error) {
      console.error("Image upload failed:", error);
      onError?.("이미지 업로드에 실패했습니다");
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
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Variant에 따른 스타일 설정
  const containerStyle = variant === "profile"
    ? "w-32 h-32 rounded-full"
    : "w-full aspect-video rounded-lg";

  const imageAlt = variant === "profile" ? "Profile" : "Thumbnail";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload progress - 업로드 중일 때만 표시 */}
      {isUploading && (
        <div className={`${containerStyle} bg-neutral-10 border-2 border-neutral-20 flex items-center justify-center`}>
          <div className="text-center">
            <div className="text-sm font-medium text-neutral-70">
              {uploadProgress}%
            </div>
            <div className="text-xs text-neutral-50 mt-1">업로드 중...</div>
          </div>
        </div>
      )}

      {/* Preview - 업로드 중이 아닐 때만 표시 */}
      {!isUploading && value && (
        <div className={`relative ${containerStyle} overflow-hidden bg-neutral-10 border-2 border-neutral-20`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* No image placeholder - 업로드 중이 아니고 이미지가 없을 때만 표시 */}
      {!isUploading && !value && (
        <div className={`${containerStyle} bg-neutral-10 border-2 border-dashed border-neutral-30 flex items-center justify-center`}>
          <span className="text-neutral-50 text-sm">이미지 없음</span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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
          {value ? "이미지 변경" : "이미지 업로드"}
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

      {/* Helper text */}
      <p className="text-xs text-neutral-50">
        JPG, PNG, GIF 형식 (최대 {maxSizeInMB}MB)
      </p>
    </div>
  );
};
