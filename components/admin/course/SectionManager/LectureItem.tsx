import { useConfirm } from "@/hooks/useConfirm";
import { useLectureMutations } from "@/hooks/admin/course/useLectureMutations";
import type { LectureItemProps } from "./types";

export const LectureItem: React.FC<LectureItemProps> = ({
  lecture,
  courseId,
}) => {
  const { confirm } = useConfirm();
  const { deleteMutation, handleUpdate } = useLectureMutations(courseId);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "강의 삭제",
      message: `"${lecture.title}" 강의를 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
    });

    if (confirmed) {
      deleteMutation.mutate(lecture.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-neutral-98 rounded">
      <div>
        <p className="text-sm font-medium text-neutral-95">{lecture.title}</p>
        {lecture.description && (
          <p className="text-xs text-neutral-40 mt-1">{lecture.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleUpdate(lecture)}
          className="px-2 py-1 text-xs bg-white text-neutral-95 border border-neutral-95 rounded cursor-pointer"
        >
          수정
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs bg-white text-red-500 border border-red-500 rounded cursor-pointer"
        >
          삭제
        </button>
      </div>
    </div>
  );
};
