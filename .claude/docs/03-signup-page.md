# 회원가입 페이지 구현 계획

## 개요

사용자 회원가입 페이지를 구현하여 신규 사용자가 계정을 생성할 수 있도록 합니다.

## 구현 상태

### ✅ 완료
1. **의존성 설치**
   - react-hook-form 7.65.0
   - zod 4.1.12
   - @hookform/resolvers 5.2.2
   - 테스트 라이브러리 (jest, @testing-library/react, @testing-library/jest-dom 등)

2. **Zod 스키마 정의** (`lib/validations/auth.ts`)
   - 이메일, 비밀번호, 비밀번호 확인, 닉네임 검증
   - SignupFormData 타입 자동 생성

3. **공통 Input 컴포넌트** (`components/common/Input/`)
   - Input.tsx - forwardRef를 사용한 재사용 가능한 Input 컴포넌트
   - types.ts - InputProps 타입 정의
   - Input.test.tsx - 단위 테스트

4. **테스트 환경 구성**
   - jest.config.js - Next.js와 통합된 Jest 설정
   - jest.setup.ts - 테스트 환경 초기 설정
   - jest.d.ts - 글로벌 타입 정의

### 🚧 진행 중
- 없음

### 📋 예정
1. **공통 Button 컴포넌트 구현** (`components/common/Button/Button.tsx`)
2. **SignupForm 컴포넌트 구현** (`components/auth/SignupForm.tsx`)
3. **회원가입 페이지 구현** (`app/signup/page.tsx`)
4. **SignupForm 테스트 코드 작성**
5. **Button 컴포넌트 테스트 코드 작성**

## 요구사항

### 기능 요구사항

1. **회원가입 폼**
   - 이메일 입력 필드 (필수, 이메일 형식 검증)
   - 비밀번호 입력 필드 (필수, 최소 8자, 영문/숫자 조합)
   - 비밀번호 확인 필드 (필수, 비밀번호와 일치)
   - 닉네임 입력 필드 (필수, 2-20자)
   - 회원가입 버튼

2. **유효성 검증**
   - React Hook Form으로 폼 상태 관리
   - Zod 스키마로 입력값 검증
   - 실시간 에러 메시지 표시
   - 서버 에러 처리 (중복 이메일 등)

3. **UX 개선**
   - 로딩 상태 표시 (회원가입 진행 중)
   - 성공 시 로그인 페이지로 리다이렉트
   - 이미 계정이 있는 경우 로그인 페이지 링크 제공

### 비기능 요구사항

- 접근성: ARIA 라벨, 키보드 네비게이션
- 반응형 디자인: 모바일/태블릿/데스크톱 대응
- 타입 안정성: TypeScript strict 모드

## 기술 스택

- **Form Management**: React Hook Form 7.x
- **Validation**: Zod
- **State Management**: TanStack React Query (mutation)
- **Styling**: Tailwind CSS v4
- **API**: `/lib/api/users/api.ts` (createUser)

## 구현 계획

### 1. 디렉토리 구조

```
app/
└── signup/
    └── page.tsx                 # 회원가입 페이지
components/
├── common/
│   ├── Input/
│   │   ├── Input.tsx            # 재사용 가능한 Input 컴포넌트
│   │   ├── Input.test.tsx       # Input 테스트
│   │   └── types.ts             # Input 타입 정의
│   └── Button/
│       ├── Button.tsx           # 재사용 가능한 Button 컴포넌트
│       ├── Button.test.tsx      # Button 테스트
│       └── types.ts             # Button 타입 정의
└── auth/
    ├── SignupForm.tsx           # 회원가입 폼 컴포넌트
    ├── SignupForm.test.tsx      # 테스트
    └── types.ts                 # 폼 타입 정의
lib/
└── validations/
    └── auth.ts                  # Zod 스키마
```

### 2. Zod 스키마 정의

**파일**: `lib/validations/auth.ts`

