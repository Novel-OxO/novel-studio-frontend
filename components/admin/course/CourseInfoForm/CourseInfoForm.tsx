import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/lib/api/courses/api";
import { CourseLevel, CourseStatus } from "@/lib/api/common/types";
import type { UpdateCourseRequest } from "@/lib/api/courses/types";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";
import { ImageUpload } from "@/components/common/ImageUpload/ImageUpload";
import { Select } from "@/components/common/Select/Select";
import type { SelectOption } from "@/components/common/Select/types";
import { Button } from "@/components/common/Button/Button";
import { RichTextEditor } from "@/components/common/RichTextEditor/RichTextEditor";
import { useConfirm } from "@/hooks/useConfirm";
import type { CourseInfoFormProps } from "./types";

// Select 옵션 정의
const levelOptions: SelectOption[] = [
  { value: CourseLevel.BEGINNER, label: "초급" },
  { value: CourseLevel.INTERMEDIATE, label: "중급" },
  { value: CourseLevel.ADVANCED, label: "고급" },
];

const statusOptions: SelectOption[] = [
  { value: CourseStatus.DRAFT, label: "초안" },
  { value: CourseStatus.PUBLISHED, label: "게시됨" },
  { value: CourseStatus.ARCHIVED, label: "보관됨" },
];

export const CourseInfoForm: React.FC<CourseInfoFormProps> = ({
  courseId,
  initialData,
}) => {
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();
  const [formData, setFormData] = useState<UpdateCourseRequest>({
    slug: initialData.slug,
    title: initialData.title,
    description: initialData.description,
    thumbnailUrl: initialData.thumbnailUrl || "",
    price: initialData.price,
    level: initialData.level,
    status: initialData.status,
  });
  const [error, setError] = useState<string>("");

  const updateCourseMutation = useMutation({
    mutationFn: (data: UpdateCourseRequest) =>
      coursesApi.update(courseId, data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setError("");
      await confirm({
        title: "저장 완료",
        message: "코스 정보가 성공적으로 수정되었습니다.",
        confirmText: "확인",
        cancelText: "",
      });
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(
        apiError.response?.data?.error?.message || "코스 수정에 실패했습니다."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 필수 필드 검증
    if (!formData.slug?.trim()) {
      setError("슬러그를 입력해주세요.");
      return;
    }
    if (!formData.title?.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!formData.description?.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    updateCourseMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-80 p-6">
      <h2 className="text-xl font-bold text-neutral-95 mb-6">코스 기본 정보</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <ErrorMessage message={error} />}

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-neutral-95 mb-2"
          >
            슬러그 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
            placeholder="nestjs-fundamentals"
            required
          />
          <p className="text-xs text-neutral-40 mt-1">
            URL에 사용될 고유 식별자 (영문, 숫자, 하이픈만 사용)
          </p>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-neutral-95 mb-2"
          >
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
            placeholder="NestJS 기초부터 심화까지"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-95 mb-2">
            설명 <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={formData.description || ""}
            onChange={(html) =>
              setFormData((prev) => ({ ...prev, description: html }))
            }
            placeholder="이 코스에서 배울 내용을 설명해주세요..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-95 mb-2">
            썸네일 이미지
          </label>
          <ImageUpload
            variant="thumbnail"
            value={formData.thumbnailUrl || null}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, thumbnailUrl: url || "" }))
            }
            onError={setError}
            maxSizeInMB={10}
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-neutral-95 mb-2"
          >
            가격 (원)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-neutral-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
            placeholder="50000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-95 mb-2">
            난이도
          </label>
          <Select
            id="level"
            name="level"
            value={formData.level as string}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                level: value as CourseLevel,
              }))
            }
            options={levelOptions}
            placeholder="난이도를 선택하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-95 mb-2">
            상태
          </label>
          <Select
            id="status"
            name="status"
            value={formData.status as string}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                status: value as CourseStatus,
              }))
            }
            options={statusOptions}
            placeholder="상태를 선택하세요"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="black"
            size="sm"
            disabled={updateCourseMutation.isPending}
            isLoading={updateCourseMutation.isPending}
            fullWidth
          >
            저장
          </Button>
        </div>
      </form>
    </div>
  );
};
