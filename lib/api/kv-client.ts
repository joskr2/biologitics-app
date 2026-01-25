import { getCloudflareContext } from "@opennextjs/cloudflare";
import defaultData from "../../config/site-content.json";

export interface KVEnv {
	BIOLOGISTICS: KVNamespace;
}

export interface CacheHeaders {
	"Cache-Control"?: string;
}

export interface SiteSection<T> {
	items: T[];
	title?: string;
	subtitle?: string;
}

export interface KVClientConfig {
	sectionKey: string;
	defaultItems: unknown[];
	cacheHeaders?: CacheHeaders;
}

export interface KVOperationResult<T> {
	data?: T;
	warning?: string;
	success: boolean;
	error?: string;
}

export class KVClient {
	private sectionKey: string;
	private defaultItems: unknown[];
	private cacheHeaders: CacheHeaders;

	constructor(config: KVClientConfig) {
		this.sectionKey = config.sectionKey;
		this.defaultItems = config.defaultItems;
		this.cacheHeaders = config.cacheHeaders || {};
	}

	private async getEnv(): Promise<KVEnv | null> {
		try {
			const { env } = await getCloudflareContext({ async: true }).catch(() => ({
				env: null,
			}));
			return (env as KVEnv) || null;
		} catch {
			return null;
		}
	}

	async get<T>(): Promise<T[]> {
		const env = await this.getEnv();

		if (env) {
			const kv = env.BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && this.sectionKey in data) {
				const section = data as Record<string, { items: T[] }>;
				return section[this.sectionKey].items;
			}
		}

		const defaultSection = (
			defaultData as unknown as Record<string, { items: T[] }>
		)[this.sectionKey];
		return defaultSection?.items || (this.defaultItems as T[]);
	}

	async put<T>(items: T[]): Promise<KVOperationResult<T>> {
		const env = await this.getEnv();

		if (!env) {
			return {
				success: true,
				warning: "KV not available, data not persisted",
			};
		}

		try {
			const kv = env.BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object") {
				const siteContent = data as Record<string, unknown>;
				const updatedContent = {
					...siteContent,
					[this.sectionKey]: {
						...(siteContent[this.sectionKey] as object),
						items,
					},
				};

				await kv.put("site-content", JSON.stringify(updatedContent));

				return { success: true, data: items[0] };
			}

			return {
				success: true,
				warning: "KV data structure unexpected, data not persisted",
			};
		} catch (error) {
			console.error(`KV put error for ${this.sectionKey}:`, error);
			return {
				success: false,
				error: `Failed to save ${this.sectionKey}`,
			};
		}
	}

	getCacheHeaders(): CacheHeaders {
		return this.cacheHeaders;
	}

	buildResponseHeaders(): Record<string, string> {
		const headers: Record<string, string> = {};
		if (this.cacheHeaders["Cache-Control"]) {
			headers["Cache-Control"] = this.cacheHeaders["Cache-Control"];
		}
		return headers;
	}
}

export function createKVClient(config: KVClientConfig): KVClient {
	return new KVClient(config);
}

export const brandsKV = createKVClient({
	sectionKey: "featuredBrands",
	defaultItems: (defaultData as { featuredBrands: { items: unknown[] } })
		.featuredBrands.items,
	cacheHeaders: {
		"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
	},
});

export const clientsKV = createKVClient({
	sectionKey: "featuredClients",
	defaultItems: (defaultData as { featuredClients: { items: unknown[] } })
		.featuredClients.items,
	cacheHeaders: {
		"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
	},
});

export const teamKV = createKVClient({
	sectionKey: "featuredTeam",
	defaultItems: (defaultData as { featuredTeam: { items: unknown[] } })
		.featuredTeam.items,
	cacheHeaders: {
		"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
	},
});

export const productsKV = createKVClient({
	sectionKey: "featuredProducts",
	defaultItems: (defaultData as { featuredProducts: { items: unknown[] } })
		.featuredProducts.items,
	cacheHeaders: {
		"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
	},
});
