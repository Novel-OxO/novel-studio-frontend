"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { usersApi } from "@/lib/api/users/api";
import type { CreateUserRequest } from "@/lib/api/users/types";
import type { ApiErrorResponse } from "@/lib/api/common/types";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur", // 포커스 아웃 시 검증
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const request: CreateUserRequest = {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      };
      return usersApi.create(request);
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: AxiosError<ApiErrorResponse> | ApiErrorResponse) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 409) {
          setServerError("이미 사용 중인 이메일입니다");
        } else if (errorData && "error" in errorData) {
          setServerError(errorData.error.message);
        } else {
          setServerError("회원가입 중 오류가 발생했습니다");
        }
      } else {
        setServerError(
          error.error?.message || "회원가입 중 오류가 발생했습니다"
        );
      }
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setServerError("");
    signup(data);
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full max-w-md"
      noValidate
    >
      {/* 이메일 입력 */}
      <Input
        label="이메일"
        id="email"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        disabled={isLoading}
        {...register("email")}
      />

      {/* 닉네임 입력 */}
      <Input
        label="닉네임"
        id="nickname"
        type="text"
        placeholder="홍길동"
        error={errors.nickname?.message}
        disabled={isLoading}
        {...register("nickname")}
      />

      {/* 비밀번호 입력 */}
      <Input
        label="비밀번호"
        id="password"
        type="password"
        placeholder="영문, 숫자 조합 8자 이상"
        error={errors.password?.message}
        disabled={isLoading}
        {...register("password")}
      />

      {/* 비밀번호 확인 입력 */}
      <Input
        label="비밀번호 확인"
        id="passwordConfirm"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        error={errors.passwordConfirm?.message}
        disabled={isLoading}
        {...register("passwordConfirm")}
      />

      {/* 서버 에러 메시지 */}
      <ErrorMessage message={serverError} />

      {/* 회원가입 버튼 */}
      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        회원가입
      </Button>

      {/* 로그인 페이지 링크 */}
      <p className="text-center text-sm text-neutral-50">
        이미 계정이 있으신가요?{" "}
        <a
          href="/login"
          className="text-mint-40 hover:text-mint-50 font-medium underline"
        >
          로그인
        </a>
      </p>
    </form>
  );
};
