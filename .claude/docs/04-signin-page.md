# 로그인 페이지 구현 계획

## 개요

사용자 로그인 페이지를 구현하여 기존 사용자가 계정으로 로그인할 수 있도록 합니다.

## 구현 상태

### ✅ 완료
- 없음

### 🚧 진행 중
- 없음

### 📋 예정
1. **Zod 스키마 정의** (`lib/validations/auth.ts`에 추가)
2. **SigninForm 컴포넌트 구현** (`components/auth/SigninForm.tsx`)
3. **로그인 페이지 구현** (`app/signin/page.tsx`)
4. **SigninForm 테스트 코드 작성**
5. **Header 컴포넌트 구현** (`components/layout/Header.tsx`)
6. **Footer 컴포넌트 구현** (`components/layout/Footer.tsx`)
7. **Layout 컴포넌트 통합** (Header + Content + Footer)

## 요구사항

### 기능 요구사항

1. **로그인 폼**
   - 이메일 입력 필드 (필수, 이메일 형식 검증)
   - 비밀번호 입력 필드 (필수)
   - 로그인 버튼
   - "로그인 상태 유지" 체크박스 (선택사항)

2. **유효성 검증**
   - React Hook Form으로 폼 상태 관리
   - Zod 스키마로 입력값 검증
   - 실시간 에러 메시지 표시
   - 서버 에러 처리 (잘못된 이메일/비밀번호 등)

3. **UX 개선**
   - 로딩 상태 표시 (로그인 진행 중)
   - 성공 시 대시보드/홈 페이지로 리다이렉트
   - 계정이 없는 경우 회원가입 페이지 링크 제공
   - 비밀번호 찾기 링크 (선택사항)

### 비기능 요구사항

- 접근성: ARIA 라벨, 키보드 네비게이션
- 반응형 디자인: 모바일/태블릿/데스크톱 대응
- 타입 안정성: TypeScript strict 모드

## 기술 스택

- **Form Management**: React Hook Form 7.x
- **Validation**: Zod
- **State Management**: TanStack React Query (mutation)
- **Styling**: Tailwind CSS v4
- **API**: `/lib/api/auth/api.ts` (signIn)

## 구현 계획

### 1. 디렉토리 구조

```
app/
└── signin/
    └── page.tsx                 # 로그인 페이지
components/
├── common/
│   ├── Input/                   # ✅ 이미 구현됨
│   ├── Button/                  # ✅ 이미 구현됨
│   └── ErrorMessage/            # ✅ 이미 구현됨
├── layout/
│   ├── Header/
│   │   ├── Header.tsx           # 공통 헤더 컴포넌트
│   │   ├── Header.test.tsx      # Header 테스트
│   │   └── types.ts             # Header 타입 정의
│   └── Footer/
│       ├── Footer.tsx           # 공통 푸터 컴포넌트
│       ├── Footer.test.tsx      # Footer 테스트
│       └── types.ts             # Footer 타입 정의
└── auth/
    ├── SigninForm.tsx           # 로그인 폼 컴포넌트
    ├── SigninForm.test.tsx      # 테스트
    └── types.ts                 # 폼 타입 정의 (필요시)
lib/
└── validations/
    └── auth.ts                  # Zod 스키마 (signinSchema 추가)
```

### 2. Zod 스키마 정의

**파일**: `lib/validations/auth.ts`에 추가

```typescript
/**
 * 로그인 폼 유효성 검증 스키마
 */
export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email({ message: "올바른 이메일 형식이 아닙니다" }),

  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요"),
});

/**
 * 로그인 폼 데이터 타입
 */
export type SigninFormData = z.infer<typeof signinSchema>;
```

### 3. SigninForm 컴포넌트

**파일**: `components/auth/SigninForm.tsx`

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authApi } from "@/lib/api/auth/api";
import type { SignInRequest } from "@/lib/api/auth/types";
import type { ApiErrorResponse } from "@/lib/api/common/types";
import { signinSchema, type SigninFormData } from "@/lib/validations/auth";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage/ErrorMessage";

