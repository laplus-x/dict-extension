import { Skeleton, useDebouncedValue, useInstance } from "@/components";
import { Cambridge } from "@/repositories";
import { Dictionary } from "@/usecases";
import { useEffect, useRef, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import useSWR from "swr";
import { DictPron } from "./DictPron";
import { DictTab } from "./DictTab";

export interface DictProps {
  text?: string;
}

export const Dict: React.FC<DictProps> = ({ text = "" }: DictProps) => {
  const debouncedText = useDebouncedValue(text, { delay: 500 });
  const dictionary = useInstance(Dictionary, Cambridge.getInstance());
  const shouldQuery = debouncedText.trim().length > 1;
  const { data, error, isLoading } = useSWR(
    shouldQuery ? ["query", debouncedText] : null,
    ([_, ...args]) => dictionary.query(...args)
  );

  const ref = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if (!debouncedText) return;
    handleTabClick(0);
  }, [debouncedText]);

  const handleTabClick = (pos: number) => {
    setActiveTab(pos);
    if (!ref.current) return;
    ref.current.scrollTop = 0;
  };

  return (
    <div
      ref={ref}
      className="p-4 overflow-y-auto"
      style={{ maxHeight: "calc(100svh - 50px)" }}
    >
      {isLoading && <Skeleton />}
      {!isLoading && error && <p className="text-red-500">{error.message}</p>}
      {!isLoading && data && (
        <>
          <div className="flex justify-between w-full">
            <DictPron data={data.pron} />
            <a href={data.link} target="_blank" rel="noopener noreferrer">
              <HiOutlineExternalLink className="w-6 h-6" />
            </a>
          </div>
          <DictTab
            activeTab={activeTab}
            items={data.pos}
            onTabClick={handleTabClick}
          />
        </>
      )}
    </div>
  );
};
