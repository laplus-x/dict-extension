import type { ArgsFunc } from "@/types";
import { useCallback, useEffect, useRef } from "react";

export interface UseDebounceOptions {
  delay?: number;
}

/**
 * @description
 * The hook is useful for delaying the execution of functions or state updates until a specified time period has passed without any further changes to the input value. 
 * 
 * @usage
 * This is especially useful in scenarios such as handling user input or triggering network requests, where it effectively reduces unnecessary computations and ensures that resource-intensive operations are only performed after a pause in the input activity.
 */
export const useDebounce = <T extends ArgsFunc>(
  cb: T,
  options: UseDebounceOptions = {}
) => {
  options.delay ??= 200;

  const ref = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fn = useCallback(
    (...args: Parameters<typeof cb>) => {
      clearTimeout(ref.current);

      ref.current = setTimeout(() => cb(...args), options.delay);
    },
    [options.delay]
  );

  useEffect(() => {
    return () => clearTimeout(ref.current);
  }, []);

  return fn;
};
