import type { Cambridge } from "@/repositories";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { SearchForm } from "./SearchForm";

vi.mock("@/repositories", () => ({
  Cambridge: vi.fn(() => mock<Cambridge>()),
}));

// mock custom hooks
vi.mock("@/components", async (importActual) => {
  const actual = await importActual<Record<string, any>>();
  return {
    ...actual,
    useAsync: (fn: any) => ({
      loading: false,
      result: { ok: true, val: [{ word: "mockedWord" }] },
      run: vi.fn(fn),
    }),
    useDebounce: (cb: any) => cb,
    useInstance: (Cls: any) => new Cls(),
  };
});

describe("SearchForm", () => {
  it("renders input with initial value", () => {
    render(<SearchForm value="hello" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(/enter a text/i);
    expect(input).toHaveValue("hello");
  });

  it("updates value when typing", () => {
    const handleChange = vi.fn();
    render(<SearchForm value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    fireEvent.change(input, { target: { value: "cam" } });
    expect(input).toHaveValue("cam");
    expect(handleChange).toHaveBeenCalledWith("cam");
  });

  it("shows autocomplete suggestions on focus", async () => {
    render(<SearchForm value="test" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    fireEvent.focus(input);

    await waitFor(() => expect(screen.getByText("mockedWord")).toBeTruthy());
  });

  it("clears input when clicking clear button", () => {
    render(<SearchForm value="abc" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(input).toHaveValue("");
  });

  it("fills input when selecting suggestion", async () => {
    render(<SearchForm value="try" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    fireEvent.focus(input);

    const suggestion = await screen.findByText("mockedWord");
    fireEvent.mouseDown(suggestion);

    expect(input).toHaveValue("mockedWord");
  });
});
