import clsx from "clsx";
import type { ButtonProps } from "./types";

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const baseStyles =
    "rounded-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

  const variantStyles = {
    primary:
      "bg-mint-30 text-white hover:bg-mint-40 focus:ring-mint-40 disabled:bg-neutral-30 disabled:cursor-not-allowed",
    secondary:
      "bg-white text-neutral-80 border border-neutral-20 hover:bg-neutral-5 active:bg-neutral-10 focus:ring-neutral-40 disabled:bg-neutral-5 disabled:text-neutral-30 disabled:cursor-not-allowed",
    black:
      "bg-neutral-95 text-neutral-3 hover:bg-neutral-80 focus:ring-neutral-40 disabled:bg-neutral-50 disabled:cursor-not-allowed",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? "처리 중..." : children}
    </button>
  );
}
