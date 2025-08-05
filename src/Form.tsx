import { useAsync, useDebounce, useInstance } from "@/components";
import { Cambridge } from "@/repositories";
import { useEffect, useState, type FormEventHandler } from "react";

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchForm = ({ value, onChange }: SearchFormProps) => {
  const cambridge = useInstance(Cambridge);
  const { loading, result, run } = useAsync(cambridge.autocomplete);

  const [focusing, setFocusing] = useState<boolean>(false);
  const [word, setWord] = useState<string>("");

  const debounceChange = useDebounce(onChange, { delay: 200 });
  const debounceAutocomplete = useDebounce(run, { delay: 500 });

  useEffect(() => {
    setWord(value);
  }, [value]);

  useEffect(() => {
    if (!word) return;
    debounceChange(word);
  }, [word]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setFocusing(false);
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
              debounceAutocomplete(e.target.value);
              setWord(e.target.value);
            }}
            onFocus={() => {
              run(word);
              setFocusing(true)
            }}
            onBlur={() => setFocusing(false)}
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
      {focusing && !loading && result && result.ok && (
        <div className="absolute z-10 w-full bg-white text-black rounded-b shadow max-h-30 overflow-y-auto">
          {result.val.map((i) => (
            <button
              key={i.word}
              className="w-full text-left px-3 py-2 hover:bg-amber-100"
              onMouseDown={() => setWord(i.word)}
            >
              {i.word}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
