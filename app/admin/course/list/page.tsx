"use client";

import Link from "next/link";

export default function AdminCourseListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-10">코스 관리</h1>
        <Link
          href="/admin/course/new"
          className="px-4 py-2 bg-mint-40 text-white rounded-lg hover:bg-mint-30 font-medium"
        >
          코스 생성
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-neutral-40 text-center py-12">
          코스 목록이 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
