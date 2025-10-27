"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses/api";
import { Button } from "@/components/common/Button/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";
import { StepNavigation } from "@/components/admin/course/StepNavigation/StepNavigation";
import { CourseEditLayout } from "@/components/admin/course/CourseEditLayout/CourseEditLayout";
import { SectionManager } from "@/components/admin/course/SectionManager/SectionManager";
import { CourseInfoForm } from "@/components/admin/course/CourseInfoForm/CourseInfoForm";
import { useSectionMutations } from "@/hooks/admin/course/useSectionMutations";
import { useLectureMutations } from "@/hooks/admin/course/useLectureMutations";
import type { Step } from "@/components/admin/course/StepNavigation/types";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [currentStep, setCurrentStep] = useState<Step>("course-info");

  // 코스 상세 정보 조회 (섹션과 강의 포함)
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () =>
      coursesApi.getById(courseId, {
        includeSections: true,
        includeLectures: true,
      }),
  });

  // 에러 상태 관리
  const sectionMutations = useSectionMutations(courseId);
  const lectureMutations = useLectureMutations(courseId);

  const error = sectionMutations.error || lectureMutations.error;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-neutral-40">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">코스를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const sections = course.sections || [];
  const lectures = course.lectures || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-95 mb-2">
            코스 수정
          </h1>
          <p className="text-neutral-40">{course.title}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/admin/course/list")}
        >
          목록으로
        </Button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* 2단 그리드 레이아웃 */}
      <CourseEditLayout
        navigation={
          <StepNavigation
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        }
        content={
          currentStep === "course-info" ? (
            /* 1단계: 코스 정보 관리 */
            <CourseInfoForm courseId={courseId} initialData={course} />
          ) : (
            /* 2단계: 섹션/강의 관리 */
            <SectionManager
              courseId={courseId}
              sections={sections}
              lectures={lectures}
            />
          )
        }
      />
    </div>
  );
}
