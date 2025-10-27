import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionsApi } from "@/lib/api/sections/api";
import type { Section } from "@/lib/api/sections/types";
import { useState } from "react";

export const useSectionMutations = (courseId: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");

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
    const title = prompt("섹션 제목을 입력하세요:");
    if (!title) return;

    const order = sectionsCount;
    createMutation.mutate({ title, order });
  };

  const handleUpdate = async (section: Section) => {
    const title = prompt("섹션 제목을 수정하세요:", section.title);
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
