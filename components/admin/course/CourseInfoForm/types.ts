import type { Course } from "@/lib/api/courses/types";

export interface CourseInfoFormProps {
  courseId: string;
  initialData: Course;
}
