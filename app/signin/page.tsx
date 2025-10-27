import { SigninForm } from "@/components/auth/SigninForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | Novel Studio",
  description: "Novel Studio 로그인 페이지",
};

export default function SigninPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-3 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-95 mb-2">로그인</h1>
          <p className="text-neutral-70">Novel Studio에 오신 것을 환영합니다</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-10 p-8">
          <SigninForm />
        </div>
      </div>
    </main>
  );
}
