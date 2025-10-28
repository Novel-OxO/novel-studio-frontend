import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions/api";
import type { UpdateQuestionRequest } from "@/lib/api/questions/types";

/**
 * React Query mutation hook for updating a question
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const updateQuestion = useUpdateQuestion();
 *
 * const handleUpdate = (questionId: string, updates: UpdateQuestionRequest) => {
 *   updateQuestion.mutate(
 *     { questionId, updates },
 *     {
 *       onSuccess: () => {
 *         console.log('Question updated successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to update question', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      updates,
    }: {
      questionId: string;
      updates: UpdateQuestionRequest;
    }) => questionsApi.questions.update(questionId, updates),
    onSuccess: (data) => {
      // Invalidate both the specific question and the list
      queryClient.invalidateQueries({
        queryKey: ["questions", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["questions", data.courseId],
      });
    },
  });
};
