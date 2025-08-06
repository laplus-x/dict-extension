import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DictPron, type DictPronProps } from "./DictPron";

const mockPronData: DictPronProps["data"] = {
  us: { ipa: "ˈtɛst", audio: "us-audio.mp3" },
  uk: { ipa: "tɛst", audio: "uk-audio.mp3" },
};

describe("DictPron", () => {
  it("should render IPA text for each dialect", () => {
    // When rendering DictPron with pronunciation data
    render(<DictPron data={mockPronData} />);

    // Then IPA text and dialect labels should be displayed
    expect(screen.getByText("us")).toBeInTheDocument();
    expect(screen.getByText("ˈtɛst")).toBeInTheDocument();
    expect(screen.getByText("uk")).toBeInTheDocument();
    expect(screen.getByText("tɛst")).toBeInTheDocument();
  });

  it("should play audio when a play button is clicked", () => {
    // Given an Audio mock
    const playMock = vi.fn();
    (global as any).Audio = vi.fn().mockImplementation(() => ({
      play: playMock,
    }));

    render(<DictPron data={mockPronData} />);

    // When clicking the play button
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    // Then the audio playback should be triggered
    expect(playMock).toHaveBeenCalled();
  });
});
