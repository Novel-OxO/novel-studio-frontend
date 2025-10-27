import type { Section } from "@/lib/api/sections/types";
import type { Lecture } from "@/lib/api/lectures/types";

export interface SectionManagerProps {
  courseId: string;
  sections: Section[];
  lectures: Lecture[];
}

export interface SectionItemProps {
  section: Section;
  lectures: Lecture[];
  courseId: string;
}

export interface LectureListProps {
  sectionId: string;
  lectures: Lecture[];
  courseId: string;
}

export interface LectureItemProps {
  lecture: Lecture;
  courseId: string;
}
