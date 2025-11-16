import type { ArgsFunc, Async } from "@/types";
import { useAsync } from "./useAsync";
import { useDebounce, type UseDebounceOptions } from "./useDebounce";

export type UseAsyncDebounceOptions = UseDebounceOptions;

export const useAsyncDebounce = <F extends Async<ArgsFunc>, T, E>(
  cb: F,
  options: UseAsyncDebounceOptions = {}
) => {
  const { loading, result, run } = useAsync<F, T, E>(cb);
  
  const debouncedRun = useDebounce(run, options);

  return {
    loading,
    result,
    run: debouncedRun,
  };
};
