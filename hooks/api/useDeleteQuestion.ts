import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions/api";

/**
 * React Query mutation hook for deleting a question
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const deleteQuestion = useDeleteQuestion();
 *
 * const handleDelete = (questionId: string, courseId: string) => {
 *   deleteQuestion.mutate(
 *     { questionId, courseId },
 *     {
 *       onSuccess: () => {
 *         console.log('Question deleted successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to delete question', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
    }: {
      questionId: string;
      courseId: string;
    }) => questionsApi.questions.delete(questionId),
    onSuccess: (_, variables) => {
      // Invalidate questions list to refetch
      queryClient.invalidateQueries({
        queryKey: ["questions", variables.courseId],
      });
      // Remove the deleted question from cache
      queryClient.removeQueries({
        queryKey: ["questions", variables.questionId],
      });
    },
  });
};