export const SigninForm: React.FC = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: "onBlur",
  });

  const { mutate: signin, isPending } = useMutation({
    mutationFn: async (data: SigninFormData) => {
      const request: SignInRequest = {
        email: data.email,
        password: data.password,
      };
      return authApi.signIn(request);
    },
    onSuccess: () => {
      // authApi.signIn()에서 자동으로 토큰 저장됨
      // 로그인 성공 시 홈 페이지로 이동
      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse> | ApiErrorResponse) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 401) {
          setServerError("이메일 또는 비밀번호가 올바르지 않습니다");
        } else if (errorData && "error" in errorData) {
          setServerError(errorData.error.message);
        } else {
          setServerError("로그인 중 오류가 발생했습니다");
        }
      } else {
        setServerError(
          error.error?.message || "로그인 중 오류가 발생했습니다"
        );
      }
    },
  });

  const onSubmit = (data: SigninFormData) => {
    setServerError("");
    signin(data);
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full max-w-md"
      noValidate
    >
      {/* 이메일 입력 */}
      <Input
        label="이메일"
        id="email"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        disabled={isLoading}
        {...register("email")}
      />

      {/* 비밀번호 입력 */}
      <Input
        label="비밀번호"
        id="password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        error={errors.password?.message}
        disabled={isLoading}
        {...register("password")}
      />

      {/* 서버 에러 메시지 */}
      <ErrorMessage message={serverError} />

      {/* 로그인 버튼 */}
      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        로그인
      </Button>

      {/* 회원가입 페이지 링크 */}
      <p className="text-center text-sm text-neutral-50">
        계정이 없으신가요?{" "}
        <a
          href="/signup"
          className="text-mint-40 hover:text-mint-50 font-medium underline"
        >
          회원가입
        </a>
      </p>
    </form>
  );
};
```

### 4. 로그인 페이지

**파일**: `app/signin/page.tsx`

```typescript
import { SigninForm } from "@/components/auth/SigninForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | Novel Studio",
  description: "Novel Studio 로그인 페이지",
};

export default function SigninPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-1 px-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-80 mb-2">
            로그인
          </h1>
          <p className="text-neutral-50">
            Novel Studio에 오신 것을 환영합니다
          </p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-10 p-8">
          <SigninForm />
        </div>
      </div>
    </main>
  );
}
```

### 5. Header 컴포넌트

**파일**: `components/layout/Header/types.ts`

```typescript
export interface HeaderProps {
  /** 헤더 클래스명 (선택사항) */
  className?: string;
}

