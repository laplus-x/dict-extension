import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import useSWR from "swr";
import { describe, expect, it, vi, type Mock } from "vitest";
import { SearchForm } from "./SearchForm";

vi.mock("swr");

describe("SearchForm", () => {
  beforeEach(() => {
    (useSWR as Mock).mockReturnValue({
      data: [{ word: "mockedWord" }],
      error: null,
    });
  });

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

    // Then the input value should be updated and onChange called
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
    const handleChange = vi.fn();
    render(<SearchForm value="abc" onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    // When clear button is clicked
    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    // Then input value is cleared and onChange is called with undefined
    expect(handleChange).toBeCalledWith(undefined);
  });

  it("should fill input with suggestion text when suggestion is selected", async () => {
    // Given SearchForm with value "try"
    const handleChange = vi.fn();
    render(<SearchForm value="mockedWord" onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/enter a text/i);

    // When input gains focus and user clicks on suggestion "mockedWord"
    fireEvent.focus(input);
    const suggestion = await screen.findByText("mockedWord");
    fireEvent.pointerDown(suggestion);

    // Then input value is updated to the selected suggestion
    expect(handleChange).toBeCalledWith("mockedWord");
  });
});
