import { useQuery } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions/api";

/**
 * React Query hook for fetching answers by question
 *
 * @param questionId - Question ID
 * @returns Query result with answers data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAnswers('question_id');
 * ```
 */
export const useAnswers = (questionId: string) => {
  return useQuery({
    queryKey: ["answers", questionId],
    queryFn: () => questionsApi.answers.getByQuestion(questionId),
    enabled: !!questionId,
  });
};
