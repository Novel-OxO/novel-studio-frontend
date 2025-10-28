import { useQuery } from "@tanstack/react-query";
import { enrollmentsApi } from "@/lib/api/enrollments/api";

/**
 * React Query hook for fetching user's enrolled courses
 *
 * @returns Query result with enrolled courses list, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: enrollments, isLoading, error } = useEnrollments();
 *
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러 발생</div>;
 *
 * return (
 *   <div>
 *     {enrollments?.map(({ enrollment, course }) => (
 *       <div key={enrollment.id}>
 *         <h3>{course.title}</h3>
 *         <p>진행률: {enrollment.progress}%</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useEnrollments = () => {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: () => enrollmentsApi.list(),
  });
};
