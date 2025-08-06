import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.mock("./SearchForm", () => ({
  SearchForm: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      data-testid="mock-searchform"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("./Dict", () => ({
  Dict: ({ text }: { text: string }) => (
    <div data-testid="mock-dict">{text}</div>
  ),
}));

const addListenerMock = vi.fn();
const removeListenerMock = vi.fn();
const postMessageMock = vi.fn();

(global as any).chrome = {
  runtime: {
    connect: vi.fn(() => ({
      onMessage: {
        addListener: addListenerMock,
        removeListener: removeListenerMock,
      },
      postMessage: postMessageMock,
    })),
    onMessage: {
      addListener: addListenerMock,
      removeListener: removeListenerMock,
    },
  },
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render SearchForm and Dict initially", () => {
    // Given the App component is rendered
    render(<App />);

    // Then SearchForm and Dict should be in the document
    expect(screen.getByTestId("mock-searchform")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dict")).toHaveTextContent("");
  });

  it("should update SearchForm value when typing", () => {
    // Given the App component is rendered
    render(<App />);
    const input = screen.getByTestId("mock-searchform");

    // When the user types "banana"
    fireEvent.change(input, { target: { value: "banana" } });

    // Then the input value should update
    expect(input).toHaveValue("banana");
  });

  it("should update Dict text when receiving a QUERY message and visible is true", () => {
    // Given the App component is rendered
    render(<App />);
    const handler = addListenerMock.mock.calls[0][0];

    // When a QUERY message and VISIBLE=true message are received
    act(() => {
      handler({ type: "QUERY", text: "apple" });
      handler({ type: "VISIBLE", visible: true });
    });

    // Then Dict should display the queried text
    expect(screen.getByTestId("mock-dict")).toHaveTextContent("apple");
  });

  it("should hide Dict when receiving VISIBLE=false", () => {
    // Given the App component is rendered and a QUERY message is received
    render(<App />);
    const handler = addListenerMock.mock.calls[0][0];

    act(() => {
      handler({ type: "QUERY", text: "pear" });
      handler({ type: "VISIBLE", visible: false });
    });

    // Then Dict should display empty string
    expect(screen.getByTestId("mock-dict")).toHaveTextContent("");
  });
});
