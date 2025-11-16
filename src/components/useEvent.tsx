import type { ArgsFunc } from "@/types";
import { useCallback, useLayoutEffect, useRef } from "react";

export const useEvent = <T extends ArgsFunc>(handler: T) => {
  const handlerRef = useRef<T>(null);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: Parameters<typeof handler>) => {
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []);
};
