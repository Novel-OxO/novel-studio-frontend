import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer - Business Logic", () => {
  describe("Content Rendering", () => {
    it("renders company name", () => {
      render(<Footer />);
      expect(screen.getByText("Novel Studio")).toBeInTheDocument();
    });

    it("renders company description", () => {
      render(<Footer />);
      expect(
        screen.getByText("온라인 코스 플랫폼으로 다양한 강의를 제공합니다.")
      ).toBeInTheDocument();
    });

    it("renders current year in copyright", () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(new RegExp(`© ${currentYear} Novel Studio`, "i"))
      ).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("renders courses link with correct href", () => {
      render(<Footer />);
      const coursesLink = screen.getByText("코스 목록");
      expect(coursesLink).toBeInTheDocument();
      expect(coursesLink).toHaveAttribute("href", "/courses");
    });

    it("renders about link with correct href", () => {
      render(<Footer />);
      const aboutLink = screen.getByText("회사 소개");
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute("href", "/about");
    });

    it("renders FAQ link with correct href", () => {
      render(<Footer />);
      const faqLink = screen.getByText("자주 묻는 질문");
      expect(faqLink).toBeInTheDocument();
      expect(faqLink).toHaveAttribute("href", "/faq");
    });

    it("renders contact link with correct href", () => {
      render(<Footer />);
      const contactLink = screen.getByText("문의하기");
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute("href", "/contact");
    });
  });

  describe("Sections", () => {
    it("renders service section header", () => {
      render(<Footer />);
      const serviceHeaders = screen.getAllByText("서비스");
      expect(serviceHeaders.length).toBeGreaterThan(0);
    });

    it("renders customer support section header", () => {
      render(<Footer />);
      expect(screen.getByText("고객 지원")).toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      const { container } = render(<Footer className="custom-class" />);
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("custom-class");
    });

    it("applies default classes regardless of custom className", () => {
      const { container } = render(<Footer className="custom-class" />);
      const footer = container.querySelector("footer");
      expect(footer).toHaveClass("bg-neutral-5");
      expect(footer).toHaveClass("border-t");
      expect(footer).toHaveClass("border-neutral-10");
      expect(footer).toHaveClass("mt-auto");
    });
  });

  describe("Copyright Year", () => {
    it("dynamically updates copyright year", () => {
      const currentYear = new Date().getFullYear();
      render(<Footer />);

      const copyrightText = screen.getByText(
        new RegExp(`© ${currentYear} Novel Studio`, "i")
      );
      expect(copyrightText).toBeInTheDocument();
    });

    it("does not show hardcoded year", () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;

      expect(
        screen.queryByText(new RegExp(`© ${nextYear}`, "i"))
      ).not.toBeInTheDocument();
    });
  });
});
