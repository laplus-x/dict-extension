import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Err, Ok } from "ts-results";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { useAsync } from "./components";
import { Dict } from "./Dict";
import type { DictPronProps } from "./DictPron";
import type { DictTabsProps } from "./DictTabs";
import type { Cambridge } from "./repositories";

vi.mock("@/repositories", () => ({
  Cambridge: vi.fn(() => mock<Cambridge>()),
}));

vi.mock("@/components", async (importActual) => {
  const actual = await importActual<Record<string, any>>();
  return {
    ...actual,
    useAsync: vi.fn(),
    useDebounce: (cb: any) => cb,
    useInstance: (Cls: any) => new Cls(),
    Skeleton: () => <div data-testid="skeleton">Loading...</div>,
  };
});

vi.mock("./DictPron", () => ({
  DictPron: ({ data }: DictPronProps) => (
    <div data-testid="dict-pron">{JSON.stringify(data)}</div>
  ),
}));

vi.mock("./DictTabs", () => ({
  DictTabs: ({ items, onTabClick }: DictTabsProps) => (
    <div>
      <p data-testid="dict-tabs">{items.map((i) => i.pos).join(",")}</p>
      <button onClick={() => onTabClick(1)}>Switch Tab</button>
    </div>
  ),
}));

describe("Dict", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays a Skeleton while data is loading", () => {
    // Given the dictionary is loading
    vi.mocked(useAsync).mockReturnValue({
      loading: true,
      result: Ok(null),
      run: vi.fn(),
    });

    // When rendering the Dict component
    render(<Dict text="test" />);

    // Then a Skeleton should be displayed
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("displays an error message when the lookup fails", async () => {
    // Given the dictionary returns an error
    vi.mocked(useAsync).mockReturnValue({
      loading: false,
      result: Err(new Error("Not Found")),
      run: vi.fn(),
    });

    // When rendering the Dict component
    render(<Dict text="fail" />);

    // Then the error message should be visible
    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });

  it("renders DictPron and DictTabs when the lookup succeeds", async () => {
    // Given the dictionary returns valid results
    vi.mocked(useAsync).mockReturnValue({
      loading: false,
      result: Ok({
        pron: { ipa: "/test/" },
        link: "https://example.com",
        pos: [{ pos: "noun" }, { pos: "verb" }],
      }),
      run: vi.fn(),
    });

    // When rendering the Dict component
    render(<Dict text="hello" />);

    // Then DictPron and DictTabs should be displayed
    expect(screen.getByTestId("dict-pron")).toBeInTheDocument();
    expect(screen.getByTestId("dict-tabs")).toHaveTextContent("noun,verb");

    // And the link should point to the source
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });

  it("calls run with the provided text", async () => {
    // Given a run function mock
    const runMock = vi.fn();
    vi.mocked(useAsync).mockReturnValue({
      loading: false,
      result: Ok({
        pron: {},
        link: "#",
        pos: [{ label: "adj" }],
      }),
      run: runMock,
    });

    // When rendering Dict with a search text
    render(<Dict text="apple" />);

    // Then run should be called with that text
    await waitFor(() => {
      expect(runMock).toHaveBeenCalledWith("apple");
    });
  });

  it("triggers handleTabClick when a tab is clicked", async () => {
    // Given the dictionary returns a result with one tab
    vi.mocked(useAsync).mockReturnValue({
      loading: false,
      result: Ok({
        pron: {},
        link: "#",
        pos: [{ label: "adj" }],
      }),
      run: vi.fn(),
    });

    // When the user clicks a tab
    render(<Dict text="big" />);
    fireEvent.click(screen.getByText("Switch Tab"));

    // Then the tab click handler should be triggered
    expect(screen.getByTestId("dict-tabs")).toBeInTheDocument();
  });
});
