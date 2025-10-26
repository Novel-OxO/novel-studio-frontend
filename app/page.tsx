"use client";

import { useState } from "react";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 간단한 이메일 검증 예시
    if (!email.includes("@")) {
      setEmailError("올바른 이메일 형식이 아닙니다");
      return;
    }

    setEmailError("");
    setIsLoading(true);

    // 2초 후 로딩 해제 (시뮬레이션)
    setTimeout(() => {
      setIsLoading(false);
      alert(`이메일: ${email}\n비밀번호: ${password}`);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-1">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-10 px-16 ">
          <h1 className="text-2xl font-bold text-neutral-80 mb-6 text-center">
            공통 컴포넌트 테스트
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="이메일"
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />

            <Input
              label="비밀번호"
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex flex-col gap-3 mt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                fullWidth
                isLoading={isLoading}
              >
                로그인
              </Button>

              <Button type="button" variant="secondary" size="sm" fullWidth>
                회원가입
              </Button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button type="button" variant="primary" size="sm">
                Small
              </Button>
              <Button type="button" variant="secondary" size="md">
                Medium
              </Button>
              <Button type="button" variant="secondary" size="lg">
                Large
              </Button>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="primary" disabled>
                Disabled
              </Button>
              <Button type="button" variant="secondary" isLoading>
                Loading
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
