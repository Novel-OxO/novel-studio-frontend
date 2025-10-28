import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions/api";
import type { UpdateAnswerRequest } from "@/lib/api/questions/types";

/**
 * React Query mutation hook for updating an answer
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const updateAnswer = useUpdateAnswer();
 *
 * const handleUpdate = (answerId: string, questionId: string, updates: UpdateAnswerRequest) => {
 *   updateAnswer.mutate(
 *     { answerId, questionId, updates },
 *     {
 *       onSuccess: () => {
 *         console.log('Answer updated successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to update answer', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      answerId,
      updates,
    }: {
      answerId: string;
      questionId: string;
      updates: UpdateAnswerRequest;
    }) => questionsApi.answers.update(answerId, updates),
    onSuccess: (data, variables) => {
      // Invalidate answers list to refetch
      queryClient.invalidateQueries({
        queryKey: ["answers", variables.questionId],
      });
    },
  });
};
