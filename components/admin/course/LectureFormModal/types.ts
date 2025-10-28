import type { Lecture } from "@/lib/api/lectures/types";

export interface LectureFormData {
  title: string;
  description?: string;
  duration?: number;
  isPreview?: boolean;
  videoUrl?: string;
}

export interface LectureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LectureFormData) => void;
  initialData?: Lecture;
  isLoading?: boolean;
  mode: "create" | "edit";
}
