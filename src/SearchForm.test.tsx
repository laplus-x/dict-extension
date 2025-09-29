import type { Cambridge } from "@/repositories";
import type { Dictionary } from "@/usecases";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Ok } from "ts-results";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { SearchForm } from "./SearchForm";

vi.mock("@/repositories", () => ({
  Cambridge: { getInstance: vi.fn(() => mock<Cambridge>()) },
}));

vi.mock("@/usecases", () => ({
  Dictionary: vi.fn(() => mock<Dictionary>()),
}));

vi.mock("@/components", async (importActual) => {
  const actual = await importActual<Record<string, any>>();
  return {
    ...actual,
    useAsync: (fn: any) => ({
      loading: false,
      result: Ok([{ word: "mockedWord" }]),
      run: vi.fn(fn),
    }),
    useDebounce: (cb: any) => cb,
    useInstance: (Cls: any) => new Cls(),
  };
});

describe("SearchForm", () => {
  it("should render input with the initial value", () => {
    // Given the SearchForm is rendered with a value "hello"
    render(<SearchForm value="hello" onChange={vi.fn()} />);

    // When querying the input by placeholder
    const input = screen.getByPlaceholderText(/enter a text/i);

    // Then the input should display the initial value
    expect(input).toHaveValue("hello");
  });

  it("should update value and call onChange handler when typing", () => {
    // Given SearchForm with empty value and a change handler
    const handleChange = vi.fn();
    render(<SearchForm value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    // When the user types "cam" into the input
    fireEvent.change(input, { target: { value: "cam" } });

    // Then input value updates and onChange is called with "cam"
    expect(input).toHaveValue("cam");
    expect(handleChange).toHaveBeenCalledWith("cam");
  });

  it("should show autocomplete suggestions when input is focused", async () => {
    // Given SearchForm with some value
    render(<SearchForm value="test" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    // When input gains focus
    fireEvent.focus(input);

    // Then autocomplete suggestions should appear
    await waitFor(() => expect(screen.getByText("mockedWord")).toBeTruthy());
  });

  it("should clear input value when clear button is clicked", () => {
    // Given SearchForm with value "abc"
    render(<SearchForm value="abc" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    // When clear button is clicked
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    // Then input value should be empty
    expect(input).toHaveValue("");
  });

  it("should fill input with suggestion text when suggestion is selected", async () => {
    // Given SearchForm with value "try"
    render(<SearchForm value="try" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    // When input gains focus and user clicks on suggestion "mockedWord"
    fireEvent.focus(input);
    const suggestion = await screen.findByText("mockedWord");
    fireEvent.mouseDown(suggestion);

    // Then input value is updated to the selected suggestion
    expect(input).toHaveValue("mockedWord");
  });
});
