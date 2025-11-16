import {
  useBoolean,
  useDebounce,
  useDebouncedValue,
  useInstance,
} from "@/components";
import { Cambridge } from "@/repositories";
import { Dictionary } from "@/usecases";
import { useEffect, useState, type FormEventHandler } from "react";
import useSWR from "swr";

export interface SearchFormProps {
  value?: string;
  onChange: (value?: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ value = "", onChange }) => {
  const dictionary = useInstance(Dictionary, Cambridge.getInstance());

  const [focusing, { setFalse: setUnfocusing, setTrue: setFocusing }] =
    useBoolean(false);
  const [word, setWord] = useState<string>(value);

  const debounceChange = useDebounce(onChange, { delay: 500 });

  const debouncedWord = useDebouncedValue(word, { delay: 200 });
  const shouldSearch = focusing && debouncedWord.trim().length > 1;
  const { data, error, isLoading } = useSWR(
    shouldSearch ? ["autocomplete", debouncedWord] : null,
    ([_, ...args]) => dictionary.autocomplete(...args)
  );

  useEffect(() => {
    setWord(value);
  }, [value]);

  useEffect(() => {
    if (!word) return;
    debounceChange(word);
  }, [word]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setUnfocusing();
  };

  return (
    <>
      <form
        className="p-2 sticky top-0 w-full h-[50px] bg-amber-600"
        onSubmit={handleSubmit}
      >
        <div className="px-3 h-full flex justify-around items-center gap-2">
          <input
            className="w-full text-lg border-b border-white focus:outline-none"
            name="text"
            placeholder="Enter a text to search"
            value={word}
            onChange={(e) => {
              setWord(e.target.value);
            }}
            onFocus={setFocusing}
            onBlur={setUnfocusing}
            autoComplete="off"
          />
          {word && (
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setWord("")}
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
        <div className="absolute z-10 w-full bg-white text-black rounded-b shadow max-h-[50%] overflow-y-auto">
          {data.map((i) => (
            <button
              key={i.word}
              className="w-full text-left px-3 py-2 hover:bg-amber-100"
              onPointerDown={() => setWord(i.word)}
            >
              {i.word}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
