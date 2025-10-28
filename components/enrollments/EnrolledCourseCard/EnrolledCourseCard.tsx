"use client";

import Image from "next/image";
import Link from "next/link";
import type { EnrollmentWithCourse } from "@/lib/api/enrollments/types";

interface EnrolledCourseCardProps {
  enrollmentWithCourse: EnrollmentWithCourse;
}

export const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({
  enrollmentWithCourse,
}) => {
  const { enrollment, course } = enrollmentWithCourse;

  // Format last accessed date
  const formatLastAccessed = (date: string | null) => {
    if (!date) return "아직 수강하지 않음";

    const lastAccessed = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - lastAccessed.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "오늘";
    if (diffInDays === 1) return "어제";
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
    return lastAccessed.toLocaleDateString("ko-KR");
  };

  return (
    <Link
      href={`/learn/${enrollment.id}`}
      className="block bg-white rounded-lg border border-neutral-10 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-neutral-5">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-40">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Completion Badge */}
        {enrollment.isCompleted && (
          <div className="absolute top-3 right-3 bg-mint-50 text-white px-3 py-1 rounded-full text-sm font-bold">
            완료
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-neutral-80 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-neutral-60">진행률</span>
            <span className="text-sm font-bold text-mint-50">
              {enrollment.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-5 rounded-full overflow-hidden">
            <div
              className="h-full bg-mint-50 transition-all duration-300"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>

        {/* Last Accessed */}
        <div className="flex items-center gap-2 text-sm text-neutral-60">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatLastAccessed(enrollment.lastAccessedAt)}</span>
        </div>
      </div>
    </Link>
  );
};
