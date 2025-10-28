import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses/api";
import type { GetCoursesParams } from "@/lib/api/courses/types";

/**
 * React Query hook for fetching courses list
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Query result with courses data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCourses({
 *   page: 1,
 *   pageSize: 12,
 *   status: CourseStatus.PUBLISHED
 * });
 * ```
 */
export const useCourses = (params?: GetCoursesParams) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => coursesApi.list(params),
  });
};