```typescript
import { z } from "zod";

/**
 * 회원가입 폼 유효성 검증 스키마
 */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email({ message: "올바른 이메일 형식이 아닙니다" }),

  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
      "영문자와 숫자를 포함해야 합니다"
    ),

  passwordConfirm: z
    .string()
    .min(1, "비밀번호 확인을 입력해주세요"),

  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상이어야 합니다")
    .max(20, "닉네임은 최대 20자까지 가능합니다"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["passwordConfirm"],
});

/**
 * 회원가입 폼 데이터 타입
 */
export type SignupFormData = z.infer<typeof signupSchema>;
```

### 3. 공통 Input 컴포넌트

**파일**: `components/common/Input/types.ts`

```typescript
import { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  /** Input 라벨 */
  label: string;
  /** Input ID (htmlFor와 연결) */
  id: string;
  /** 에러 메시지 */
  error?: string;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
}
```

**파일**: `components/common/Input/Input.tsx`

```typescript
import { forwardRef } from "react";
import type { InputProps } from "./types";

/**
 * 재사용 가능한 Input 컴포넌트
 *
 * React Hook Form과 함께 사용하도록 설계됨
 * forwardRef를 사용하여 register() 함수와 호환
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, fullWidth = true, disabled, ...rest }, ref) => {
    const hasError = !!error;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`}>
        <label
          htmlFor={id}
          className="text-sm font-medium text-neutral-70"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`
            px-4 py-3 rounded-lg border
            bg-white text-neutral-80
            placeholder:text-neutral-30
            focus:outline-none focus:ring-2
            transition-colors
            ${
              hasError
                ? "border-red-30 focus:ring-red-20"
                : "border-neutral-20 focus:ring-mint-40"
            }
            ${disabled ? "bg-neutral-5 cursor-not-allowed" : ""}
          `}
          disabled={disabled}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...rest}
        />
        {hasError && (
          <p id={`${id}-error`} className="text-sm text-red-50" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
```

**파일**: `components/common/Input/Input.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="이메일" id="email" />);
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(
      <Input
        label="이메일"
        id="email"
        error="올바른 이메일을 입력해주세요"
      />
    );
    expect(screen.getByText("올바른 이메일을 입력해주세요")).toBeInTheDocument();
  });

  it("applies error styles when error exists", () => {
    render(<Input label="이메일" id="email" error="에러 메시지" />);
    const input = screen.getByLabelText("이메일");
    expect(input).toHaveClass("border-red-30");
  });

  it("applies disabled styles when disabled", () => {
    render(<Input label="이메일" id="email" disabled />);
    const input = screen.getByLabelText("이메일");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("bg-neutral-5");
  });

  it("sets aria-invalid to true when error exists", () => {
    render(<Input label="이메일" id="email" error="에러" />);
    const input = screen.getByLabelText("이메일");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
```

### 4. 공통 Button 컴포넌트

**파일**: `components/common/Button/types.ts`

```typescript
import { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형 */
  variant?: ButtonVariant;
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 */
  isLoading?: boolean;
}
```

**파일**: `components/common/Button/Button.tsx`

```typescript
import type { ButtonProps } from "./types";

/**
 * 재사용 가능한 Button 컴포넌트
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  className = "",
  ...rest
}) => {
  const baseStyles = "rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: `
      bg-mint-40 text-white
      hover:bg-mint-50 active:bg-mint-50
      focus:ring-mint-40
      disabled:bg-neutral-30 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-white text-neutral-80 border border-neutral-20
      hover:bg-neutral-5 active:bg-neutral-10
      focus:ring-neutral-40
      disabled:bg-neutral-5 disabled:text-neutral-30 disabled:cursor-not-allowed
    `,
    ghost: `
      bg-transparent text-neutral-70
      hover:bg-neutral-5 active:bg-neutral-10
      focus:ring-neutral-40
      disabled:text-neutral-30 disabled:cursor-not-allowed
    `,
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? "처리 중..." : children}
    </button>
  );
};
```

**파일**: `components/common/Button/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>클릭</Button>);
    expect(screen.getByText("클릭")).toBeInTheDocument();
  });

  it("applies primary variant styles by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText("Primary");
    expect(button).toHaveClass("bg-mint-40");
  });

  it("applies secondary variant styles", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText("Secondary");
    expect(button).toHaveClass("bg-white");
  });

  it("shows loading text when isLoading is true", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText("처리 중...")).toBeInTheDocument();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies fullWidth class", () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByText("Full Width")).toHaveClass("w-full");
  });
});
```

### 5. SignupForm 컴포넌트 (공통 컴포넌트 사용)

**파일**: `components/auth/SignupForm.tsx`

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createUser, type CreateUserRequest } from "@/lib/api";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import type { ApiErrorResponse } from "@/lib/api";
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";

export const SignupForm: React.FC = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

  // React Hook Form 초기화
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur", // 포커스 아웃 시 검증
  });

  // TanStack Query Mutation
  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const request: CreateUserRequest = {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      };
      return createUser(request);
    },
    onSuccess: () => {
      // 회원가입 성공 시 로그인 페이지로 이동
      router.push("/login?signup=success");
    },
    onError: (error) => {
      const apiError = error as ApiErrorResponse;

      // HTTP 상태 코드별 메시지 처리
      if (apiError.status === 409) {
        setServerError("이미 사용 중인 이메일입니다");
      } else {
        setServerError(
          apiError.error?.message || "회원가입 중 오류가 발생했습니다"
        );
      }
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setServerError(""); // 이전 에러 초기화
    signup(data);
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

      {/* 닉네임 입력 */}
      <Input
        label="닉네임"
        id="nickname"
        type="text"
        placeholder="홍길동"
        error={errors.nickname?.message}
        disabled={isLoading}
        {...register("nickname")}
      />

      {/* 비밀번호 입력 */}
      <Input
        label="비밀번호"
        id="password"
        type="password"
        placeholder="영문, 숫자 조합 8자 이상"
        error={errors.password?.message}
        disabled={isLoading}
        {...register("password")}
      />

      {/* 비밀번호 확인 입력 */}
      <Input
        label="비밀번호 확인"
        id="passwordConfirm"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요"
        error={errors.passwordConfirm?.message}
        disabled={isLoading}
        {...register("passwordConfirm")}
      />

      {/* 서버 에러 메시지 */}
      {serverError && (
        <div
          className="bg-red-5 border border-red-20 text-red-50 px-4 py-3 rounded-lg"
          role="alert"
        >
          {serverError}
        </div>
      )}

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
      >
        회원가입
      </Button>

      {/* 로그인 페이지 링크 */}
      <p className="text-center text-sm text-neutral-50">
        이미 계정이 있으신가요?{" "}
        <a
          href="/login"
          className="text-mint-40 hover:text-mint-50 font-medium underline"
        >
          로그인
        </a>
      </p>
    </form>
  );
};
```

### 6. 회원가입 페이지

**파일**: `app/signup/page.tsx`

```typescript
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
```

### 7. 테스트 코드

**파일**: `components/auth/SignupForm.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignupForm } from "./SignupForm";
import { createUser } from "@/lib/api";

