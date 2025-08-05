import { Dict } from "@/Dict";
import { useEffect, useState } from "react";
import { SearchForm } from "./Form";

export const App = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const handle = (msg: Record<string, any>) => {
      console.log("Received message:", msg);
      if (msg.type === "QUERY") {
        setText(msg.text ?? "");
      } else if (msg.type === "VISIBLE") {
        setVisible(msg.visible ?? false);
      }
    };

    chrome.runtime.onMessage.addListener(handle);
    return () => {
      chrome.runtime.onMessage.removeListener(handle);
    };
  }, []);

  return (
    <div className="font-sans w-[400px] h-[300px] bg-[#343a40] text-white">
      <SearchForm value={text} onChange={setText} />
      <Dict text={visible ? text : ""} />
    </div>
  );
};
