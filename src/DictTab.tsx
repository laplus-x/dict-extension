import { type DictType } from "@/repositories";
import clsx from "clsx";
import { useMemo } from "react";
import { LuBookOpenText } from "react-icons/lu";
import { MdTextFields } from "react-icons/md";

interface TranslationText {
  text: string;
  trans: string;
}

interface DictDefinitionDetailProps {
  definition: TranslationText;
  examples: TranslationText[];
}

const DictDefinitionDetail: React.FC<DictDefinitionDetailProps> = ({
  definition,
  examples,
}) => {
  return (
    <div className="pt-2">
      <div className="flex items-center gap-2 p-1 border-b">
        <MdTextFields />
        <strong className="text-sm">Definition</strong>
      </div>
      <div className="flex flex-col text-sm">
        <span>{definition.text}</span>
        <span className="text-neutral-300">{definition.trans}</span>
      </div>
      {examples.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center gap-2 p-1 border-b">
            <LuBookOpenText />
            <strong className="text-sm">Example</strong>
          </div>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {examples.map((ex) => (
              <li key={ex.text} className="flex flex-col text-sm">
                <span>{ex.text}</span>
                <span className="text-neutral-300">{ex.trans}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface DictTabDetailProp {
  pos: string;
  definitions: DictDefinitionDetailProps[];
}

const DictTabDetail: React.FC<DictTabDetailProp> = ({ pos, definitions }) => {
  return (
    <div className="w-full">
      <strong className="text-base font-semibold">{pos}</strong>
      {definitions.length > 0 && (
        <div className="mt-2 space-y-3">
          {definitions.map((d) => (
            <DictDefinitionDetail key={d.definition.text} {...d} />
          ))}
        </div>
      )}
    </div>
  );
};

export interface DictTabProps {
  items: DictType["pos"];
  activeTab: number;
  onTabClick: (idx: number) => void;
}

export const DictTab: React.FC<DictTabProps> = ({
  items,
  activeTab,
  onTabClick,
}) => {
  const item = useMemo(() => items.at(activeTab), [items, activeTab]);

  return (
    <div className="flex pt-2 gap-2">
      {item && <DictTabDetail {...item} />}
      <div className="pt-2 h-full sticky top-0">
        <div className="flex flex-col gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onTabClick(idx)}
              className={clsx(
                "size-8 text-sm font-medium rounded-full cursor-pointer",
                activeTab === idx
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-300 text-neutral-700"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
