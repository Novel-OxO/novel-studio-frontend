"use client";

import { useCourses } from "@/hooks/api/useCourses";
import { CourseCard } from "@/components/course/CourseCard";

export default function Home() {
  const { data, isLoading, error } = useCourses({
    page: 1,
    pageSize: 12,
  });

  return (
    <div className="min-h-screen bg-neutral-1">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-80 mb-2">
            코스 둘러보기
          </h1>
          <p className="text-neutral-60 text-sm md:text-base">
            다양한 코스를 탐색하고 학습을 시작하세요
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-neutral-10 overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-video bg-neutral-10" />
                <div className="p-4">
                  <div className="h-6 bg-neutral-10 rounded mb-2" />
                  <div className="h-4 bg-neutral-10 rounded mb-4" />
                  <div className="flex gap-2 mb-3">
                    <div className="h-6 w-12 bg-neutral-10 rounded" />
                    <div className="h-6 w-16 bg-neutral-10 rounded" />
                  </div>
                  <div className="h-7 bg-neutral-10 rounded w-24" />
                </div>
              </div>
            ))}
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

        {/* Empty State */}
        {!isLoading && !error && data?.items.length === 0 && (
          <div className="bg-white border border-neutral-10 rounded-lg p-12 text-center">
            <svg
              className="w-16 h-16 text-neutral-40 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h2 className="text-xl font-bold text-neutral-80 mb-2">
              등록된 코스가 없습니다
            </h2>
            <p className="text-neutral-60">
              곧 새로운 코스가 업데이트될 예정입니다
            </p>
          </div>
        )}

        {/* Course Grid */}
        {!isLoading && !error && data && data.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
