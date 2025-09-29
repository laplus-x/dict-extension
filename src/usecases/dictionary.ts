import { CacheManager, Cambridge, type AutocompleteType, type DictType } from "@/repositories";
import { boundMethod } from 'autobind-decorator';

export class Dictionary {
    private readonly cambridge: Cambridge;

    private static instance?: Dictionary;
    private readonly cacheManager = new CacheManager();

    constructor(cambridge: Cambridge) {
        this.cambridge = cambridge
    }

    public static getInstance(cambridge: Cambridge) {
        this.instance ??= new Dictionary(cambridge);
        return this.instance
    }

    @boundMethod
    public async autocomplete(word: string): Promise<AutocompleteType[]> {
        const prefix = "autocomplete:";
        const cached = this.cacheManager.get<AutocompleteType[]>(word, { prefix });
        if (cached) return Promise.resolve(cached);

        const result = await this.cambridge.autocomplete(word)
        this.cacheManager.set(word, result, { prefix })
        return result
    }

    @boundMethod
    public async query(word: string): Promise<DictType> {
        const prefix = "query:";
        const cached = this.cacheManager.get<DictType>(word, { prefix });
        if (cached) return Promise.resolve(cached);

        const result = await this.cambridge.query(word)
        this.cacheManager.set<DictType>(word, result, { prefix })
        return result
    }
}