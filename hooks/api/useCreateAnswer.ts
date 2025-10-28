import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions/api";
import type { CreateAnswerRequest } from "@/lib/api/questions/types";

/**
 * React Query mutation hook for creating an answer
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const createAnswer = useCreateAnswer();
 *
 * const handleSubmit = (questionId: string, data: CreateAnswerRequest) => {
 *   createAnswer.mutate(
 *     { questionId, data },
 *     {
 *       onSuccess: () => {
 *         console.log('Answer created successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to create answer', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useCreateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: CreateAnswerRequest;
    }) => questionsApi.answers.create(questionId, data),
    onSuccess: (_, variables) => {
      // Invalidate answers list to refetch
      queryClient.invalidateQueries({
        queryKey: ["answers", variables.questionId],
      });
    },
  });
};
