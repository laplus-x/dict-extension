import { useRef } from "react";

type Constructor<T = any> = {
    new(): T;
    getInstance?: () => T;
};

export const useInstance = <T>(cls: Constructor<T>) => {
    const ref = useRef(cls.getInstance?.() ?? new cls())
    return ref.current
}