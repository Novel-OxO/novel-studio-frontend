import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions/api";

/**
 * React Query mutation hook for deleting an answer
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const deleteAnswer = useDeleteAnswer();
 *
 * const handleDelete = (answerId: string, questionId: string) => {
 *   deleteAnswer.mutate(
 *     { answerId, questionId },
 *     {
 *       onSuccess: () => {
 *         console.log('Answer deleted successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to delete answer', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      answerId,
    }: {
      answerId: string;
      questionId: string;
    }) => questionsApi.answers.delete(answerId),
    onSuccess: (_, variables) => {
      // Invalidate answers list to refetch
      queryClient.invalidateQueries({
        queryKey: ["answers", variables.questionId],
      });
    },
  });
};
