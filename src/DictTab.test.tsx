import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DictTab, type DictTabProps } from "./DictTab";

const mockPosData: DictTabProps["items"] = [
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

describe("DictTab", () => {
  it("should render part of speech, definition, translation, and examples", () => {
    // Given a set of dictionary items
    render(<DictTab items={mockPosData} activeTab={0} onTabClick={vi.fn()} />);

    // Then part of speech, definitions, and examples should be displayed
    expect(screen.getByText("noun")).toBeInTheDocument();
    expect(screen.getByText("A test")).toBeInTheDocument();
    expect(screen.getByText("測驗")).toBeInTheDocument();
    expect(screen.getByText("This is a test")).toBeInTheDocument();
    expect(screen.getByText("另一個例子")).toBeInTheDocument();
  });

  it("should call onTabClick when a tab button is clicked", () => {
    // Given a mock onTabClick handler
    const handleClick = vi.fn();
    render(
      <DictTab items={mockPosData} activeTab={0} onTabClick={handleClick} />
    );

    // When the tab button is clicked
    fireEvent.click(screen.getByText("1"));

    // Then the onTabClick handler should be called with the correct index
    expect(handleClick).toHaveBeenCalledWith(0);
  });
});
