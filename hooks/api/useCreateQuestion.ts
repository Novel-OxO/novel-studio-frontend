import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "@/lib/api/questions/api";
import type { CreateQuestionRequest } from "@/lib/api/questions/types";

/**
 * React Query mutation hook for creating a question
 *
 * @returns Mutation object with mutate function and state
 *
 * @example
 * ```tsx
 * const createQuestion = useCreateQuestion();
 *
 * const handleSubmit = (data: CreateQuestionRequest) => {
 *   createQuestion.mutate(
 *     { courseId: 'course_id', data },
 *     {
 *       onSuccess: () => {
 *         console.log('Question created successfully');
 *       },
 *       onError: (error) => {
 *         console.error('Failed to create question', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: CreateQuestionRequest;
    }) => questionsApi.questions.create(courseId, data),
    onSuccess: (_, variables) => {
      // Invalidate questions list to refetch
      queryClient.invalidateQueries({
        queryKey: ["questions", variables.courseId],
      });
    },
  });
};
