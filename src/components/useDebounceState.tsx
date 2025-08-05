import type { Nullable, Optional } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useDebounce, type UseDebounceOptions } from "./useDebounce";

export type UseDebounceStateOptions = UseDebounceOptions;

export function useDebounceState<S>(
  initialState: S | (() => S),
  options: UseDebounceStateOptions
): [S, Dispatch<SetStateAction<S>>];
export function useDebounceState<S>(
  initialState: S | (() => S),
  options: UseDebounceStateOptions
): [Nullable<S>, Dispatch<SetStateAction<Nullable<S>>>];
export function useDebounceState<S>(
  initialState: S | (() => S),
  options: UseDebounceStateOptions
): [Optional<S>, Dispatch<SetStateAction<Optional<S>>>];
export function useDebounceState<S = undefined>(
  initialState: S | (() => S),
  options: UseDebounceStateOptions = {}
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(initialState);

  const debounceSetState = useDebounce(setState, options);

  return [state, debounceSetState];
}
