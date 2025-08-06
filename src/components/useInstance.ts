import { useRef } from "react";

type Constructor<T = any> = {
    new (...args: any[]): T;
    getInstance?: (...args: any[]) => T;
};

export const useInstance = <T>(cls: Constructor<T>, ...args: any[]) => {
    const ref = useRef(cls.getInstance?.(...args) ?? new cls(...args))
    return ref.current
}