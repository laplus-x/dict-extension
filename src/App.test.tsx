import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.mock("./SearchForm", () => ({
  SearchForm: ({
    value = "",
    onChange,
  }: {
    value?: string;
    onChange: (v?: string) => void;
  }) => (
    <input
      data-testid="mock-searchform"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("./Dict", () => ({
  Dict: ({ text }: { text?: string }) => (
    <div data-testid="mock-dict">{text}</div>
  ),
}));

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render SearchForm and Dict initially", () => {
    render(<App />);

    expect(screen.getByTestId("mock-searchform")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dict")).toHaveTextContent("");
  });

  it("should update Dict text when typing in SearchForm", () => {
    render(<App />);
    const input = screen.getByTestId("mock-searchform");

    fireEvent.change(input, { target: { value: "banana" } });

    expect(input).toHaveValue("banana");
    expect(screen.getByTestId("mock-dict")).toHaveTextContent("banana");
  });

  it("should initialize text from URL query string", () => {
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        search: "?text=apple",
      },
      writable: true,
    });

    render(<App />);

    expect(screen.getByTestId("mock-searchform")).toHaveValue("apple");
    expect(screen.getByTestId("mock-dict")).toHaveTextContent("apple");
  });
});
