import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message", () => {
    render(<ErrorMessage message="에러 메시지입니다" />);
    expect(screen.getByText("에러 메시지입니다")).toBeInTheDocument();
  });

  it("does not render when message is empty", () => {
    const { container } = render(<ErrorMessage message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render when message is undefined", () => {
    const { container } = render(<ErrorMessage />);
    expect(container.firstChild).toBeNull();
  });

  it("has alert role for accessibility", () => {
    render(<ErrorMessage message="에러" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
