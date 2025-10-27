import { Button } from "@/components/common/Button/Button";
import { useLectureMutations } from "@/hooks/admin/course/useLectureMutations";
import { LectureItem } from "./LectureItem";
import type { LectureListProps } from "./types";

export const LectureList: React.FC<LectureListProps> = ({
  sectionId,
  lectures,
  courseId,
}) => {
  const { createMutation, handleCreate } = useLectureMutations(courseId);

  return (
    <div className="ml-8 mt-4 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-neutral-80">강의 목록</h4>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleCreate(sectionId, lectures.length)}
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
  );
};
