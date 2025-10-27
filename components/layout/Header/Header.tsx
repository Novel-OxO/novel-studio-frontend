"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { clearTokens } from "@/lib/token";
import { useAuth } from "@/hooks/useAuth";
import type { HeaderProps } from "./types";

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const router = useRouter();
  const { isLoggedIn, isAdmin, invalidateUser } = useAuth();

  const handleLogout = () => {
    clearTokens();
    invalidateUser();
    router.push("/signin");
  };

  return (
    <header
      className={clsx(
        "bg-neutral-95 border-b border-neutral-10 sticky top-0 z-50",
        className
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-mint-40 cursor-pointer">
          <img src="/logo.svg" alt="Novel Studio Logo" className="w-8 h-8" />
          Novel Studio
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-6">
          <Link
            href="/courses"
            className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer"
          >
            코스
          </Link>

          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin/courses"
                  className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer"
                >
                  코스 관리
                </Link>
              )}
              <Link
                href="/my-courses"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer"
              >
                내 코스
              </Link>
              <Link
                href="/cart"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer"
              >
                장바구니
              </Link>
              <Link
                href="/profile"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer"
              >
                내 정보
              </Link>
              <button
                onClick={handleLogout}
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
