import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="이메일" id="email" />);
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(
      <Input label="이메일" id="email" error="올바른 이메일을 입력해주세요" />
    );
    expect(
      screen.getByText("올바른 이메일을 입력해주세요")
    ).toBeInTheDocument();
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
});
