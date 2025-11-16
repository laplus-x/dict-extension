import type { ArgsFunc } from "@/types";
import { debounce } from "es-toolkit";
import { useEffect, useMemo } from "react";
import { useEvent } from "./useEvent";

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
  const { delay = 200 } = options;

  const eventCb = useEvent(cb);

  const fn = useMemo(() => debounce(eventCb, delay), [delay, eventCb]);

  useEffect(() => {
    return () => fn.cancel();
  }, [fn]);

  return fn;
};
