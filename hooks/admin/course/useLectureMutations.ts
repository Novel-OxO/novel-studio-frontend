import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lecturesApi } from "@/lib/api/lectures/api";
import type { Lecture } from "@/lib/api/lectures/types";
import { useState } from "react";

export const useLectureMutations = (courseId: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      order: number;
      sectionId: string;
    }) => lecturesApi.create(courseId, data),
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
          "강의 생성에 실패했습니다."
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      lectureId,
      data,
    }: {
      lectureId: string;
      data: {
        title?: string;
        description?: string;
        order?: number;
      };
    }) => lecturesApi.update(courseId, lectureId, data),
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
          "강의 수정에 실패했습니다."
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (lectureId: string) =>
      lecturesApi.delete(courseId, lectureId),
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
          "강의 삭제에 실패했습니다."
      );
    },
  });

  const handleCreate = async (sectionId: string, lecturesCount: number) => {
    const title = prompt("강의 제목을 입력하세요:");
    if (!title) return;

    const order = lecturesCount;
    createMutation.mutate({ title, order, sectionId });
  };

  const handleUpdate = async (lecture: Lecture) => {
    const title = prompt("강의 제목을 수정하세요:", lecture.title);
    if (!title || title === lecture.title) return;

    updateMutation.mutate({
      lectureId: lecture.id,
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
