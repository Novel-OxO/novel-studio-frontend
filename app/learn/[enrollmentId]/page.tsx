"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentsApi } from "@/lib/api/enrollments/api";
import { useState, useEffect, useRef } from "react";
import type { EnrolledLecture } from "@/lib/api/enrollments/types";
import Link from "next/link";

export default function LearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const enrollmentId = params.enrollmentId as string;
  const initialLectureId = searchParams.get("lectureId");

  const [currentLecture, setCurrentLecture] = useState<EnrolledLecture | null>(
    null
  );
  const [watchTime, setWatchTime] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch enrolled course detail
  const { data: courseDetail, isLoading } = useQuery({
    queryKey: ["enrolled-course", enrollmentId],
    queryFn: () => enrollmentsApi.getCourseDetail(enrollmentId),
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: (data: {
      lectureId: string;
      watchTime: number;
      isCompleted: boolean;
    }) => enrollmentsApi.updateProgress(enrollmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["enrolled-course", enrollmentId],
      });
    },
  });

  // Set initial lecture
  useEffect(() => {
    if (!courseDetail || currentLecture) return;

    if (initialLectureId) {
      // Find lecture by ID from URL
      for (const section of courseDetail.sections) {
        const lecture = section.lectures.find((l) => l.id === initialLectureId);
        if (lecture) {
          setCurrentLecture(lecture);
          setWatchTime(lecture.progress?.watchTime || 0);
          return;
        }
      }
    }

    // Otherwise, select first lecture
    if (
      courseDetail.sections.length > 0 &&
      courseDetail.sections[0].lectures.length > 0
    ) {
      const firstLecture = courseDetail.sections[0].lectures[0];
      setCurrentLecture(firstLecture);
      setWatchTime(firstLecture.progress?.watchTime || 0);
    }
  }, [courseDetail, initialLectureId, currentLecture]);

  // Get all lectures in order
  const allLectures = courseDetail?.sections.flatMap((s) => s.lectures) || [];
  const currentLectureIndex = currentLecture
    ? allLectures.findIndex((l) => l.id === currentLecture.id)
    : -1;

  const handleLectureChange = (lecture: EnrolledLecture) => {
    setCurrentLecture(lecture);
    setVideoError(null);
    const startTime = lecture.progress?.watchTime || 0;
    setWatchTime(startTime);

    // Seek to saved position after video loads
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = startTime;
      }
    }, 100);
  };

  const handleVideoError = () => {
    if (videoRef.current?.error) {
      const errorCode = videoRef.current.error.code;
      let errorMessage = "비디오를 재생할 수 없습니다.";

      switch (errorCode) {
        case 1: // MEDIA_ERR_ABORTED
          errorMessage = "비디오 로드가 중단되었습니다.";
          break;
        case 2: // MEDIA_ERR_NETWORK
          errorMessage = "네트워크 오류가 발생했습니다.";
          break;
        case 3: // MEDIA_ERR_DECODE
          errorMessage = "비디오 디코딩 오류가 발생했습니다.";
          break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
          errorMessage =
            "이 비디오 형식은 지원되지 않습니다. 관리자에게 문의하여 비디오를 MP4 형식으로 변환해주세요.";
          break;
      }

      setVideoError(errorMessage);
    }
  };

  const handlePrevious = () => {
    if (currentLectureIndex > 0) {
      handleLectureChange(allLectures[currentLectureIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentLectureIndex < allLectures.length - 1) {
      handleLectureChange(allLectures[currentLectureIndex + 1]);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setWatchTime(Math.floor(videoRef.current.currentTime));
    }
  };

  const handleEnded = () => {
    if (currentLecture) {
      updateProgressMutation.mutate({
        lectureId: currentLecture.id,
        watchTime: currentLecture.duration || 0,
        isCompleted: true,
      });

      // Auto-play next lecture
      if (currentLectureIndex < allLectures.length - 1) {
        setTimeout(() => {
          handleNext();
        }, 1000);
      }
    }
  };

  const handlePause = () => {
    if (currentLecture) {
      updateProgressMutation.mutate({
        lectureId: currentLecture.id,
        watchTime,
        isCompleted: false,
      });
    }
  };

  // Auto-save progress every 10 seconds
  useEffect(() => {
    if (!currentLecture) return;

    const interval = setInterval(() => {
      if (watchTime > 0) {
        updateProgressMutation.mutate({
          lectureId: currentLecture.id,
          watchTime,
          isCompleted: false,
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentLecture, watchTime]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!courseDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">강의를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden flex-col lg:flex-row">
      {/* Main Content - Video Player Only */}
      <div className="flex-1 flex flex-col bg-black">
        {/* Video Player */}
        <div className="h-full relative">
          {currentLecture?.videoUrl ? (
            <>
              <video
                key={currentLecture.id}
                ref={videoRef}
                src={currentLecture.videoUrl}
                controls
                controlsList="nodownload"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onPause={handlePause}
                onError={handleVideoError}
                className="w-full h-full"
              />
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4">
                  <div className="text-center">
                    <p className="text-lg mb-2">⚠️ 비디오 재생 오류</p>
                    <p className="text-sm">{videoError}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              비디오를 로드할 수 없습니다.
            </div>
          )}
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-40 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        >
          {sidebarOpen ? "닫기" : "목록"}
        </button>
      </div>

      {/* Sidebar - Course Structure */}
      <div
        className={`
          fixed lg:static inset-0 z-50 lg:z-auto
          w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-lg font-bold mb-1">{courseDetail.title}</h1>
              <p className="text-sm text-gray-600">
                전체 진행률: {courseDetail.enrollment.progress}%
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              ✕
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentLectureIndex === 0}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                ← 이전
              </button>
              <button
                onClick={handleNext}
                disabled={currentLectureIndex === allLectures.length - 1}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                다음 →
              </button>
            </div>
            <Link
              href={`/learn/${enrollmentId}/qna`}
              className="w-full px-3 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 text-sm font-medium"
            >
              💬 질문하기
            </Link>
          </div>
        </div>

        {/* Sections & Lectures */}
        <div className="divide-y divide-gray-200">
          {courseDetail.sections.map((section) => (
            <div key={section.id} className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.lectures.map((lecture) => {
                  const isActive = currentLecture?.id === lecture.id;
                  const isCompleted = lecture.progress?.isCompleted || false;
                  const progress = lecture.progress?.watchTime || 0;
                  const duration = lecture.duration || 0;
                  const progressPercentage =
                    duration > 0 ? (progress / duration) * 100 : 0;

                  return (
                    <button
                      key={lecture.id}
                      onClick={() => {
                        handleLectureChange(lecture);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <span className="text-green-500 flex-shrink-0">
                                ✓
                              </span>
                            )}
                            <h4
                              className={`text-sm font-medium truncate ${
                                isActive ? "text-blue-700" : "text-gray-900"
                              }`}
                            >
                              {lecture.title}
                            </h4>
                          </div>
                          {duration > 0 && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>
                                  {Math.floor(progress / 60)}:
                                  {String(progress % 60).padStart(2, "0")}
                                </span>
                                <span>
                                  {Math.floor(duration / 60)}:
                                  {String(duration % 60).padStart(2, "0")}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      progressPercentage,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        {isActive && (
                          <span className="text-blue-500 flex-shrink-0 text-xl">
                            ▶
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
