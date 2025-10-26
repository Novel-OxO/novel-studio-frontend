import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>클릭</Button>);
    expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
  });

  it("shows loading text when isLoading is true", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole("button", { name: "처리 중..." })).toBeInTheDocument();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} isLoading>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
