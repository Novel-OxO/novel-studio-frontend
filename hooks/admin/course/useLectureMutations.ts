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
      duration?: number;
      isPreview?: boolean;
      sectionId: string;
      videoUrl?: string;
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
        duration?: number;
        isPreview?: boolean;
        videoUrl?: string;
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


  return {
    createMutation,
    updateMutation,
    deleteMutation,
    error,
    setError,
  };
};
