import type { StepNavigationProps } from "./types";

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onStepChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-80 p-4 sticky top-8">
      <h3 className="text-sm font-bold text-neutral-95 mb-4">수정 단계</h3>
      <nav className="space-y-2">
        <button
          onClick={() => onStepChange("course-info")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            currentStep === "course-info"
              ? "bg-mint-40 text-white font-medium"
              : "bg-neutral-98 text-neutral-95 cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-neutral-95 text-xs font-bold">
              1
            </span>
            <span>코스 정보 관리</span>
          </div>
        </button>
        <button
          onClick={() => onStepChange("sections-lectures")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            currentStep === "sections-lectures"
              ? "bg-mint-40 text-white font-medium"
              : "bg-neutral-98 text-neutral-95 cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-neutral-95 text-xs font-bold">
              2
            </span>
            <span>섹션/강의 관리</span>
          </div>
        </button>
      </nav>
    </div>
  );
};
