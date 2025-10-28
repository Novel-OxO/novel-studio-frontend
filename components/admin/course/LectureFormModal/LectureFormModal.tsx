"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { VideoUpload } from "@/components/common/VideoUpload/VideoUpload";
import { formatDuration } from "@/lib/utils/time";
import type { LectureFormModalProps } from "./types";

export const LectureFormModal: React.FC<LectureFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  mode,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    duration: initialData?.duration?.toString() || "",
    isPreview: initialData?.isPreview || false,
    videoUrl: initialData?.videoUrl || "",
  });

  const [errors, setErrors] = useState({
    title: "",
    videoUrl: "",
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        description: initialData?.description || "",
        duration: initialData?.duration?.toString() || "",
        isPreview: initialData?.isPreview || false,
        videoUrl: initialData?.videoUrl || "",
      });
      setErrors({ title: "", videoUrl: "" });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      title: "",
      videoUrl: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "제목은 필수입니다";
    }

    setErrors(newErrors);

    if (newErrors.title || newErrors.videoUrl) {
      return;
    }

    // Submit
    onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      duration: formData.duration ? Number(formData.duration) : undefined,
      isPreview: formData.isPreview,
      videoUrl: formData.videoUrl || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="px-6 pt-6 pb-4 border-b border-neutral-20">
            <h2 className="text-2xl font-bold text-neutral-95">
              {mode === "create" ? "강의 추가" : "강의 수정"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Title */}
            <Input
              label="강의 제목"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.title}
              placeholder="예: 1. TypeScript 기초"
              disabled={isLoading}
              required
            />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm font-bold text-neutral-70"
              >
                강의 설명
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="TypeScript의 기본 문법을 배웁니다"
                disabled={isLoading}
                rows={4}
                className="px-2 py-1 rounded-sm border border-neutral-20 bg-white text-neutral-80 placeholder:text-neutral-30 focus:outline-none focus:ring-2 focus:ring-mint-40 transition-colors"
              />
            </div>

            {/* Duration - Read Only */}
            <div className="flex flex-col gap-2">
              <label htmlFor="duration" className="text-sm font-bold text-neutral-70">
                재생 시간
              </label>
              <input
                id="duration"
                type="text"
                value={
                  formData.duration
                    ? formatDuration(Number(formData.duration))
                    : ""
                }
                placeholder="비디오 업로드 시 자동 계산됩니다"
                readOnly
                className="px-2 py-1 rounded-sm border border-neutral-20 bg-neutral-5 text-neutral-50 cursor-default focus:ring-0 focus:border-neutral-20"
              />
            </div>

            {/* Is Preview */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPreview"
                checked={formData.isPreview}
                onChange={(e) =>
                  setFormData({ ...formData, isPreview: e.target.checked })
                }
                disabled={isLoading}
                className="w-4 h-4 text-mint-50 border-neutral-20 rounded focus:ring-2 focus:ring-mint-40"
              />
              <label
                htmlFor="isPreview"
                className="text-sm font-medium text-neutral-70 cursor-pointer"
              >
                미리보기 가능
              </label>
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-bold text-neutral-70 mb-2">
                비디오
              </label>
              <VideoUpload
                value={formData.videoUrl}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, videoUrl: url || "" }))
                }
                onDurationChange={(duration) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: duration.toString(),
                  }))
                }
                onError={(error) => setErrors({ ...errors, videoUrl: error })}
                disabled={isLoading}
              />
              {errors.videoUrl && (
                <p className="text-sm text-red-50 mt-1">{errors.videoUrl}</p>
              )}
            </div>
            </div>

            {/* Actions - Fixed */}
            <div className="px-6 py-4 border-t border-neutral-20 flex gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "처리 중..." : mode === "create" ? "추가" : "수정"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
