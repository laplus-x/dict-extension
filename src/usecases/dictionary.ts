import { CacheManager, Cambridge, type AutocompleteType, type CacheManagerOptions, type DictType } from "@/repositories";
import type { ArgsFunc, Async } from "@/types";
import { boundMethod } from "autobind-decorator";

export class Dictionary {
    private readonly cambridge: Cambridge;

    private static instance?: Dictionary;
    private readonly cacheManager = new CacheManager();

    constructor(cambridge: Cambridge) {
        this.cambridge = cambridge;
    }

    public static getInstance(cambridge: Cambridge) {
        this.instance ??= new Dictionary(cambridge);
        return this.instance;
    }

    private withCache<T>(
        fn: Async<ArgsFunc<T>>,
        options: Pick<CacheManagerOptions, "prefix">
    ) {
        return async (...args: any[]) => {
            const cached = this.cacheManager.get<T>(JSON.stringify(args), options);
            if (cached) return cached;

            const result = await fn(...args);
            this.cacheManager.set(JSON.stringify(args), result, options);
            return result;
        };
    }

    @boundMethod
    public async autocomplete(word: string): Promise<AutocompleteType[]> {
        const prefix = "autocomplete:";
        const fnWithCache = this.withCache(
            this.cambridge.autocomplete.bind(this.cambridge),
            { prefix }
        );
        return await fnWithCache(word);
    }

    @boundMethod
    public async query(word: string): Promise<DictType> {
        const prefix = "query:";
        const fnWithCache = this.withCache(
            this.cambridge.query.bind(this.cambridge),
            { prefix }
        );
        return await fnWithCache(word);
    }
}
