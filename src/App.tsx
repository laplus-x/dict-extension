import { useEffect, useState } from "react";
import { Dict } from "./Dict";
import { SearchForm } from "./SearchForm";
import type { Optional } from "./types";

export const App = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [text, setText] = useState<Optional<string>>(undefined);

  useEffect(() => {
    const port = chrome.runtime.connect({ name: "popup" });

    const handle = (msg: Record<string, any>) => {
      console.log("Received message:", msg);
      if (msg.type === "QUERY") {
        setText(msg.text);
      } else if (msg.type === "VISIBLE") {
        setVisible(msg.visible ?? false);
      }
    };

    port.onMessage.addListener(handle);
    chrome.runtime.onMessage.addListener(handle);
    return () => {
      port.onMessage.removeListener(handle);
      chrome.runtime.onMessage.removeListener(handle);
    };
  }, []);

  return (
    <div className="font-sans min-w-[400px] min-h-[300px] w-full h-svh bg-[#343a40] text-white overflow-hidden">
      <SearchForm value={text} onChange={setText} />
      <Dict text={visible ? text : undefined} />
    </div>
  );
};