export interface UserMenuProps {
  /** 사용자 이름 */
  userName?: string;
  /** 로그인 여부 */
  isLoggedIn: boolean;
}
```

**파일**: `components/layout/Header/Header.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { isAuthenticated, clearTokens } from "@/lib/token";
import type { HeaderProps } from "./types";

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    clearTokens();
    setIsLoggedIn(false);
    router.push("/signin");
  };

  return (
    <header
      className={clsx(
        "bg-white border-b border-neutral-10 sticky top-0 z-50",
        className
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="text-2xl font-bold text-neutral-80">
          Novel Studio
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-6">
          <Link
            href="/courses"
            className="text-neutral-70 hover:text-neutral-80 font-medium"
          >
            코스
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/my-courses"
                className="text-neutral-70 hover:text-neutral-80 font-medium"
              >
                내 코스
              </Link>
              <Link
                href="/cart"
                className="text-neutral-70 hover:text-neutral-80 font-medium"
              >
                장바구니
              </Link>
              <button
                onClick={handleLogout}
                className="text-neutral-70 hover:text-neutral-80 font-medium"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-neutral-70 hover:text-neutral-80 font-medium"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="bg-mint-30 text-white px-4 py-2 rounded-sm hover:bg-mint-40 font-medium"
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
```

### 6. Footer 컴포넌트

**파일**: `components/layout/Footer/types.ts`

```typescript
export interface FooterProps {
  /** 푸터 클래스명 (선택사항) */
  className?: string;
}
```

**파일**: `components/layout/Footer/Footer.tsx`

```typescript
import Link from "next/link";
import clsx from "clsx";
import type { FooterProps } from "./types";

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={clsx(
        "bg-neutral-5 border-t border-neutral-10 mt-auto",
        className
      )}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-bold text-neutral-80 mb-4">
              Novel Studio
            </h3>
            <p className="text-sm text-neutral-50">
              온라인 코스 플랫폼으로 다양한 강의를 제공합니다.
            </p>
          </div>

          {/* 링크 */}
          <div>
            <h3 className="text-lg font-bold text-neutral-80 mb-4">
              서비스
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-sm text-neutral-50 hover:text-neutral-70"
                >
                  코스 목록
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-neutral-50 hover:text-neutral-70"
                >
                  회사 소개
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div>
            <h3 className="text-lg font-bold text-neutral-80 mb-4">
              고객 지원
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-neutral-50 hover:text-neutral-70"
                >
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-neutral-50 hover:text-neutral-70"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="border-t border-neutral-10 mt-8 pt-8 text-center">
          <p className="text-sm text-neutral-50">
            © {currentYear} Novel Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
```

### 7. 테스트 코드

**파일**: `components/auth/SigninForm.test.tsx`

```typescript
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { SigninForm } from "./SigninForm";
import { authApi } from "@/lib/api/auth/api";

// Mock API
jest.mock("@/lib/api/auth/api", () => ({
  authApi: {
    signIn: jest.fn(),
  },
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe("SigninForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    renderWithClient(<SigninForm />);

    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /로그인/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderWithClient(<SigninForm />);

    const submitButton = screen.getByRole("button", { name: /로그인/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
    });
  });

  it("shows error for invalid email format", async () => {
    renderWithClient(<SigninForm />);

    const emailInput = screen.getByLabelText(/이메일/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(
        screen.getByText(/올바른 이메일 형식이 아닙니다/i)
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    (authApi.signIn as jest.Mock).mockResolvedValue({
      accessToken: "test-token",
      refreshToken: "test-refresh-token",
    });

    renderWithClient(<SigninForm />);

    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /로그인/i }));

    await waitFor(() => {
      expect(authApi.signIn).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows server error for invalid credentials", async () => {
    const axiosError = new AxiosError("Request failed with status code 401");
    axiosError.response = {
      status: 401,
      data: {
        success: false,
        error: {
          code: "AUTH_001",
          message: "Invalid credentials",
        },
      },
      statusText: "Unauthorized",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    (authApi.signIn as jest.Mock).mockRejectedValue(axiosError);

    renderWithClient(<SigninForm />);

    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /로그인/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/이메일 또는 비밀번호가 올바르지 않습니다/i)
      ).toBeInTheDocument();
    });
  });
});
```

**파일**: `components/layout/Header/Header.test.tsx`

```typescript
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";
import * as tokenStorage from "@/lib/token";

// Mock Next.js
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock token storage
jest.mock("@/lib/token", () => ({
  isAuthenticated: jest.fn(),
  clearTokens: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo", () => {
    render(<Header />);
    expect(screen.getByText("Novel Studio")).toBeInTheDocument();
  });

  it("shows login and signup links when not logged in", () => {
    (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

    render(<Header />);

    expect(screen.getByText("로그인")).toBeInTheDocument();
    expect(screen.getByText("회원가입")).toBeInTheDocument();
    expect(screen.queryByText("로그아웃")).not.toBeInTheDocument();
  });

  it("shows logout button when logged in", () => {
    (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(true);

    render(<Header />);

    expect(screen.getByText("로그아웃")).toBeInTheDocument();
    expect(screen.queryByText("로그인")).not.toBeInTheDocument();
  });

  it("handles logout", () => {
    (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(true);

    render(<Header />);

    const logoutButton = screen.getByText("로그아웃");
    fireEvent.click(logoutButton);

    expect(tokenStorage.clearTokens).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/signin");
  });
});
```

**파일**: `components/layout/Footer/Footer.test.tsx`

```typescript
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders company name", () => {
    render(<Footer />);
    expect(screen.getByText("Novel Studio")).toBeInTheDocument();
  });

  it("renders current year in copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} Novel Studio`, "i"))
    ).toBeInTheDocument();
  });

  it("renders service links", () => {
    render(<Footer />);
    expect(screen.getByText("코스 목록")).toBeInTheDocument();
    expect(screen.getByText("회사 소개")).toBeInTheDocument();
  });

  it("renders support links", () => {
    render(<Footer />);
    expect(screen.getByText("자주 묻는 질문")).toBeInTheDocument();
    expect(screen.getByText("문의하기")).toBeInTheDocument();
  });
});
```

## 디자인 가이드

### 색상 사용

- **Primary Button (로그인)**: `bg-mint-30` / `hover:bg-mint-40`
- **Input Border (기본)**: `border-neutral-20`
- **Input Focus Ring**: `focus:ring-mint-40`
- **Error Text**: `text-red-50`
- **Label Text**: `text-neutral-70`
- **Header Background**: `bg-white` / `border-neutral-10`
- **Footer Background**: `bg-neutral-5` / `border-neutral-10`

### 반응형 디자인

- **모바일** (< 640px): 전체 너비, 패딩 감소
- **태블릿** (640px ~ 1024px): 중앙 정렬, max-w-md
- **데스크톱** (> 1024px): 중앙 정렬, max-w-md

## API 연동

### 엔드포인트

- **POST** `/auth/signin` - 로그인

### 요청 형식

```typescript
{
  email: string;
  password: string;
}
```

### 응답 형식

```typescript
// 성공 (200 OK)
{
  success: true;
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      nickname: string;
      profileImageUrl: string | null;
      role: "USER" | "ADMIN";
    }
  }
}

