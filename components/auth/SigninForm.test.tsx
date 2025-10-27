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

describe("SigninForm - Business Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Form Validation", () => {
    it("shows validation error when email is empty", async () => {
      renderWithClient(<SigninForm />);

      const submitButton = screen.getByRole("button", { name: /로그인/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
      });
    });

    it("shows validation error for invalid email format", async () => {
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

    it("shows validation error when password is empty", async () => {
      renderWithClient(<SigninForm />);

      const emailInput = screen.getByLabelText(/이메일/i);
      fireEvent.change(emailInput, { target: { value: "test@test.com" } });

      const submitButton = screen.getByRole("button", { name: /로그인/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/비밀번호를 입력해주세요/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Login API Integration", () => {
    it("calls signIn API with correct data when form is valid", async () => {
      (authApi.signIn as jest.Mock).mockResolvedValue({
        accessToken: "test-access-token",
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
      });
    });

    it("redirects to home page on successful login", async () => {
      (authApi.signIn as jest.Mock).mockResolvedValue({
        accessToken: "test-access-token",
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
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("Error Handling", () => {
    it("shows specific error message for 401 Unauthorized", async () => {
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

    it("shows server error message from API response", async () => {
      const axiosError = new AxiosError("Request failed with status code 500");
      axiosError.response = {
        status: 500,
        data: {
          success: false,
          error: {
            code: "SERVER_ERROR",
            message: "Internal server error",
          },
        },
        statusText: "Internal Server Error",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      (authApi.signIn as jest.Mock).mockRejectedValue(axiosError);

      renderWithClient(<SigninForm />);

      fireEvent.change(screen.getByLabelText(/이메일/i), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(screen.getByLabelText(/비밀번호/i), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /로그인/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/Internal server error/i)
        ).toBeInTheDocument();
      });
    });

    it("shows generic error message when error response has no message", async () => {
      const axiosError = new AxiosError("Network Error");
      axiosError.response = {
        status: 500,
        data: {},
        statusText: "Internal Server Error",
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      (authApi.signIn as jest.Mock).mockRejectedValue(axiosError);

      renderWithClient(<SigninForm />);

      fireEvent.change(screen.getByLabelText(/이메일/i), {
        target: { value: "test@test.com" },
      });
      fireEvent.change(screen.getByLabelText(/비밀번호/i), {
        target: { value: "password123" },
      });

      fireEvent.click(screen.getByRole("button", { name: /로그인/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/로그인 중 오류가 발생했습니다/i)
        ).toBeInTheDocument();
      });
    });

    it("clears previous error message when submitting again", async () => {
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

      (authApi.signIn as jest.Mock).mockRejectedValueOnce(axiosError);

      renderWithClient(<SigninForm />);

      // First submission with error
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

      // Second submission should clear error
      (authApi.signIn as jest.Mock).mockResolvedValue({
        accessToken: "test-token",
        refreshToken: "test-refresh-token",
      });

      fireEvent.change(screen.getByLabelText(/이메일/i), {
        target: { value: "correct@test.com" },
      });
      fireEvent.change(screen.getByLabelText(/비밀번호/i), {
        target: { value: "correctpassword" },
      });

      fireEvent.click(screen.getByRole("button", { name: /로그인/i }));

      await waitFor(() => {
        expect(
          screen.queryByText(/이메일 또는 비밀번호가 올바르지 않습니다/i)
        ).not.toBeInTheDocument();
      });
    });
  });
});
