import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DictPron, type DictPronProps } from "./DictPron";

const mockPronData: DictPronProps["data"] = {
  us: { ipa: "ˈtɛst", audio: "us-audio.mp3" },
  uk: { ipa: "tɛst", audio: "uk-audio.mp3" },
};

describe("DictPron", () => {
  it("renders IPA and play button", () => {
    // 模擬 Audio
    const playMock = vi.fn();
    (global as any).Audio = vi.fn().mockImplementation(() => ({
      play: playMock,
    }));

    render(<DictPron data={mockPronData} />);

    expect(screen.getByText("us")).toBeInTheDocument();
    expect(screen.getByText("ˈtɛst")).toBeInTheDocument();
    expect(screen.getByText("uk")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(playMock).toHaveBeenCalled();
  });
});
