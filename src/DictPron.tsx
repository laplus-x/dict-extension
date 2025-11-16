import { type DictType } from "@/repositories";

export interface DictPronProps {
  data: DictType["pron"];
}

export const DictPron: React.FC<DictPronProps> = ({ data }) => {
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
