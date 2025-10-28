"use client";

import { CourseLevel } from "@/lib/api/common/types";

interface CourseHeaderProps {
  title: string;
  description: string;
  level: CourseLevel;
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

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  description,
  level,
}) => {
  const levelLabel = getLevelLabel(level);

  return (
    <div className="mb-8">
      <div className="mb-3">
        <span className="inline-flex items-center px-3 py-1 rounded text-sm font-medium text-yellow-1 bg-yellow-bg-1">
          {levelLabel}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-80 mb-4">
        {title}
      </h1>
      <p className="text-neutral-60 text-base md:text-lg leading-relaxed">
        {stripHtmlTags(description)}
      </p>
    </div>
  );
};
