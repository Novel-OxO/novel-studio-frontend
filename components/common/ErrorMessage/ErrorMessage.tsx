import clsx from "clsx";
import type { ErrorMessageProps } from "./types";

/**
 * 에러 메시지 컴포넌트
 *
 * 폼 검증이나 API 에러 등 다양한 에러 메시지를 표시하는 재사용 가능한 컴포넌트
 *
 * @example
 * ```tsx
 * <ErrorMessage message="이미 사용 중인 이메일입니다" />
 * ```
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
}) => {
  if (!message) return null;

  return (
    <p className={clsx("text-sm text-red-50", className)} role="alert">
      {message}
    </p>
  );
};
