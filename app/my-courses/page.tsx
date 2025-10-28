"use client";

import { useEnrollments } from "@/hooks/api/useEnrollments";
import { EnrolledCourseCard } from "@/components/enrollments/EnrolledCourseCard";

export default function MyCoursesPage() {
  const { data: enrollments, isLoading, error } = useEnrollments();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-80 mb-8">
            수강 중인 강의
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-neutral-5 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-video bg-neutral-10" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-neutral-10 rounded" />
                  <div className="h-4 bg-neutral-10 rounded w-3/4" />
                  <div className="h-2 bg-neutral-10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-80 mb-8">
            수강 중인 강의
          </h1>
          <div className="bg-red-5 border border-red-20 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-50 mx-auto mb-3"
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
            <p className="text-red-80 font-medium">
              강의 목록을 불러오는데 실패했습니다.
            </p>
            <p className="text-red-60 text-sm mt-2">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-80 mb-8">
            수강 중인 강의
          </h1>
          <div className="bg-neutral-5 rounded-lg p-12 text-center">
            <svg
              className="w-20 h-20 text-neutral-40 mx-auto mb-4"
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
            <h2 className="text-xl font-bold text-neutral-60 mb-2">
              수강 중인 강의가 없습니다
            </h2>
            <p className="text-neutral-60 mb-6">
              새로운 강의를 구매하고 학습을 시작해보세요!
            </p>
            <a
              href="/courses"
              className="inline-block bg-mint-50 text-white px-6 py-3 rounded-lg font-bold hover:bg-mint-60 transition-colors"
            >
              강의 둘러보기
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(
    ({ enrollment }) => enrollment.isCompleted
  ).length;
  const inProgressCourses = totalCourses - completedCourses;
  const averageProgress =
    enrollments.reduce(
      (sum, { enrollment }) => sum + enrollment.progress,
      0
    ) / totalCourses;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-80 mb-8">
          수강 중인 강의
        </h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-neutral-10 p-4">
            <div className="text-sm text-neutral-60 mb-1">전체 강의</div>
            <div className="text-2xl font-bold text-neutral-80">
              {totalCourses}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-10 p-4">
            <div className="text-sm text-neutral-60 mb-1">수강 중</div>
            <div className="text-2xl font-bold text-mint-50">
              {inProgressCourses}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-10 p-4">
            <div className="text-sm text-neutral-60 mb-1">완료</div>
            <div className="text-2xl font-bold text-green-50">
              {completedCourses}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-neutral-10 p-4">
            <div className="text-sm text-neutral-60 mb-1">평균 진행률</div>
            <div className="text-2xl font-bold text-neutral-80">
              {Math.round(averageProgress)}%
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollmentWithCourse) => (
            <EnrolledCourseCard
              key={enrollmentWithCourse.enrollment.id}
              enrollmentWithCourse={enrollmentWithCourse}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
