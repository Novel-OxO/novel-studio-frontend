import { useState, useEffect } from "react";
import { Button } from "../Button/Button";
import type { PromptOptions } from "./types";

interface PromptProps extends PromptOptions {
  isOpen: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export const Prompt: React.FC<PromptProps> = ({
  isOpen,
  title = "입력",
  message,
  confirmText = "확인",
  cancelText = "취소",
  placeholder = "",
  defaultValue = "",
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(defaultValue);

  // Reset value when dialog opens
  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-transparent z-50" onClick={onCancel} />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-neutral-80 mb-4">{title}</h2>

          <p className="text-neutral-60 mb-4 whitespace-pre-line">{message}</p>

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
            className="w-full px-3 py-2 border border-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40 mb-6"
          />

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
              variant="primary"
              onClick={handleConfirm}
              size="sm"
              disabled={!value.trim()}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
