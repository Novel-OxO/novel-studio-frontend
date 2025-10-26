import { SignupForm } from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | Novel Studio",
  description: "Novel Studio 회원가입 페이지",
};

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-1 px-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-80 mb-2">
            회원가입
          </h1>
          <p className="text-neutral-50">
            Novel Studio에 오신 것을 환영합니다
          </p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-10 p-8">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
