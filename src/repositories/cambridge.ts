export interface DictType {
    link: string;
    pron: Record<string, {
        ipa: string;
        audio: string;
    }>;
    pos: DictPosType[];
}

export interface TransType {
    text: string;
    trans: string;
}

export interface DictPosType {
    pos: string;
    definitions: {
        definition: TransType;
        examples: TransType[];
    }[]
}

export interface AutocompleteType {
    word: string;
    url: string;
    beta: boolean;
}

export interface CambridgeOptions {
    dict: string
}

export class Cambridge {
    private readonly BASE: string = "https://dictionary.cambridge.org";
    private readonly options: CambridgeOptions;

    private static instance?: Cambridge;

    constructor(options: CambridgeOptions = { dict: 'english-chinese-traditional' }) {
        this.options = options
    }

    public static getInstance(options?: CambridgeOptions) {
        this.instance ??= new Cambridge(options);
        return this.instance
    }

    private parsePos(doc: Element): DictPosType {
        const pos = doc.querySelector(".dsense_h")?.textContent?.trim() || "";

        const definitions: DictPosType["definitions"] = [];
        doc.querySelectorAll(".sense-body.dsense_b").forEach(sense => {
            const definition = {
                text: sense.querySelector(".def.ddef_d")?.textContent?.trim() || "",
                trans: sense.querySelector(".trans.dtrans")?.textContent?.trim() || ""
            };
            if (!definition.text) return

            const examples: TransType[] = [];
            sense.querySelectorAll(".examp.dexamp").forEach((el) => {
                const data = {
                    text: el.querySelector(".eg.deg")?.textContent?.trim() || "",
                    trans: el.querySelector(".trans.dtrans")?.textContent?.trim() || "",
                }
                examples.push(data);
            });
            definitions.push({ definition, examples });
        });

        return {
            pos,
            definitions,
        };
    }

    private parse(html: string): DictType {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const link = doc.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.content || this.BASE;

        const pron = {
            uk: {
                ipa:
                    doc.querySelector(".uk.dpron-i .pron")?.textContent?.trim() || "",
                audio:
                    doc
                        .querySelector(".uk.dpron-i source[type='audio/mpeg']")
                        ?.getAttribute("src") ||
                    doc
                        .querySelector(".uk.dpron-i .daud")
                        ?.getAttribute("data-src-mp3") ||
                    "",
            },
            us: {
                ipa:
                    doc.querySelector(".us.dpron-i .pron")?.textContent?.trim() || "",
                audio:
                    doc
                        .querySelector(".us.dpron-i source[type='audio/mpeg']")
                        ?.getAttribute("src") ||
                    doc
                        .querySelector(".us.dpron-i .daud")
                        ?.getAttribute("data-src-mp3") ||
                    "",
            },
        };

        pron.uk.audio = pron.uk.audio ? this.BASE + pron.uk.audio : "";
        pron.us.audio = pron.us.audio ? this.BASE + pron.us.audio : "";

        const pos: DictPosType[] = [];
        doc.querySelectorAll(".pos-body .dsense").forEach(ele => {
            const data = this.parsePos(ele)
            pos.push(data)
        })

        return {
            link,
            pron,
            pos,
        };
    }

    public async autocomplete(word: string): Promise<AutocompleteType[]> {
        console.log("Autocompleting dictionary for:", word);
        const resp = await fetch(
            `${this.BASE}/zht/autocomplete/amp?dataset=${this.options.dict}&q=${word}`
        )
        if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status} - ${resp.statusText}`);
        }
        const result = await resp.json()
        return result
    }

    public async query(word: string): Promise<DictType> {
        console.log("Querying dictionary for:", word);
        const resp = await fetch(
            `${this.BASE}/dictionary/${this.options.dict}/${word}`
        )
        if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status} - ${resp.statusText}`);
        }
        const result = await resp.text();
        return this.parse(result)
    }
}