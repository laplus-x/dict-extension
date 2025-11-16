import { useRef, useState } from "react";

export const useBoolean = (initialState: boolean | (() => boolean)) => {
  const [value, setValue] = useState<boolean>(initialState);

  const actionsRef = useRef({
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
    toggle: () => setValue((prev) => !prev),
  });

  return [value, actionsRef.current] as const;
};
