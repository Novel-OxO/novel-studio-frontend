"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses/api";
import { CourseLevel, CourseStatus } from "@/lib/api/common/types";
import type { CreateCourseRequest } from "@/lib/api/courses/types";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";
import { ImageUpload } from "@/components/common/ImageUpload/ImageUpload";
import { Select } from "@/components/common/Select/Select";
import type { SelectOption } from "@/components/common/Select/types";
import { Button } from "@/components/common/Button/Button";
import { RichTextEditor } from "@/components/common/RichTextEditor/RichTextEditor";

// Select 옵션 정의
const levelOptions: SelectOption[] = [
  { value: CourseLevel.BEGINNER, label: "초급" },
  { value: CourseLevel.INTERMEDIATE, label: "중급" },
  { value: CourseLevel.ADVANCED, label: "고급" },
];

const statusOptions: SelectOption[] = [
  { value: CourseStatus.DRAFT, label: "초안" },
  { value: CourseStatus.PUBLISHED, label: "게시됨" },
  { value: CourseStatus.ARCHIVED, label: "보관됨" },
];

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCourseRequest>({
    slug: "",
    title: "",
    description: "",
    thumbnailUrl: "",
    price: 0,
    level: CourseLevel.BEGINNER,
    status: CourseStatus.DRAFT,
  });
  const [error, setError] = useState<string>("");

  const createCourseMutation = useMutation({
    mutationFn: (data: CreateCourseRequest) => coursesApi.create(data),
    onSuccess: () => {
      // 코스 생성 후 코스 목록 페이지로 리다이렉트
      router.push("/admin/course/list");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { error?: { message?: string } } } };
      setError(
        apiError.response?.data?.error?.message || "코스 생성에 실패했습니다."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 필수 필드 검증
    if (!formData.slug.trim()) {
      setError("슬러그를 입력해주세요.");
      return;
    }
    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!formData.description.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    createCourseMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-95 mb-6">코스 생성</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md border border-neutral-80 p-6 space-y-6"
        >
          {error && <ErrorMessage message={error} />}

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-neutral-95 mb-2"
            >
              슬러그 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
              placeholder="nestjs-fundamentals"
              required
            />
            <p className="text-xs text-neutral-40 mt-1">
              URL에 사용될 고유 식별자 (영문, 숫자, 하이픈만 사용)
            </p>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-95 mb-2"
            >
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
              placeholder="NestJS 기초부터 심화까지"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-95 mb-2">
              설명 <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, description: html }))
              }
              placeholder="이 코스에서 배울 내용을 설명해주세요..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-95 mb-2">
              썸네일 이미지
            </label>
            <ImageUpload
              variant="thumbnail"
              value={formData.thumbnailUrl || null}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, thumbnailUrl: url || "" }))
              }
              onError={setError}
              maxSizeInMB={10}
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-neutral-95 mb-2"
            >
              가격 (원)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-95 mb-2">
              난이도
            </label>
            <Select
              id="level"
              name="level"
              value={formData.level as string}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  level: value as CourseLevel,
                }))
              }
              options={levelOptions}
              placeholder="난이도를 선택하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-95 mb-2">
              상태
            </label>
            <Select
              id="status"
              name="status"
              value={formData.status as string}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as CourseStatus,
                }))
              }
              options={statusOptions}
              placeholder="상태를 선택하세요"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
              fullWidth
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="black"
              size="sm"
              disabled={createCourseMutation.isPending}
              isLoading={createCourseMutation.isPending}
              fullWidth
            >
              코스 생성
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
