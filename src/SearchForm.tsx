import { useBoolean, useDebouncedValue, useInstance } from "@/components";
import { Cambridge } from "@/repositories";
import { Dictionary } from "@/usecases";
import clsx from "clsx";
import {
  useEffect,
  useRef,
  useState,
  type FormEventHandler,
  type KeyboardEventHandler,
} from "react";
import { HiOutlineX } from "react-icons/hi";
import useSWR from "swr";
interface SearchInputProps {
  value: string;
  onChange: (value?: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  return (
    <div className="px-3 h-full flex justify-around items-center gap-2">
      <input
        className="w-full text-lg border-b border-white focus:outline-none"
        name="text"
        placeholder="Enter a text to search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => onChange(undefined)}
        >
          <HiOutlineX className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
};

interface AutocompleteItem {
  word: string;
}

interface AutocompleteListProps {
  data: AutocompleteItem[];
  activeIndex: number;
  onSelect: (word: string) => void;
}

export const AutocompleteList: React.FC<AutocompleteListProps> = ({
  data,
  activeIndex,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex < 0 || !ref.current) return;

    const container = ref.current;
    const item = container.children[activeIndex] as HTMLElement | undefined;

    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div
      ref={ref}
      className="autocomplete absolute z-10 w-full bg-white text-black rounded-b shadow max-h-[50%] overflow-y-auto"
    >
      {data.map((i, index) => (
        <button
          key={i.word}
          className={clsx(
            "w-full text-left px-3 py-2",
            index === activeIndex ? "bg-amber-200" : "hover:bg-amber-100"
          )}
          onPointerDown={() => onSelect(i.word)}
        >
          {i.word}
        </button>
      ))}
    </div>
  );
};

export interface SearchFormProps {
  value?: string;
  onChange: (value?: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  value = "",
  onChange,
}) => {
  const dictionary = useInstance(Dictionary, Cambridge.getInstance());

  const [focusing, { setFalse: setUnfocusing, setTrue: setFocusing }] =
    useBoolean(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const debouncedWord = useDebouncedValue(value, { delay: 300 });
  const shouldSearch = focusing && debouncedWord.trim().length > 1;

  const { data, error, isLoading } = useSWR(
    shouldSearch ? ["autocomplete", debouncedWord] : null,
    ([_, ...args]) => dictionary.autocomplete(...args)
  );

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setUnfocusing();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
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
          e.currentTarget.blur();
        }
        break;
    }
  };

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedWord]);

  return (
    <>
      <form
        className="p-2 sticky top-0 w-full h-[50px] bg-amber-600"
        onSubmit={handleSubmit}
      >
        <SearchInput
          value={value}
          onChange={onChange}
          onFocus={setFocusing}
          onBlur={setUnfocusing}
          onKeyDown={handleKeyDown}
        />
      </form>

      {focusing && !isLoading && error && (
        <p className="text-red-500">{error.message}</p>
      )}

      {focusing && !isLoading && data && (
        <AutocompleteList
          data={data}
          activeIndex={activeIndex}
          onSelect={(word) => onChange(word)}
        />
      )}
    </>
  );
};
