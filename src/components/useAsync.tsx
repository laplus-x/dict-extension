import type { ArgsFunc, Async } from "@/types";
import { Functions } from "@/utilities";
import { useRef, useState } from "react";
import { useEvent } from "./useEvent";

export const useAsync = <
  F extends Async<ArgsFunc>,
  T = ReturnType<F>,
  E = Error
>(
  cb: F
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] =
    useState<Awaited<ReturnType<typeof Functions.wrapAsync<T, E>>>>();
  const eventCb = useEvent(cb);
  const ref = useRef<(...args: Parameters<typeof cb>) => void>(() => {});

  ref.current ??= async (...args: Parameters<typeof cb>) => {
    setLoading(true);
    const result = await Functions.wrapAsync<T, E>(() => eventCb(...args));
    setResult(result);
    setLoading(false);
  };

  return { loading, result, run: ref.current };
};
