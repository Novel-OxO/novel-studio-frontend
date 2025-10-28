"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { enrollmentsApi } from "@/lib/api/enrollments/api";
import { useQuestions } from "@/hooks/api/useQuestions";
import { useCreateQuestion } from "@/hooks/api/useCreateQuestion";
import { useState } from "react";
import Link from "next/link";

export default function QnaPage() {
  const params = useParams();
  const enrollmentId = params.enrollmentId as string;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");

  // Fetch enrolled course detail to get courseId
  const { data: courseDetail, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["enrolled-course", enrollmentId],
    queryFn: () => enrollmentsApi.getCourseDetail(enrollmentId),
  });

  const courseId = courseDetail?.enrollment.courseId || "";

  // Fetch questions
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useQuestions(courseId, { page: 1, pageSize: 20 });

  // Create question mutation
  const createQuestion = useCreateQuestion();

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId || !questionTitle.trim() || !questionContent.trim()) {
      return;
    }

    createQuestion.mutate(
      {
        courseId,
        data: {
          title: questionTitle,
          content: questionContent,
        },
      },
      {
        onSuccess: () => {
          setQuestionTitle("");
          setQuestionContent("");
          setShowCreateForm(false);
        },
        onError: (error) => {
          console.error("Failed to create question:", error);
          alert("질문 작성에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  if (isLoadingCourse) {
    return (
      <div className="min-h-screen bg-neutral-1 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!courseDetail) {
    return (
      <div className="min-h-screen bg-neutral-1 flex items-center justify-center">
        <div className="text-lg">강의를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const isLoading = isLoadingQuestions;
  const questions = questionsData?.items || [];
  const pagination = questionsData?.pagination;

  return (
    <div className="min-h-screen bg-neutral-1">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-neutral-60 mb-4">
            <Link
              href={`/learn/${enrollmentId}`}
              className="hover:text-neutral-80"
            >
              강의로 돌아가기
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-95 mb-2">
            질문 & 답변
          </h1>
          <p className="text-neutral-70">{courseDetail.title}</p>
        </div>

        {/* Create Question Button */}
        <div className="mb-6">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-3 bg-mint-40 text-white rounded-lg hover:bg-mint-50 font-medium transition-colors"
            >
              + 새 질문 작성하기
            </button>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-20 p-6">
              <h2 className="text-xl font-bold text-neutral-95 mb-4">
                새 질문 작성
              </h2>
              <form onSubmit={handleSubmitQuestion}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-neutral-80 mb-2"
                  >
                    제목
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    placeholder="질문 제목을 입력하세요"
                    className="w-full px-4 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-neutral-80 mb-2"
                  >
                    내용
                  </label>
                  <textarea
                    id="content"
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                    placeholder="질문 내용을 입력하세요"
                    rows={6}
                    className="w-full px-4 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40 resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={createQuestion.isPending}
                    className="flex-1 py-2 bg-mint-40 text-white rounded-lg hover:bg-mint-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {createQuestion.isPending ? "작성 중..." : "질문 등록"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setQuestionTitle("");
                      setQuestionContent("");
                    }}
                    className="px-6 py-2 bg-neutral-20 text-neutral-80 rounded-lg hover:bg-neutral-30 font-medium transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-8 text-neutral-60">
              질문을 불러오는 중...
            </div>
          )}

          {questionsError && (
            <div className="bg-red-10 border border-red-40 rounded-lg p-6 text-center">
              <p className="text-red-80">
                질문을 불러오는 중 오류가 발생했습니다.
              </p>
            </div>
          )}

          {!isLoading && !questionsError && questions.length === 0 && (
            <div className="bg-white rounded-lg border border-neutral-20 p-12 text-center">
              <p className="text-neutral-60 mb-2">아직 질문이 없습니다.</p>
              <p className="text-sm text-neutral-50">
                첫 번째 질문을 작성해보세요!
              </p>
            </div>
          )}

          {!isLoading &&
            !questionsError &&
            questions.map((question) => (
              <Link
                key={question.id}
                href={`/learn/${enrollmentId}/qna/${question.id}`}
                className="block bg-white rounded-lg border border-neutral-20 p-6 hover:border-mint-40 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-bold text-neutral-95 mb-2">
                  {question.title}
                </h3>
                <p className="text-neutral-70 text-sm mb-4 line-clamp-2">
                  {question.content}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-50">
                  <span>
                    작성일:{" "}
                    {new Date(question.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                  {question.updatedAt !== question.createdAt && (
                    <span>
                      수정일:{" "}
                      {new Date(question.updatedAt).toLocaleDateString("ko-KR")}
                    </span>
                  )}
                </div>
              </Link>
            ))}
        </div>

        {/* Pagination Info */}
        {pagination && pagination.totalCount > 0 && (
          <div className="mt-8 text-center text-sm text-neutral-60">
            총 {pagination.totalCount}개의 질문
          </div>
        )}
      </div>
    </div>
  );
}
