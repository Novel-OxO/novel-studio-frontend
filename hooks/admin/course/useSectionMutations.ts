import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionsApi } from "@/lib/api/sections/api";
import type { Section } from "@/lib/api/sections/types";
import { useState } from "react";
import { usePrompt } from "@/hooks/usePrompt";

export const useSectionMutations = (courseId: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");
  const { prompt } = usePrompt();

  const createMutation = useMutation({
    mutationFn: (data: { title: string; order: number }) =>
      sectionsApi.create(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setError("");
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(
        apiError.response?.data?.error?.message ||
          "섹션 생성에 실패했습니다."
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string;
      data: { title?: string; order?: number };
    }) => sectionsApi.update(courseId, sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setError("");
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(
        apiError.response?.data?.error?.message ||
          "섹션 수정에 실패했습니다."
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (sectionId: string) =>
      sectionsApi.delete(courseId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setError("");
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(
        apiError.response?.data?.error?.message ||
          "섹션 삭제에 실패했습니다."
      );
    },
  });

  const handleCreate = async (sectionsCount: number) => {
    const title = await prompt({
      title: "섹션 추가",
      message: "섹션 제목을 입력하세요:",
      placeholder: "예: Chapter 1",
      confirmText: "추가",
      cancelText: "취소",
    });
    if (!title) return;

    const order = sectionsCount;
    createMutation.mutate({ title, order });
  };

  const handleUpdate = async (section: Section) => {
    const title = await prompt({
      title: "섹션 수정",
      message: "섹션 제목을 수정하세요:",
      placeholder: section.title,
      defaultValue: section.title,
      confirmText: "수정",
      cancelText: "취소",
    });
    if (!title || title === section.title) return;

    updateMutation.mutate({
      sectionId: section.id,
      data: { title },
    });
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    handleCreate,
    handleUpdate,
    error,
    setError,
  };
};
