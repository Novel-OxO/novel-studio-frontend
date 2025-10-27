"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses/api";
import type { Course } from "@/lib/api/courses/types";
import { CourseLevel, CourseStatus } from "@/lib/api/common/types";
import { Button } from "@/components/common/Button/Button";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";
import { useState } from "react";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";

// 난이도 라벨 매핑
const levelLabels: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: "초급",
  [CourseLevel.INTERMEDIATE]: "중급",
  [CourseLevel.ADVANCED]: "고급",
};

// 상태 라벨 매핑
const statusLabels: Record<CourseStatus, string> = {
  [CourseStatus.DRAFT]: "초안",
  [CourseStatus.PUBLISHED]: "게시됨",
  [CourseStatus.ARCHIVED]: "보관됨",
};

// 상태별 스타일 매핑
const statusStyles: Record<CourseStatus, string> = {
  [CourseStatus.DRAFT]:
    "bg-[var(--color-yellow-bg-1)] text-[var(--color-yellow-1)]",
  [CourseStatus.PUBLISHED]: "bg-mint-90 text-mint-30",
  [CourseStatus.ARCHIVED]: "bg-neutral-80 text-neutral-20",
};

// 난이도별 스타일 매핑
const levelStyles: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]:
    "bg-[var(--color-blue-bg-1)] text-[var(--color-blue-1)]",
  [CourseLevel.INTERMEDIATE]:
    "bg-[var(--color-blue-bg-1)] text-[var(--color-blue-1)]",
  [CourseLevel.ADVANCED]:
    "bg-[var(--color-blue-bg-1)] text-[var(--color-blue-1)]",
};

export default function AdminCourseListPage() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesApi.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => coursesApi.delete(courseId),
    onSuccess: () => {
      // 코스 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      setDeleteError(
        apiError.response?.data?.error?.message || "코스 삭제에 실패했습니다."
      );
    },
  });

  const handleDelete = async (course: Course) => {
    const confirmed = await confirm({
      title: "코스 삭제",
      message: `"${course.title}" 코스를 삭제하시겠습니까?\n삭제된 코스는 복구할 수 없습니다.`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
    });

    if (confirmed) {
      setDeleteError("");
      deleteMutation.mutate(course.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-neutral-40">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">코스 목록을 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  const courses = data?.items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-95">코스 관리</h1>
        <Button
          variant="black"
          size="sm"
          onClick={() => router.push("/admin/course/new")}
        >
          코스 생성
        </Button>
      </div>

      {deleteError && (
        <div className="mb-4">
          <ErrorMessage message={deleteError} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-neutral-80 overflow-hidden">
        {courses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-40 mb-4">등록된 코스가 없습니다.</p>
            <Button
              variant="black"
              size="sm"
              onClick={() => router.push("/admin/course/new")}
            >
              첫 코스 만들기
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-98 border-b border-neutral-80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    썸네일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    슬러그
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    난이도
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    생성일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    수정
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-95 uppercase tracking-wider">
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-80">
                {courses.map((course: Course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-neutral-98 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-12 rounded overflow-hidden bg-neutral-90">
                        {course.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-40 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-95">
                        {course.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-40">
                        {course.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-95">
                        {course.price.toLocaleString()}원
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          levelStyles[course.level]
                        }`}
                      >
                        {levelLabels[course.level]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusStyles[course.status]
                        }`}
                      >
                        {statusLabels[course.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-40">
                      {new Date(course.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() =>
                          router.push(`/admin/course/${course.id}`)
                        }
                        className="px-3 py-1 text-sm bg-white text-neutral-95 border border-neutral-95 rounded cursor-pointer"
                      >
                        수정
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(course)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-1 text-sm bg-white text-red-500 border border-red-500 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
