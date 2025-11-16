import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("should call callback after delay", () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebounce(cb, { delay: 100 }));

    act(() => {
      result.current(); // 呼叫防抖函式
    });

    // 還沒到 delay，cb 不應該被呼叫
    expect(cb).not.toBeCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(cb).toBeCalledTimes(1);
  });

  it("should call callback only once for rapid calls", () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebounce(cb, { delay: 100 }));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    // 快速連續呼叫，只會執行最後一次
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(cb).toBeCalledTimes(1);
  });

  it("should cancel the pending call on unmount", () => {
    const cb = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebounce(cb, { delay: 100 })
    );

    act(() => {
      result.current();
    });

    unmount(); // 卸載 Hook

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(cb).not.toBeCalled(); // cb 不應該被呼叫
  });

  it("should always call the latest callback", () => {
    let value = 0;
    const cb1 = vi.fn(() => (value = 1));
    const cb2 = vi.fn(() => (value = 2));

    const { result, rerender } = renderHook(
      ({ cb }) => useDebounce(cb, { delay: 100 }),
      {
        initialProps: { cb: cb1 },
      }
    );

    act(() => {
      result.current();
    });

    rerender({ cb: cb2 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // 應該呼叫最新的 cb2
    expect(cb1).not.toBeCalled();
    expect(cb2).toBeCalledTimes(1);
    expect(value).toBe(2);
  });
});
