import type { ArgsFunc, Async } from "@/types";
import { Functions } from "@/utilities";
import { useRef, useState } from "react";

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
  const ref = useRef<(...args: Parameters<typeof cb>) => void>(null);

  ref.current ??= async (...args: Parameters<typeof cb>) => {
    setLoading(true);
    const result = await Functions.wrapAsync<T, E>(() => cb(...args));
    setResult(result);
    setLoading(false);
  };

  return { loading, result, run: ref.current };
};
