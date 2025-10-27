import { Button } from "@/components/common/Button/Button";
import { useSectionMutations } from "@/hooks/admin/course/useSectionMutations";
import { SectionItem } from "./SectionItem";
import type { SectionManagerProps } from "./types";

export const SectionManager: React.FC<SectionManagerProps> = ({
  courseId,
  sections,
  lectures,
}) => {
  const { createMutation, handleCreate } = useSectionMutations(courseId);

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-80 p-6">
      {/* 섹션 관리 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-95">섹션 관리</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleCreate(sections.length)}
          disabled={createMutation.isPending}
        >
          섹션 추가
        </Button>
      </div>

      {/* 섹션 목록 */}
      <div>
        {sections.length === 0 ? (
          <div className="text-center py-8 text-neutral-40">
            섹션이 없습니다. 섹션을 추가해주세요.
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => {
              const sectionLectures = lectures.filter(
                (l) => l.sectionId === section.id
              );
              return (
                <SectionItem
                  key={section.id}
                  section={section}
                  lectures={sectionLectures}
                  courseId={courseId}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
