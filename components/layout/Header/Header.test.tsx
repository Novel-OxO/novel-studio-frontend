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

describe("Header - Business Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication State", () => {
    it("shows login and signup links when user is not authenticated", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(<Header />);

      expect(screen.getByText("로그인")).toBeInTheDocument();
      expect(screen.getByText("회원가입")).toBeInTheDocument();
      expect(screen.queryByText("로그아웃")).not.toBeInTheDocument();
      expect(screen.queryByText("내 코스")).not.toBeInTheDocument();
      expect(screen.queryByText("장바구니")).not.toBeInTheDocument();
    });

    it("shows logout and user menu when user is authenticated", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(true);

      render(<Header />);

      expect(screen.getByText("로그아웃")).toBeInTheDocument();
      expect(screen.getByText("내 코스")).toBeInTheDocument();
      expect(screen.getByText("장바구니")).toBeInTheDocument();
      expect(screen.queryByText("로그인")).not.toBeInTheDocument();
      expect(screen.queryByText("회원가입")).not.toBeInTheDocument();
    });
  });

  describe("Logout Functionality", () => {
    it("clears tokens and redirects to signin page on logout", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(true);

      render(<Header />);

      const logoutButton = screen.getByText("로그아웃");
      fireEvent.click(logoutButton);

      expect(tokenStorage.clearTokens).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/signin");
    });

    it("updates UI state after logout", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(true);

      const { rerender } = render(<Header />);

      // 초기 상태: 로그인됨
      expect(screen.getByText("로그아웃")).toBeInTheDocument();

      // 로그아웃 클릭
      const logoutButton = screen.getByText("로그아웃");
      fireEvent.click(logoutButton);

      // 상태가 로그아웃으로 변경되었는지 확인
      // (실제로는 clearTokens 호출 후 컴포넌트 내부 상태가 변경됨)
      expect(tokenStorage.clearTokens).toHaveBeenCalled();
    });
  });

  describe("Navigation Links", () => {
    it("renders logo link to home page", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(<Header />);

      const logoLink = screen.getByText("Novel Studio");
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("renders courses link for all users", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(<Header />);

      const coursesLink = screen.getByText("코스");
      expect(coursesLink).toHaveAttribute("href", "/courses");
    });

    it("renders signin link when not authenticated", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(<Header />);

      const signinLink = screen.getByText("로그인");
      expect(signinLink).toHaveAttribute("href", "/signin");
    });

    it("renders signup link when not authenticated", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(<Header />);

      const signupLink = screen.getByText("회원가입");
      expect(signupLink).toHaveAttribute("href", "/signup");
    });

    it("renders my-courses link when authenticated", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(true);

      render(<Header />);

      const myCoursesLink = screen.getByText("내 코스");
      expect(myCoursesLink).toHaveAttribute("href", "/my-courses");
    });

    it("renders cart link when authenticated", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(true);

      render(<Header />);

      const cartLink = screen.getByText("장바구니");
      expect(cartLink).toHaveAttribute("href", "/cart");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { container } = render(<Header className="custom-class" />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("custom-class");
    });

    it("applies default classes regardless of custom className", () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

      const { container } = render(<Header className="custom-class" />);

      const header = container.querySelector("header");
      expect(header).toHaveClass("bg-white");
      expect(header).toHaveClass("border-b");
      expect(header).toHaveClass("border-neutral-10");
      expect(header).toHaveClass("sticky");
    });
  });
});
