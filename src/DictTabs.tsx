import { type DictType } from "@/repositories";
import { useMemo } from "react";

export interface DictTabsProps {
  items: DictType["pos"];
  activeTab: number;
  onTabClick: (idx: number) => void;
}

export const DictTabs = ({ items, activeTab, onTabClick }: DictTabsProps) => {
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
