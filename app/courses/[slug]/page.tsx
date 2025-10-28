"use client";

import { useParams } from "next/navigation";
import { useCourseBySlug } from "@/hooks/api/useCourseBySlug";
import { useAddToCart } from "@/hooks/api/useAddToCart";
import { useConfirm } from "@/hooks/useConfirm";
import { CourseThumbnail } from "@/components/course/CourseThumbnail";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseCurriculum } from "@/components/course/CourseCurriculum";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import type { ApiErrorResponse } from "@/lib/api/common/types";

// TODO 시간 없어서 일단 냅두고 추후 에러 관련 코드 전부 개선 예정
const isApiErrorResponse = (error: unknown): error is ApiErrorResponse => {
  return typeof error === "object" && error !== null && "error" in error;
};

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: course, isLoading, error } = useCourseBySlug(slug);
  const addToCart = useAddToCart();
  const { confirm } = useConfirm();

  const handleAddToCart = async () => {
    if (!course?.id) return;

    addToCart.mutate(
      { courseId: course.id },
      {
        onSuccess: async () => {
          await confirm({
            title: "장바구니에 추가되었습니다",
            message: "장바구니에서 코스를 확인하고 결제할 수 있습니다.",
            confirmText: "확인",
            cancelText: "",
          });
        },
        onError: (error) => {
          const errorMessage = isApiErrorResponse(error)
            ? error.error.message
            : "장바구니에 추가하는 중 오류가 발생했습니다.";

          confirm({
            title: "오류",
            message: errorMessage,
            confirmText: "확인",
            cancelText: "",
            variant: "danger",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-neutral-1">
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="animate-pulse">
            <div className="h-96 bg-neutral-10 rounded-lg mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <div className="h-8 bg-neutral-10 rounded w-3/4" />
                <div className="h-4 bg-neutral-10 rounded w-full" />
                <div className="h-4 bg-neutral-10 rounded w-5/6" />
              </div>
              <div className="lg:col-span-4">
                <div className="h-64 bg-neutral-10 rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-10 border border-red-40 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-60 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-bold text-red-80 mb-2">
              코스를 불러오는 중 오류가 발생했습니다
            </h2>
            <p className="text-red-60 text-sm">잠시 후 다시 시도해주세요</p>
          </div>
        )}

        {/* Course Content */}
        {course && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Thumbnail */}
              <CourseThumbnail
                thumbnailUrl={course.thumbnailUrl}
                title={course.title}
              />

              {/* Header */}
              <CourseHeader
                title={course.title}
                description={course.description}
                level={course.level}
              />

              {/* Curriculum */}
              <CourseCurriculum
                sections={course.sections}
                lectures={course.lectures}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4">
              <CourseSidebar
                price={course.price}
                level={course.level}
                sections={course.sections}
                lectures={course.lectures}
                onAddToCart={handleAddToCart}
                isAddingToCart={addToCart.isPending}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
