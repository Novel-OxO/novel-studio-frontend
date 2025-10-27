import { useState } from "react";
import { useConfirm } from "@/hooks/useConfirm";
import { useSectionMutations } from "@/hooks/admin/course/useSectionMutations";
import { LectureList } from "./LectureList";
import type { SectionItemProps } from "./types";

export const SectionItem: React.FC<SectionItemProps> = ({
  section,
  lectures,
  courseId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { confirm } = useConfirm();
  const { deleteMutation, handleUpdate } = useSectionMutations(courseId);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "섹션 삭제",
      message: `"${section.title}" 섹션을 삭제하시겠습니까?\n섹션 내의 모든 강의도 함께 삭제됩니다.`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
    });

    if (confirmed) {
      deleteMutation.mutate(section.id);
    }
  };

  return (
    <div className="border border-neutral-80 rounded-lg p-4">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-neutral-95 hover:text-neutral-80"
          >
            {isExpanded ? "▼" : "▶"}
          </button>
          <h3 className="text-lg font-bold text-neutral-95">{section.title}</h3>
          <span className="text-sm text-neutral-40">
            ({lectures.length}개 강의)
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(section)}
            className="px-3 py-1 text-sm bg-white text-neutral-95 border border-neutral-95 rounded cursor-pointer"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-white text-red-500 border border-red-500 rounded cursor-pointer"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 강의 목록 */}
      {isExpanded && (
        <LectureList
          sectionId={section.id}
          lectures={lectures}
          courseId={courseId}
        />
      )}
    </div>
  );
};
