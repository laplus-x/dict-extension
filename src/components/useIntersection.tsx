import { useEffect, useRef } from "react";

export type UseIntersectionProps = IntersectionObserverInit;

export const useIntersection = (
  callback: IntersectionObserverCallback,
  options?: UseIntersectionProps
) => {
  const ref = useRef<IntersectionObserver>(null);

  useEffect(() => {
    ref.current ??= new IntersectionObserver(callback, options);

    return () => ref.current?.disconnect();
  }, [JSON.stringify(options)]);

  return ref.current;
};
