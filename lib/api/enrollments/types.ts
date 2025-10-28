import type { ISODateString } from "../common/types";
import type { Course } from "../courses/types";

// ============================================
// Enrollment Types
// ============================================

/**
 * 수강 정보
 */
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: ISODateString;
  expiresAt: ISODateString | null;
  lastAccessedAt: ISODateString | null;
  progress: number;
  isCompleted: boolean;
  completedAt: ISODateString | null;
}

/**
 * 수강 중인 강의 정보 (강의 정보 포함)
 */
export interface EnrollmentWithCourse {
  enrollment: Enrollment;
  course: Course;
}

/**
 * 개별 강의(Lecture) 진행률
 */
export interface LectureProgress {
  id: string;
  enrollmentId: string;
  lectureId: string;
  watchTime: number;
  isCompleted: boolean;
  completedAt: ISODateString | null;
}

/**
 * 강의 상세 정보 (비디오 URL 포함)
 */
export interface EnrolledLecture {
  id: string;
  title: string;
  description: string | null;
  order: number;
  duration: number | null;
  videoUrl: string | null;
  isPreview: boolean;
  sectionId: string;
  progress: LectureProgress | null;
}

/**
 * 섹션 정보 (수강 중인 강의 전용)
 */
export interface EnrolledSection {
  id: string;
  title: string;
  order: number;
  lectures: EnrolledLecture[];
}

/**
 * 수강 중인 강의 상세 정보 (비디오 URL 포함)
 */
export interface EnrolledCourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  sections: EnrolledSection[];
  enrollment: Enrollment;
}

/**
 * 진행률 업데이트 요청
 */
export interface UpdateProgressRequest {
  lectureId: string;
  watchTime: number;
  isCompleted: boolean;
}

/**
 * 진행률 업데이트 응답
 */
export interface UpdateProgressResponse {
  lectureProgress: LectureProgress;
  enrollment: Enrollment;
}
