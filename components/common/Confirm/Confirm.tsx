import { Button } from "../Button/Button";
import type { ButtonVariant } from "../Button/types";
import type { ConfirmOptions } from "./types";

interface ConfirmProps extends ConfirmOptions {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Confirm: React.FC<ConfirmProps> = ({
  isOpen,
  title = "확인",
  message,
  confirmText = "확인",
  cancelText = "취소",
  variant = "primary",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const buttonVariant: ButtonVariant =
    variant === "danger" ? "primary" : variant;

  return (
    <>
      <div className="fixed inset-0 bg-transparent z-50" onClick={onCancel} />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-neutral-80 mb-4">{title}</h2>

          <p className="text-neutral-60 mb-6 whitespace-pre-line">{message}</p>

          <div className="flex gap-3 justify-end">
            {cancelText && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                size="sm"
              >
                {cancelText}
              </Button>
            )}
            <Button
              type="button"
              variant={buttonVariant}
              onClick={onConfirm}
              size="sm"
              className={
                variant === "danger"
                  ? "!bg-red-50 !text-white hover:!bg-red-60 !border-0"
                  : ""
              }
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
