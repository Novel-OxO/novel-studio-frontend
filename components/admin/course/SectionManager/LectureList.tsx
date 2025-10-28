import { useState } from "react";
import { Button } from "@/components/common/Button/Button";
import { useLectureMutations } from "@/hooks/admin/course/useLectureMutations";
import { LectureFormModal } from "@/components/admin/course/LectureFormModal/LectureFormModal";
import { LectureItem } from "./LectureItem";
import type { LectureListProps } from "./types";
import type { LectureFormData } from "@/components/admin/course/LectureFormModal/types";

export const LectureList: React.FC<LectureListProps> = ({
  sectionId,
  lectures,
  courseId,
}) => {
  const { createMutation } = useLectureMutations(courseId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateSubmit = (data: LectureFormData) => {
    createMutation.mutate(
      {
        ...data,
        order: lectures.length,
        sectionId,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  return (
    <>
      <div className="ml-8 mt-4 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold text-neutral-80">강의 목록</h4>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={createMutation.isPending}
          >
            강의 추가
          </Button>
        </div>

        {lectures.length === 0 ? (
          <div className="text-center py-6 text-neutral-40 text-sm">
            강의가 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {lectures.map((lecture) => (
              <LectureItem
                key={lecture.id}
                lecture={lecture}
                courseId={courseId}
              />
            ))}
          </div>
        )}
      </div>

      <LectureFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
        mode="create"
      />
    </>
  );
};
