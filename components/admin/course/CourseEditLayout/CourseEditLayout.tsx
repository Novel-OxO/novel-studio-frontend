import type { CourseEditLayoutProps } from "./types";

export const CourseEditLayout: React.FC<CourseEditLayoutProps> = ({
  navigation,
  content,
}) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 좌측 스텝 네비게이션 */}
      <div className="col-span-3">{navigation}</div>

      {/* 우측 컨텐츠 영역 */}
      <div className="col-span-9">{content}</div>
    </div>
  );
};
