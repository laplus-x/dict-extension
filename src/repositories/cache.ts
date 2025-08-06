export interface CacheEntry<T> {
    value: T;
    expireAt: number;
}

export interface CacheManagerOptions {
    ttl: number;
    maxSize: number;
    prefix?: string;
}

export class CacheManager {
    private static instance: CacheManager;
    private readonly cache = new Map<string, CacheEntry<any>>();
    private options: CacheManagerOptions;

    constructor(options: CacheManagerOptions = { ttl: 5 * 60 * 1000, maxSize: 100 }) {
        this.options = options
    }

    public static getInstance(options?: CacheManagerOptions): CacheManager {
        CacheManager.instance ??= new CacheManager(options);
        return CacheManager.instance;
    }

    public set<T>(key: string, value: T, options: Partial<Omit<CacheManagerOptions, "maxSize">> = this.options): void {
        const k = options.prefix + ":" + key;

        // 若存在先刪掉（確保 Map insertion order 更新）
        if (this.cache.has(k)) {
            this.cache.delete(k);
        }

        // 如果超過容量，刪掉最舊的
        if (this.cache.size >= this.options.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) this.cache.delete(oldestKey);
        }

        this.cache.set(k, {
            value,
            expireAt: Date.now() + (options.ttl ?? this.options.ttl),
        });
    }

    public get<T>(key: string, options: Pick<CacheManagerOptions, "prefix"> = this.options): T | undefined {
        const k = options.prefix + ":" + key;

        const entry = this.cache.get(k);
        if (!entry) return undefined;

        // 過期移除
        if (Date.now() > entry.expireAt) {
            this.cache.delete(k);
            return undefined;
        }

        // 更新 LRU：刪掉再插入
        this.cache.delete(k);
        this.cache.set(k, entry);

        return entry.value;
    }

    public has(key: string, options: Pick<CacheManagerOptions, "prefix"> = this.options): boolean {
        return this.get(key, options) !== undefined;
    }

    public delete(key: string, options: Pick<CacheManagerOptions, "prefix"> = this.options): void {
        const k = options.prefix + ":" + key;
        this.cache.delete(k);
    }

    public clear(): void {
        this.cache.clear();
    }
}
