import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DictTabs, type DictTabsProps } from "./DictTabs";

const mockPosData: DictTabsProps["items"] = [
  {
    pos: "noun",
    definitions: [
      {
        definition: { text: "A test", trans: "測驗" },
        examples: [
          { text: "This is a test", trans: "這是一個測驗" },
          { text: "Another example", trans: "另一個例子" },
        ],
      },
    ],
  },
];

describe("DictTabs", () => {
  it("renders definitions and examples", () => {
    const handleClick = vi.fn();
    render(
      <DictTabs items={mockPosData} activeTab={0} onTabClick={handleClick} />
    );

    expect(screen.getByText("noun")).toBeInTheDocument();
    expect(screen.getByText("A test")).toBeInTheDocument();
    expect(screen.getByText("測驗")).toBeInTheDocument();
    expect(screen.getByText("This is a test")).toBeInTheDocument();
    expect(screen.getByText("另一個例子")).toBeInTheDocument();

    fireEvent.click(screen.getByText("1"));
    expect(handleClick).toHaveBeenCalledWith(0);
  });
});
