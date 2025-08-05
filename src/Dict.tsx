import { useAsync, useInstance } from "@/components";
import { Cambridge, type DictType } from "@/repositories";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export const Skeleton = ({ lines = 8, className, ...props }: SkeletonProps) => {
  return (
    <div {...props} className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-5 bg-gray-300 rounded animate-pulse"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  );
};

interface DictTabsProps {
  items: DictType["pos"];
  activeTab: number;
  onTabClick: (idx: number) => void;
}

const DictTabs = ({ items, activeTab, onTabClick }: DictTabsProps) => {
  const item = useMemo(() => items.at(activeTab), [items, activeTab]);

  return (
    <div className="flex pt-2 gap-2">
      {item && (
        <div className="w-full">
          <strong className="text-base font-semibold">{item.pos}</strong>
          {item.definitions.length > 0 && (
            <div className="mt-2 space-y-3">
              {item.definitions.map((d) => (
                <div key={d.definition.text} className="pt-2">
                  <strong className="text-sm">Definition</strong>
                  <div className="flex flex-col text-sm">
                    <span>{d.definition.text}</span>
                    <span className="text-neutral-300">
                      {d.definition.trans}
                    </span>
                  </div>
                  {d.examples.length > 0 && (
                    <div className="pt-2">
                      <strong className="text-sm">Example</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {d.examples.map((ex) => (
                          <li key={ex.text} className="flex flex-col text-sm">
                            <span>{ex.text}</span>
                            <span className="text-neutral-300">{ex.trans}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="pt-2 h-full sticky top-0">
        <div className="flex flex-col gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onTabClick(idx)}
              className={`size-8 text-sm font-medium rounded-full cursor-pointer ${
                activeTab === idx
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-300 text-neutral-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface DictPronProps {
  data: DictType["pron"];
}

const DictPron = ({ data }: DictPronProps) => {
  const playAudio = (url?: string) => {
    if (!url) return;
    new Audio(url).play();
  };

  return (
    <div className="flex gap-4">
      {Object.entries(data).map(
        ([key, value]) =>
          value.ipa && (
            <div key={key} className="flex flex-wrap items-center gap-2">
              <span className="text-sm uppercase">{key}</span>
              {value.audio && (
                <button
                  className="cursor-pointer"
                  onClick={() => playAudio(value.audio)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-amber-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3z" />
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05A4.495 4.495 0 0016.5 12z" />
                  </svg>
                </button>
              )}
              <span className="text-sm font-medium">{value.ipa}</span>
            </div>
          )
      )}
    </div>
  );
};

interface DictProps {
  text?: string;
}

export const Dict = ({ text }: DictProps) => {
  const cambridge = useInstance(Cambridge);
  const { loading, result, run } = useAsync(cambridge.query);

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
