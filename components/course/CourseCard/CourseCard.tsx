"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format/price";
import { CourseLevel } from "@/lib/api/common/types";
import type { CourseCardProps } from "./types";

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

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const levelLabel = getLevelLabel(course.level);
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block bg-white rounded-lg border border-neutral-10 overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-neutral-5">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-neutral-80 mb-2 line-clamp-2 group-hover:text-mint-50 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-60 mb-4 line-clamp-2">
          {stripHtmlTags(course.description)}
        </p>

        {/* Level Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-yellow-1 bg-yellow-bg-1">
            {levelLabel}
          </span>
        </div>

        {/* Price */}
        <div className="text-xl font-bold text-neutral-95">
          {formatPrice(course.price)}
        </div>
      </div>
    </Link>
  );
};
