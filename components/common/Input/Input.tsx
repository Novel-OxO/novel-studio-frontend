import { forwardRef } from "react";
import clsx from "clsx";
import type { InputProps } from "./types";

/**
 * 재사용 가능한 Input 컴포넌트
 *
 * React Hook Form과 함께 사용하도록 설계됨
 * forwardRef를 사용하여 register() 함수와 호환
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, error, fullWidth = true, disabled, ...rest },
  ref
) {
  const hasError = !!error;

  return (
    <div className={clsx("flex flex-col gap-2", fullWidth && "w-full")}>
      <label htmlFor={id} className="text-sm font-bold text-neutral-70">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={clsx(
          "px-2 py-1 rounded-sm border",
          "bg-white text-neutral-80",
          "placeholder:text-neutral-30",
          "focus:outline-none focus:ring-2",
          "transition-colors",
          hasError
            ? "border-red-30 focus:ring-red-20"
            : "border-neutral-20 focus:ring-mint-40",
          disabled && "bg-neutral-5 cursor-not-allowed"
        )}
        disabled={disabled}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? `${id}-error` : undefined}
        {...rest}
      />
      {hasError && (
        <p id={`${id}-error`} className="text-sm text-red-50" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
