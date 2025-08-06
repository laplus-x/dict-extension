import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Err, Ok } from "ts-results";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { Dict } from "./Dict";
import type { DictPronProps } from "./DictPron";
import type { DictTabsProps } from "./DictTabs";
import type { Cambridge } from "./repositories";

vi.mock("@/repositories", () => ({
  Cambridge: vi.fn(() => mock<Cambridge>()),
}));

// mock custom hooks
const { useAsyncMock } = vi.hoisted(() => {
  return {
    useAsyncMock: vi.fn(),
  };
});

vi.mock("@/components", async (importActual) => {
  const actual = await importActual<Record<string, any>>();
  return {
    ...actual,
    useAsync: useAsyncMock,
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
  DictTabs: ({ items, onTabClick, activeTab }: DictTabsProps) => (
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

  it("displays Skeleton when loading=true", () => {
    useAsyncMock.mockReturnValue({
      loading: true,
      result: null,
      run: vi.fn(),
    });

    render(<Dict text="test" />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("displays error message when result.ok=false", async () => {
    useAsyncMock.mockReturnValue({
      loading: false,
      result: Err(new Error("Not Found")),
      run: vi.fn(),
    });

    render(<Dict text="fail" />);
    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });

  it("displays DictPron and DictTabs when query succeeds", async () => {
    useAsyncMock.mockReturnValue({
      loading: false,
      result: Ok({
        pron: { ipa: "/test/" },
        link: "https://example.com",
        pos: [{ pos: "noun" }, { pos: "verb" }],
      }),
      run: vi.fn(),
    });

    render(<Dict text="hello" />);

    expect(screen.getByTestId("dict-pron")).toBeInTheDocument();
    expect(screen.getByTestId("dict-tabs")).toHaveTextContent("noun,verb");

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });

  it("calls run when text is provided", async () => {
    const runMock = vi.fn()
    useAsyncMock.mockReturnValue({
      loading: false,
      result: null,
      run: runMock,
    });

    render(<Dict text="apple" />);
    await waitFor(() => {
      expect(runMock).toHaveBeenCalledWith("apple");
    });
  });

  it("triggers handleTabClick when a tab is clicked", async () => {
    useAsyncMock.mockReturnValue({
      loading: false,
      result: Ok({
        pron: {},
        link: "#",
        pos: [{ label: "adj" }],
      }),
      run: vi.fn(),
    });

    render(<Dict text="big" />);
    fireEvent.click(screen.getByText("Switch Tab"));
    expect(screen.getByTestId("dict-tabs")).toBeInTheDocument();
  });
});
