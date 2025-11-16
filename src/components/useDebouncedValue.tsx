import { useEffect } from "react";
import { useDebounceState } from "./useDebounceState";

export const useDebouncedValue = <S,>(
  ...[state, options]: Parameters<typeof useDebounceState<S>>
) => {
  const [debouncedState, setDebouncedState] = useDebounceState(state, options);

  useEffect(() => {
    setDebouncedState(state);
  }, [state]);
  
  return debouncedState;
};
