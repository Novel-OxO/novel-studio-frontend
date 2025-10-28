"use client";

import { formatPrice } from "@/lib/utils/format/price";
import { CourseLevel } from "@/lib/api/common/types";
import type { CourseSection, CourseLecture } from "@/lib/api/courses/types";

interface CourseSidebarProps {
  price: number;
  level: CourseLevel;
  sections?: CourseSection[];
  lectures?: CourseLecture[];
  onAddToCart: () => void;
  isAddingToCart?: boolean;
}

const getLevelLabel = (level: CourseLevel): string => {
  switch (level) {
    case CourseLevel.BEGINNER:
      return "초급";
    case CourseLevel.INTERMEDIATE:
      return "중급";
    case CourseLevel.ADVANCED:
      return "고급";
    default:
      return "알 수 없음";
  }
};

const calculateTotalDuration = (lectures: CourseLecture[]): string => {
  const totalSeconds = lectures.reduce(
    (acc, lecture) => acc + (lecture.duration || 0),
    0
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
};

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  price,
  level,
  sections = [],
  lectures = [],
  onAddToCart,
  isAddingToCart = false,
}) => {
  const levelLabel = getLevelLabel(level);
  const totalDuration = calculateTotalDuration(lectures);

  return (
    <div className="lg:sticky lg:top-4">
      <div className="bg-white rounded-lg border border-neutral-10 p-6 shadow-sm">
        {/* Price */}
        <div className="mb-6">
          <div className="text-3xl font-bold text-neutral-80">
            {formatPrice(price)}
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-neutral-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <div>
              <div className="text-sm text-neutral-60">난이도</div>
              <div className="font-semibold text-neutral-80">{levelLabel}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-neutral-60"
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
            <div>
              <div className="text-sm text-neutral-60">섹션 수</div>
              <div className="font-semibold text-neutral-80">
                {sections.length}개
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-neutral-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <div className="text-sm text-neutral-60">강의 수</div>
              <div className="font-semibold text-neutral-80">
                {lectures.length}개
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-neutral-60"
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
            <div>
              <div className="text-sm text-neutral-60">총 시간</div>
              <div className="font-semibold text-neutral-80">
                {totalDuration}
              </div>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-mint-50 hover:bg-mint-40 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isAddingToCart ? "추가 중..." : "장바구니에 담기"}
        </button>
      </div>
    </div>
  );
};
