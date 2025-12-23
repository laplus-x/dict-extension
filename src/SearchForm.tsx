import { useBoolean, useDebouncedValue, useInstance } from "@/components";
import { Cambridge } from "@/repositories";
import { Dictionary } from "@/usecases";
import clsx from "clsx";
import { useEffect, useRef, useState, type FormEventHandler } from "react";
import useSWR from "swr";

export interface SearchFormProps {
  value?: string;
  onChange: (value?: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  value = "",
  onChange,
}) => {
  const dictionary = useInstance(Dictionary, Cambridge.getInstance());

  const ref = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement>>([]);
  const [focusing, { setFalse: setUnfocusing, setTrue: setFocusing }] =
    useBoolean(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const debouncedWord = useDebouncedValue(value, { delay: 250 });
  const shouldSearch = focusing && debouncedWord.trim().length > 1;
  const { data, error, isLoading } = useSWR(
    shouldSearch ? ["autocomplete", debouncedWord] : null,
    ([_, ...args]) => dictionary.autocomplete(...args)
  );

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setUnfocusing();
  };

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (!data || data.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < data.length - 1 ? prev + 1 : 0));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : data.length - 1));
        break;

      case "Enter":
        if (activeIndex >= 0) {
          e.preventDefault();
          onChange(data[activeIndex].word);
          setUnfocusing();
          ref.current?.blur();
        }
        break;
    }
  };

  useEffect(() => {
    setActiveIndex(-1);
    itemRefs.current = [];
  }, [debouncedWord]);

  useEffect(() => {
    if (activeIndex < 0) return;

    const el = itemRefs.current[activeIndex];
    el?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  return (
    <>
      <form
        className="p-2 sticky top-0 w-full h-[50px] bg-amber-600"
        onSubmit={handleSubmit}
      >
        <div className="px-3 h-full flex justify-around items-center gap-2">
          <input
            ref={ref}
            className="w-full text-lg border-b border-white focus:outline-none"
            name="text"
            placeholder="Enter a text to search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={setFocusing}
            onBlur={setUnfocusing}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => onChange()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>
      {focusing && !isLoading && error && (
        <p className="text-red-500">{error.message}</p>
      )}
      {focusing && !isLoading && data && (
        <div className="autocomplete absolute z-10 w-full bg-white text-black rounded-b shadow max-h-[50%] overflow-y-auto">
          {data.map((i, index) => (
            <button
              key={i.word}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
              className={clsx(
                "w-full text-left px-3 py-2",
                index === activeIndex ? "bg-amber-200" : "hover:bg-amber-100"
              )}
              onPointerDown={() => onChange(i.word)}
            >
              {i.word}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