// 실패
{
  success: false;
  error: {
    code: string;
    message: string;
  }
}

// 에러 응답 예시
// 401 Unauthorized - 잘못된 이메일/비밀번호
// 400 Bad Request - 유효하지 않은 요청 데이터
```

## 구현 순서

1. Zod 스키마 정의 (`lib/validations/auth.ts`에 signinSchema 추가)
2. SigninForm 컴포넌트 구현 (`components/auth/SigninForm.tsx`)
3. 로그인 페이지 구현 (`app/signin/page.tsx`)
4. Header 컴포넌트 구현 (`components/layout/Header/Header.tsx`)
5. Footer 컴포넌트 구현 (`components/layout/Footer/Footer.tsx`)
6. 테스트 코드 작성
   - SigninForm 컴포넌트 테스트 (`components/auth/SigninForm.test.tsx`)
   - Header 컴포넌트 테스트 (`components/layout/Header/Header.test.tsx`)
   - Footer 컴포넌트 테스트 (`components/layout/Footer/Footer.test.tsx`)
7. E2E 테스트 (선택사항)
8. 접근성 테스트

## 컴포넌트 재사용

### Header와 Footer를 모든 페이지에 적용

**Root Layout 수정**: `app/layout.tsx`

```typescript
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Novel Studio",
  description: "온라인 코스 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### 특정 페이지에서 Header/Footer 제외

로그인/회원가입 페이지처럼 Header/Footer가 필요 없는 경우:

```typescript
// app/signin/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

## 향후 개선사항

### 로그인 기능
- 소셜 로그인 연동 (Google, Kakao 등)
- "로그인 상태 유지" 기능 구현
- 비밀번호 찾기 기능
- 이메일 인증 플로우
- 2단계 인증 (2FA)

### Header/Footer 기능
- 다크 모드 토글
- 언어 선택 (i18n)
- 사용자 프로필 드롭다운 메뉴
- 알림 기능
- 검색 기능

## 참고 문서

- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [Zod 공식 문서](https://zod.dev/)
- [TanStack Query Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [프로젝트 API 패턴](./02-api-pattern.md)
- [프로젝트 디자인 시스템](./00-colors.md)
- [회원가입 페이지 구현](./03-signup-page.md)
