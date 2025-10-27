export type Step = "course-info" | "sections-lectures";

export interface StepNavigationProps {
  currentStep: Step;
  onStepChange: (step: Step) => void;
}
