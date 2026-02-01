import { HiVolumeUp } from "react-icons/hi";

import { type DictType } from "@/repositories";

interface DictPronDetailProps {
  name: string;
  audio: string;
  ipa: string;
}

const DictPronDetail: React.FC<DictPronDetailProps> = ({ name, audio, ipa }) => {
  const play = (url: string) => {
    new Audio(url).play();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm uppercase">{name}</span>
      {audio && (
        <button className="cursor-pointer" onClick={() => play(audio)}>
          <HiVolumeUp className="w-5 h-5 text-amber-600" />
        </button>
      )}
      {ipa && <span className="text-sm font-medium">{ipa}</span>}
    </div>
  );
};

export interface DictPronProps {
  data: DictType["pron"];
}

export const DictPron: React.FC<DictPronProps> = ({ data }) => {
  return (
    <div className="flex gap-4">
      {Object.entries(data).map(([key, value]) => (
        value.ipa && <DictPronDetail key={key} name={key} audio={value.audio} ipa={value.ipa} />
      ))}
    </div>
  );
};
