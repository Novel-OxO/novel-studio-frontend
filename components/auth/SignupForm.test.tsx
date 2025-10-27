import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { SignupForm } from "./SignupForm";
import { usersApi } from "@/lib/api/users/api";

// Mock API
jest.mock("@/lib/api/users/api", () => ({
  usersApi: {
    create: jest.fn(),
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
    expect(
      screen.getByRole("button", { name: /회원가입/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderWithClient(<SignupForm />);

    const submitButton = screen.getByRole("button", { name: /회원가입/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
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

    const emailInput = screen.getByLabelText(/이메일/i);
    const nicknameInput = screen.getByLabelText(/닉네임/i);
    const passwordInput = screen.getByLabelText(/^비밀번호$/i);
    const confirmInput = screen.getByLabelText(/비밀번호 확인/i);

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(nicknameInput, { target: { value: "홍길동" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "different123" } });

    const submitButton = screen.getByRole("button", { name: /회원가입/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/비밀번호가 일치하지 않습니다/i)
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    (usersApi.create as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@test.com",
      nickname: "홍길동",
      profileImageUrl: null,
      role: "USER",
      createdAt: "2024-01-01T00:00:00Z",
    });

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
      expect(usersApi.create).toHaveBeenCalledWith({
        email: "test@test.com",
        nickname: "홍길동",
        password: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/signin");
    });
  });

  it("shows server error for duplicate email", async () => {
    const axiosError = new AxiosError("Request failed with status code 409");
    axiosError.response = {
      status: 409,
      data: {
        success: false,
        error: {
          code: "VALIDATION_001",
          message: "Email already exists",
        },
      },
      statusText: "Conflict",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    (usersApi.create as jest.Mock).mockRejectedValue(axiosError);

    renderWithClient(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: "existing@test.com" },
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
      expect(
        screen.getByText(/이미 사용 중인 이메일입니다/i)
      ).toBeInTheDocument();
    });
  });
});
