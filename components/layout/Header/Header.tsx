"use client";

import Link from "next/link";
import Image from "next/image";
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
        <Link href="/" className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-mint-40 cursor-pointer">
          <Image src="/logo.svg" alt="Novel Studio Logo" width={32} height={32} className="w-6 h-6 md:w-8 md:h-8" />
          <span className="hidden sm:inline">Novel Studio</span>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-2 md:gap-4 lg:gap-6 text-sm md:text-base">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin/course/list"
                  className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer whitespace-nowrap"
                >
                  코스 관리
                </Link>
              )}
              <Link
                href="/my-courses"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer whitespace-nowrap"
              >
                내 코스
              </Link>
              <Link
                href="/cart"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer whitespace-nowrap"
              >
                장바구니
              </Link>
              <Link
                href="/profile"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer whitespace-nowrap"
              >
                내 정보
              </Link>
              <button
                onClick={handleLogout}
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer whitespace-nowrap"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer whitespace-nowrap"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-neutral-3 hover:text-neutral-10 font-bold cursor-pointer whitespace-nowrap"
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
