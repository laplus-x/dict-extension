import { Skeleton, useAsync, useInstance } from "@/components";
import { Cambridge } from "@/repositories";
import { Dictionary } from "@/usecases";
import { useEffect, useRef, useState } from "react";
import { DictPron } from "./DictPron";
import { DictTabs } from "./DictTabs";

export interface DictProps {
  text?: string;
}

export const Dict = ({ text }: DictProps) => {
  const dictionary = useInstance(Dictionary, Cambridge.getInstance());
  const { loading, result, run } = useAsync(dictionary.query);

  const ref = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if (!text) return;
    run(text);
    handleTabClick(0);
  }, [text]);

  const handleTabClick = (pos: number) => {
    setActiveTab(pos);
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  };

  return (
    <div
      ref={ref}
      className="p-4 overflow-y-auto"
      style={{ maxHeight: "calc(100svh - 50px)" }}
    >
      {loading && <Skeleton />}
      {!loading && result && !result.ok && (
        <p className="text-red-500">{result.val.message}</p>
      )}
      {!loading && result && result.ok && (
        <>
          <div className="flex justify-between w-full">
            <DictPron data={result.val.pron} />
            <a href={result.val.link} target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6"
                />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
          <DictTabs
            activeTab={activeTab}
            items={result.val.pos}
            onTabClick={handleTabClick}
          />
        </>
      )}
    </div>
  );
};
