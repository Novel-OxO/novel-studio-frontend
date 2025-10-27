"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { z } from "zod";
import { usersApi } from "@/lib/api/users/api";
import type { UpdateUserRequest } from "@/lib/api/users/types";
import type { ApiErrorResponse } from "@/lib/api/common/types";
import { useAuth } from "@/hooks/useAuth";
import { useConfirm } from "@/hooks/useConfirm";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";
import { ImageUpload } from "@/components/common/ImageUpload/ImageUpload";
import { clearTokens } from "@/lib/token";

// Validation schema
const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다")
    .max(20, "닉네임은 최대 20자까지 가능합니다"),
  profileImageUrl: z.string().nullable().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { confirm } = useConfirm();
  const [serverError, setServerError] = useState<string>("");
  // undefined: 초기값 (user 이미지 사용), null: 삭제됨, string: 업로드된 이미지
  const [uploadedImage, setUploadedImage] = useState<string | null | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: "",
      profileImageUrl: null,
    },
  });

  // 현재 표시할 프로필 이미지 계산
  const currentProfileImage = useMemo(() => {
    // undefined면 user 이미지 사용, null이면 삭제된 상태, string이면 업로드된 이미지
    if (uploadedImage === undefined) {
      return user?.profileImageUrl ?? null;
    }
    return uploadedImage;
  }, [uploadedImage, user?.profileImageUrl]);

  // Update profile mutation
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const request: UpdateUserRequest = {
        nickname: data.nickname,
        profileImageUrl: data.profileImageUrl,
      };
      return usersApi.updateProfile(request);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await confirm({
        title: "프로필 수정 완료",
        message: "프로필 정보가 성공적으로 수정되었습니다.",
        confirmText: "확인",
        cancelText: "",
        variant: "primary",
      });
    },
    onError: (error: AxiosError<ApiErrorResponse> | ApiErrorResponse) => {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        if (errorData && "error" in errorData) {
          setServerError(errorData.error.message);
        } else {
          setServerError("프로필 업데이트 중 오류가 발생했습니다");
        }
      } else {
        setServerError(
          error.error?.message || "프로필 업데이트 중 오류가 발생했습니다"
        );
      }
    },
  });

  // Delete account mutation
  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return usersApi.deleteAccount();
    },
    onSuccess: () => {
      clearTokens();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse> | ApiErrorResponse) => {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        if (errorData && "error" in errorData) {
          setServerError(errorData.error.message);
        } else {
          setServerError("계정 삭제 중 오류가 발생했습니다");
        }
      } else {
        setServerError(
          error.error?.message || "계정 삭제 중 오류가 발생했습니다"
        );
      }
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    setServerError("");
    updateProfile(data);
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: "계정 삭제",
      message: "정말로 계정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
    });

    if (confirmed) {
      deleteAccount();
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/signin");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (user) {
      setValue("nickname", user.nickname);
      setValue("profileImageUrl", user.profileImageUrl);
    }
  }, [user, setValue]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-50">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isLoading = isSubmitting || isUpdating || isDeleting;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-neutral-80 mb-8">내 정보 관리</h1>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-10 p-8 mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-6 items-start">
            {/* 프로필 이미지 */}
            <div>
              <ImageUpload
                value={currentProfileImage}
                onChange={(url) => {
                  setValue("profileImageUrl", url);
                  setUploadedImage(url);
                }}
                onError={(error) => setServerError(error)}
                disabled={isLoading}
              />
            </div>

            <div className="flex-1 space-y-4">
              <Input
                label="이메일"
                id="email"
                type="email"
                value={user.email}
                disabled
                readOnly
              />

              <Input
                label="닉네임"
                id="nickname"
                type="text"
                placeholder="닉네임을 입력해주세요"
                error={errors.nickname?.message}
                disabled={isLoading}
                {...register("nickname")}
              />
            </div>
          </div>

          {/* 서버 에러 메시지 */}
          <ErrorMessage message={serverError} />

          {/* 저장 버튼 */}
          <Button
            type="submit"
            variant="black"
            fullWidth
            isLoading={isUpdating}
            disabled={isLoading}
          >
            프로필 저장
          </Button>

          {/* 계정 삭제 버튼 */}
          <Button
            type="button"
            variant="secondary"
            onClick={handleDeleteAccount}
            isLoading={isDeleting}
            disabled={isLoading}
            fullWidth
          >
            계정 삭제
          </Button>
        </form>
      </div>
    </div>
  );
}
