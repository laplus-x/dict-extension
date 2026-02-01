import { useState } from "react";
import { Dict } from "./Dict";
import { SearchForm } from "./SearchForm";
import type { Optional } from "./types";

export const App = () => {
  const params = new URLSearchParams(window.location.search);
  const initText = params.get("text") ?? "";

  const [text, setText] = useState<Optional<string>>(initText);

  return (
    <div className="font-sans min-w-[400px] min-h-[300px] w-full h-svh bg-[#343a40] text-white overflow-hidden">
      <SearchForm value={text} onChange={setText} />
      <Dict text={text} />
    </div>
  );
};
