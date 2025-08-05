import { useAsync } from "@/components";
import { Cambridge, type DictType } from "@/repositories";
import { useEffect, useMemo, useRef, useState } from "react";

const cambridge = Cambridge.getInstance();

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
      <div className="h-full sticky top-0">
        <div className="flex flex-col gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onTabClick(idx)}
              className={`size-8 text-sm font-medium rounded-full ${
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
            <div key={key} className="flex items-center gap-2">
              <span className="text-sm uppercase">{key}</span>
              {value.audio && (
                <button className="" onClick={() => playAudio(value.audio)}>
                  🔊
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
      {loading && <p>Loading...</p>}
      {!loading && result && !result.ok && (
        <p className="text-red-500">{result.val.message}</p>
      )}
      {!loading && result && result.ok && (
        <>
          <DictPron data={result.val.pron} />
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