// Mock API
jest.mock("@/lib/api", () => ({
  createUser: jest.fn(),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
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
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    renderWithClient(<SignupForm />);

    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/닉네임/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^비밀번호$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호 확인/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /회원가입/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderWithClient(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: /회원가입/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
      expect(screen.getByText(/닉네임은 최소 2자 이상/i)).toBeInTheDocument();
    });
  });

  it("shows error for invalid email format", async () => {
    renderWithClient(<SignupForm />);

    const emailInput = screen.getByLabelText(/이메일/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(
        screen.getByText(/올바른 이메일 형식이 아닙니다/i)
      ).toBeInTheDocument();
    });
  });

  it("shows error when passwords do not match", async () => {
    renderWithClient(<SignupForm />);

    const passwordInput = screen.getByLabelText(/^비밀번호$/i);
    const confirmInput = screen.getByLabelText(/비밀번호 확인/i);

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "different123" } });
    fireEvent.blur(confirmInput);

    await waitFor(() => {
      expect(screen.getByText(/비밀번호가 일치하지 않습니다/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    (createUser as jest.Mock).mockResolvedValue({ id: "1", email: "test@test.com" });

    renderWithClient(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/닉네임/i), {
      target: { value: "홍길동" },
    });
    fireEvent.change(screen.getByLabelText(/^비밀번호$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호 확인/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /회원가입/i }));

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith({
        email: "test@test.com",
        nickname: "홍길동",
        password: "password123",
      });
    });
  });
});
```

## 디자인 가이드

### 색상 사용

- **Primary Button (회원가입)**: `bg-mint-40` / `hover:bg-mint-50`
- **Input Border (기본)**: `border-neutral-20`
- **Input Focus Ring**: `focus:ring-mint-40`
- **Error Border**: `border-red-30`
- **Error Background**: `bg-red-5`
- **Error Text**: `text-red-50`
- **Label Text**: `text-neutral-70`
- **Disabled State**: `bg-neutral-30`

### 반응형 디자인

- **모바일** (< 640px): 전체 너비, 패딩 감소
- **태블릿** (640px ~ 1024px): 중앙 정렬, max-w-md
- **데스크톱** (> 1024px): 중앙 정렬, max-w-md

## API 연동

### 엔드포인트

- **POST** `/users` - 사용자 생성

### 요청 형식

```typescript
{
  email: string;
  password: string;
  nickname: string;
}
```

### 응답 형식

```typescript
// 성공 (201 Created)
{
  success: true;
  data: {
    id: string;
    email: string;
    nickname: string;
    profileImageUrl: string | null;
    role: "USER";
    createdAt: string;
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
// 400 Bad Request - 유효하지 않은 요청 데이터
// 409 Conflict - 이미 사용 중인 이메일
```

## 구현 순서

1. Zod 스키마 정의 (`lib/validations/auth.ts`)
2. 공통 Input 컴포넌트 구현 (`components/common/Input/Input.tsx`)
3. 공통 Button 컴포넌트 구현 (`components/common/Button/Button.tsx`)
4. SignupForm 컴포넌트 구현 (`components/auth/SignupForm.tsx`)
5. 회원가입 페이지 구현 (`app/signup/page.tsx`)
6. 테스트 코드 작성
   - Input 컴포넌트 테스트 (`components/common/Input/Input.test.tsx`)
   - Button 컴포넌트 테스트 (`components/common/Button/Button.test.tsx`)
   - SignupForm 컴포넌트 테스트 (`components/auth/SignupForm.test.tsx`)
7. E2E 테스트 (선택사항)
8. 접근성 테스트

## 컴포넌트 재사용 예시

공통 컴포넌트는 다른 폼에서도 재사용 가능합니다:

```typescript
// 로그인 폼에서 재사용
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";

export const LoginForm = () => {
  return (
    <form>
      <Input
        label="이메일"
        id="email"
        type="email"
        placeholder="이메일을 입력하세요"
      />
      <Input
        label="비밀번호"
        id="password"
        type="password"
        placeholder="비밀번호를 입력하세요"
      />
      <Button variant="primary" fullWidth>
        로그인
      </Button>
    </form>
  );
};
```

```typescript
// 코스 생성 폼에서 재사용
import { Input } from "@/components/common/Input/Input";
import { Button } from "@/components/common/Button/Button";

export const CourseCreateForm = () => {
  return (
    <form>
      <Input
        label="코스 제목"
        id="title"
        type="text"
        placeholder="코스 제목을 입력하세요"
      />
      <div className="flex gap-2">
        <Button variant="secondary">취소</Button>
        <Button variant="primary">생성</Button>
      </div>
    </form>
  );
};
```

## 향후 개선사항

### 회원가입 기능
- 소셜 로그인 연동 (Google, Kakao 등)
- 이메일 인증 플로우 추가
- 비밀번호 강도 표시 인디케이터
- reCAPTCHA 스팸 방지
- 회원가입 성공 시 웰컴 이메일 발송

### 공통 컴포넌트 확장
- **Textarea** 컴포넌트 추가 (긴 텍스트 입력용)
- **Select** 컴포넌트 추가 (드롭다운 선택)
- **Checkbox** 컴포넌트 추가 (약관 동의 등)
- **Radio** 컴포넌트 추가 (단일 선택)
- **ErrorMessage** 컴포넌트 분리 (에러 표시 전용)
- **FormField** 컴포넌트 추가 (label + input + error를 감싸는 래퍼)

## 참고 문서

- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [Zod 공식 문서](https://zod.dev/)
- [TanStack Query Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [프로젝트 API 패턴](./02-api-pattern.md)
- [프로젝트 디자인 시스템](./00-colors.md)
