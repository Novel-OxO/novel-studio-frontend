"use client";

import { useState } from "react";
import type { CourseSection, CourseLecture } from "@/lib/api/courses/types";

interface CourseCurriculumProps {
  sections?: CourseSection[];
  lectures?: CourseLecture[];
}

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  sections = [],
  lectures = [],
}) => {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.length > 0 ? [sections[0].id] : [])
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getSectionLectures = (sectionId: string) => {
    return lectures
      .filter((lecture) => lecture.sectionId === sectionId)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-10 overflow-hidden">
      <div className="p-4 border-b border-neutral-10 bg-neutral-1">
        <h2 className="text-xl font-bold text-neutral-80">커리큘럼</h2>
      </div>

      <div className="divide-y divide-neutral-10">
        {sections.map((section) => {
          const sectionLectures = getSectionLectures(section.id);
          const isOpen = openSections.has(section.id);

          return (
            <div key={section.id}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-neutral-1 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-5 h-5 text-neutral-60 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span className="font-semibold text-neutral-80 text-left">
                    {section.title}
                  </span>
                </div>
                <span className="text-sm text-neutral-60">
                  {sectionLectures.length}개 강의
                </span>
              </button>

              {/* Lectures */}
              {isOpen && (
                <div className="bg-neutral-1">
                  {sectionLectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className={`px-4 py-3 flex items-center justify-between hover:bg-neutral-3 transition-colors ml-8 ${
                        lecture.isPreview ? "cursor-pointer" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* TODO: 미리보기 강의 아이콘 lucide-react */}
                        <svg
                          className="w-5 h-5 text-neutral-40"
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
                        <span className="text-sm text-neutral-70">
                          {lecture.title}
                        </span>
                        {lecture.isPreview && (
                          <span className="px-2 py-0.5 text-xs font-medium text-mint-50 bg-mint-10 rounded">
                            미리보기
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-neutral-60">
                        {formatDuration(lecture.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
