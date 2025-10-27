"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authApi } from "@/lib/api/auth/api";
import type { SignInRequest } from "@/lib/api/auth/types";
import type { ApiErrorResponse } from "@/lib/api/common/types";
import { signinSchema, type SigninFormData } from "@/lib/validations/auth";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";

export const SigninForm: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const { mutate: signin, isPending } = useMutation({
    mutationFn: async (data: SigninFormData) => {
      const request: SignInRequest = {
        email: data.email,
        password: data.password,
      };
      return authApi.signIn(request);
    },
    onSuccess: () => {
      // authApi.signIn()에서 자동으로 토큰 저장됨
      // React Query 캐시 무효화하여 사용자 정보 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // 로그인 성공 시 홈 페이지로 이동
      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse> | ApiErrorResponse) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 401) {
          setServerError("이메일 또는 비밀번호가 올바르지 않습니다");
        } else if (errorData && "error" in errorData) {
          setServerError(errorData.error.message);
        } else {
          setServerError("로그인 중 오류가 발생했습니다");
        }
      } else {
        setServerError(
          error.error?.message || "로그인 중 오류가 발생했습니다"
        );
      }
    },
  });

  const onSubmit = (data: SigninFormData) => {
    setServerError("");
    signin(data);
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

      {/* 비밀번호 입력 */}
      <Input
        label="비밀번호"
        id="password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        error={errors.password?.message}
        disabled={isLoading}
        {...register("password")}
      />

      {/* 서버 에러 메시지 */}
      <ErrorMessage message={serverError} />

      {/* 로그인 버튼 */}
      <Button type="submit" variant="black" fullWidth isLoading={isLoading}>
        로그인
      </Button>

      {/* 회원가입 페이지 링크 */}
      <p className="text-center text-sm text-neutral-50">
        계정이 없으신가요?{" "}
        <a
          href="/signup"
          className="text-mint-40 hover:text-mint-50 font-medium underline"
        >
          회원가입
        </a>
      </p>
    </form>
  );
};
