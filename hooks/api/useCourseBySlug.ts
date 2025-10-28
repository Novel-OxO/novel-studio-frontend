import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses/api";

/**
 * React Query hook for fetching course details by slug
 *
 * @param slug - Course slug (unique identifier in URL)
 * @returns Query result with course details, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCourseBySlug('nestjs-fundamentals');
 * ```
 */
export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: () => coursesApi.getBySlug(slug),
    enabled: !!slug,
  });
};
