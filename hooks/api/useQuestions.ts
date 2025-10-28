import { useQuery } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions/api";
import type { PaginationParams } from "@/lib/api/common/types";

/**
 * React Query hook for fetching questions by course
 *
 * @param courseId - Course ID
 * @param params - Pagination parameters
 * @returns Query result with questions data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useQuestions('course_id', {
 *   page: 1,
 *   pageSize: 10
 * });
 * ```
 */
export const useQuestions = (
  courseId: string,
  params?: PaginationParams
) => {
  return useQuery({
    queryKey: ["questions", courseId, params],
    queryFn: () => questionsApi.questions.getByCourse(courseId, params),
    enabled: !!courseId,
  });
};

/**
 * React Query hook for fetching a single question by ID
 *
 * @param questionId - Question ID
 * @returns Query result with question data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useQuestion('question_id');
 * ```
 */
export const useQuestion = (questionId: string) => {
  return useQuery({
    queryKey: ["questions", questionId],
    queryFn: () => questionsApi.questions.getById(questionId),
    enabled: !!questionId,
  });
};
