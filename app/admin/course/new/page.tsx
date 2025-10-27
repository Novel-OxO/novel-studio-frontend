"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses/api";
import { CourseLevel, CourseStatus } from "@/lib/api/common/types";
import type { CreateCourseRequest } from "@/lib/api/courses/types";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";

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
    onSuccess: (course) => {
      // 코스 생성 후 수정 페이지로 리다이렉트
      router.push(`/admin/course/${course.id}`);
    },
    onError: (error: any) => {
      setError(error.response?.data?.error?.message || "코스 생성에 실패했습니다.");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        <h1 className="text-3xl font-bold text-neutral-10 mb-6">코스 생성</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {error && <ErrorMessage message={error} />}

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-neutral-20 mb-2">
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
            <label htmlFor="title" className="block text-sm font-medium text-neutral-20 mb-2">
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
            <label htmlFor="description" className="block text-sm font-medium text-neutral-20 mb-2">
              설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
              placeholder="이 코스에서 배울 내용을 설명해주세요."
              required
            />
          </div>

          <div>
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-neutral-20 mb-2">
              썸네일 URL
            </label>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-neutral-20 mb-2">
              가격 (원)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
              placeholder="50000"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-neutral-20 mb-2">
              난이도
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
            >
              <option value={CourseLevel.BEGINNER}>초급</option>
              <option value={CourseLevel.INTERMEDIATE}>중급</option>
              <option value={CourseLevel.ADVANCED}>고급</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-20 mb-2">
              상태
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
            >
              <option value={CourseStatus.DRAFT}>초안</option>
              <option value={CourseStatus.PUBLISHED}>게시됨</option>
              <option value={CourseStatus.ARCHIVED}>보관됨</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-neutral-80 text-neutral-20 rounded-lg hover:bg-neutral-95 font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createCourseMutation.isPending}
              className="flex-1 px-4 py-2 bg-mint-40 text-white rounded-lg hover:bg-mint-30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createCourseMutation.isPending ? "생성 중..." : "코스 생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
