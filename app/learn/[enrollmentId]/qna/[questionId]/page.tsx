"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuestion } from "@/hooks/api/useQuestions";
import { useAnswers } from "@/hooks/api/useAnswers";
import { useCreateAnswer } from "@/hooks/api/useCreateAnswer";
import { useUpdateQuestion } from "@/hooks/api/useUpdateQuestion";
import { useDeleteQuestion } from "@/hooks/api/useDeleteQuestion";
import { useUpdateAnswer } from "@/hooks/api/useUpdateAnswer";
import { useDeleteAnswer } from "@/hooks/api/useDeleteAnswer";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { enrollmentsApi } from "@/lib/api/enrollments/api";

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = params.enrollmentId as string;
  const questionId = params.questionId as string;

  const [answerContent, setAnswerContent] = useState("");
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editQuestionTitle, setEditQuestionTitle] = useState("");
  const [editQuestionContent, setEditQuestionContent] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editAnswerContent, setEditAnswerContent] = useState("");

  // Fetch enrolled course detail
  const { data: courseDetail } = useQuery({
    queryKey: ["enrolled-course", enrollmentId],
    queryFn: () => enrollmentsApi.getCourseDetail(enrollmentId),
  });

  // Fetch question
  const {
    data: question,
    isLoading: isLoadingQuestion,
    error: questionError,
  } = useQuestion(questionId);

  // Fetch answers
  const {
    data: answers,
    isLoading: isLoadingAnswers,
    error: answersError,
  } = useAnswers(questionId);

  // Mutations
  const createAnswer = useCreateAnswer();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();
  const updateAnswer = useUpdateAnswer();
  const deleteAnswer = useDeleteAnswer();

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerContent.trim()) return;

    createAnswer.mutate(
      {
        questionId,
        data: { content: answerContent },
      },
      {
        onSuccess: () => {
          setAnswerContent("");
        },
        onError: (error) => {
          console.error("Failed to create answer:", error);
          alert("답변 작성에 실패했습니다.");
        },
      }
    );
  };

  const handleEditQuestion = () => {
    if (question) {
      setEditQuestionTitle(question.title);
      setEditQuestionContent(question.content);
      setIsEditingQuestion(true);
    }
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editQuestionTitle.trim() || !editQuestionContent.trim()) return;

    updateQuestion.mutate(
      {
        questionId,
        updates: {
          title: editQuestionTitle,
          content: editQuestionContent,
        },
      },
      {
        onSuccess: () => {
          setIsEditingQuestion(false);
        },
        onError: (error) => {
          console.error("Failed to update question:", error);
          alert("질문 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleDeleteQuestion = async () => {
    if (!confirm("정말 이 질문을 삭제하시겠습니까?")) return;
    if (!question) return;

    deleteQuestion.mutate(
      {
        questionId,
        courseId: question.courseId,
      },
      {
        onSuccess: () => {
          router.push(`/learn/${enrollmentId}/qna`);
        },
        onError: (error) => {
          console.error("Failed to delete question:", error);
          alert("질문 삭제에 실패했습니다.");
        },
      }
    );
  };

  const handleEditAnswer = (answerId: string, content: string) => {
    setEditingAnswerId(answerId);
    setEditAnswerContent(content);
  };

  const handleUpdateAnswer = async (answerId: string) => {
    if (!editAnswerContent.trim()) return;

    updateAnswer.mutate(
      {
        answerId,
        questionId,
        updates: { content: editAnswerContent },
      },
      {
        onSuccess: () => {
          setEditingAnswerId(null);
          setEditAnswerContent("");
        },
        onError: (error) => {
          console.error("Failed to update answer:", error);
          alert("답변 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!confirm("정말 이 답변을 삭제하시겠습니까?")) return;

    deleteAnswer.mutate(
      {
        answerId,
        questionId,
      },
      {
        onSuccess: () => {
          // Success
        },
        onError: (error) => {
          console.error("Failed to delete answer:", error);
          alert("답변 삭제에 실패했습니다.");
        },
      }
    );
  };

  if (isLoadingQuestion) {
    return (
      <div className="min-h-screen bg-neutral-1 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (questionError || !question) {
    return (
      <div className="min-h-screen bg-neutral-1 flex items-center justify-center">
        <div className="text-lg text-red-60">질문을 찾을 수 없습니다.</div>
      </div>
    );
  }

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
            <span>/</span>
            <Link
              href={`/learn/${enrollmentId}/qna`}
              className="hover:text-neutral-80"
            >
              질문 목록
            </Link>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg border border-neutral-20 p-6 mb-6">
          {!isEditingQuestion ? (
            <>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-neutral-95 flex-1">
                  {question.title}
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditQuestion}
                    className="px-3 py-1 text-sm bg-neutral-20 text-neutral-80 rounded hover:bg-neutral-30"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteQuestion}
                    className="px-3 py-1 text-sm bg-red-10 text-red-60 rounded hover:bg-red-20"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="text-neutral-80 whitespace-pre-wrap mb-4">
                {question.content}
              </p>
              <div className="text-xs text-neutral-50">
                작성일: {new Date(question.createdAt).toLocaleString("ko-KR")}
                {question.updatedAt !== question.createdAt && (
                  <span className="ml-4">
                    수정일: {new Date(question.updatedAt).toLocaleString("ko-KR")}
                  </span>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateQuestion}>
              <div className="mb-4">
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-neutral-80 mb-2"
                >
                  제목
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={editQuestionTitle}
                  onChange={(e) => setEditQuestionTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="edit-content"
                  className="block text-sm font-medium text-neutral-80 mb-2"
                >
                  내용
                </label>
                <textarea
                  id="edit-content"
                  value={editQuestionContent}
                  onChange={(e) => setEditQuestionContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40 resize-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updateQuestion.isPending}
                  className="px-6 py-2 bg-mint-40 text-white rounded-lg hover:bg-mint-50 font-medium disabled:opacity-50"
                >
                  {updateQuestion.isPending ? "저장 중..." : "저장"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingQuestion(false)}
                  className="px-6 py-2 bg-neutral-20 text-neutral-80 rounded-lg hover:bg-neutral-30"
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Answers Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-95 mb-4">
            답변 {answers?.length || 0}개
          </h2>

          {/* Answer Form */}
          <form
            onSubmit={handleSubmitAnswer}
            className="bg-white rounded-lg border border-neutral-20 p-6 mb-4"
          >
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-neutral-80 mb-2"
            >
              답변 작성
            </label>
            <textarea
              id="answer"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="답변을 입력하세요"
              rows={4}
              className="w-full px-4 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40 resize-none mb-3"
              required
            />
            <button
              type="submit"
              disabled={createAnswer.isPending}
              className="px-6 py-2 bg-mint-40 text-white rounded-lg hover:bg-mint-50 font-medium disabled:opacity-50"
            >
              {createAnswer.isPending ? "답변 작성 중..." : "답변 등록"}
            </button>
          </form>

          {/* Answers List */}
          {isLoadingAnswers && (
            <div className="text-center py-8 text-neutral-60">
              답변을 불러오는 중...
            </div>
          )}

          {answersError && (
            <div className="bg-red-10 border border-red-40 rounded-lg p-6 text-center">
              <p className="text-red-80">답변을 불러오는 중 오류가 발생했습니다.</p>
            </div>
          )}

          {!isLoadingAnswers && !answersError && answers?.length === 0 && (
            <div className="bg-white rounded-lg border border-neutral-20 p-8 text-center">
              <p className="text-neutral-60">아직 답변이 없습니다.</p>
            </div>
          )}

          {!isLoadingAnswers &&
            !answersError &&
            answers?.map((answer) => (
              <div
                key={answer.id}
                className="bg-white rounded-lg border border-neutral-20 p-6 mb-4"
              >
                {editingAnswerId === answer.id ? (
                  <>
                    <textarea
                      value={editAnswerContent}
                      onChange={(e) => setEditAnswerContent(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-neutral-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-40 resize-none mb-3"
                      required
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateAnswer(answer.id)}
                        disabled={updateAnswer.isPending}
                        className="px-4 py-2 bg-mint-40 text-white rounded-lg hover:bg-mint-50 font-medium disabled:opacity-50 text-sm"
                      >
                        {updateAnswer.isPending ? "저장 중..." : "저장"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingAnswerId(null);
                          setEditAnswerContent("");
                        }}
                        className="px-4 py-2 bg-neutral-20 text-neutral-80 rounded-lg hover:bg-neutral-30 text-sm"
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-neutral-80 whitespace-pre-wrap flex-1">
                        {answer.content}
                      </p>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() =>
                            handleEditAnswer(answer.id, answer.content)
                          }
                          className="px-3 py-1 text-sm bg-neutral-20 text-neutral-80 rounded hover:bg-neutral-30"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteAnswer(answer.id)}
                          className="px-3 py-1 text-sm bg-red-10 text-red-60 rounded hover:bg-red-20"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-50">
                      작성일:{" "}
                      {new Date(answer.createdAt).toLocaleString("ko-KR")}
                      {answer.updatedAt !== answer.createdAt && (
                        <span className="ml-4">
                          수정일:{" "}
                          {new Date(answer.updatedAt).toLocaleString("ko-KR")}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
