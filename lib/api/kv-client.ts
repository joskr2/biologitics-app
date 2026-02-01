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

/**
 * KVClient for managing site content with individual keys per section.
 *
 * Race Condition Mitigation:
 * - Each section uses its own KV key (e.g., "featuredBrands:site-content")
 * - This prevents concurrent writes to different sections from overwriting each other
 * - Writes to the same section are still subject to race conditions, but:
 *   a) The window is smaller (less data to merge)
 *   b) Only that section is affected, not the entire site content
 *   c) Individual section writes are less frequent than full-site writes
 */
export class KVClient {
	private sectionKey: string;
	private defaultItems: unknown[];
	private cacheHeaders: CacheHeaders;
	private kvKey: string; // Individual key for this section

	constructor(config: KVClientConfig) {
		this.sectionKey = config.sectionKey;
		this.defaultItems = config.defaultItems;
		this.cacheHeaders = config.cacheHeaders || {};
		// Use individual key per section to prevent cross-section race conditions
		this.kvKey = `${this.sectionKey}:site-content`;
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
			// Read from individual section key
			const data = await kv.get(this.kvKey, { type: "json" });

			if (data && Array.isArray(data)) {
				return data as T[];
			}
		}

		return this.defaultItems as T[];
	}

	/**
	 * Atomic get-modify-put operation for the section.
	 *
	 * Note: Cloudflare KV doesn't support transactions. This implementation:
	 * 1. Reads the current value from the section's individual key
	 * 2. Merges with the new items
	 * 3. Writes back to the same individual key
	 *
	 * Since each section has its own key, concurrent writes to different
	 * sections are completely isolated. Writes to the same section may still
	 * race, but this is acceptable for this use case as the impact is limited
	 * to that single section.
	 */
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

			// Read current value from individual key
			const existingData = await kv.get(this.kvKey, { type: "json" });

			let mergedItems: T[];

			if (existingData && Array.isArray(existingData)) {
				// Merge strategy: New items are added to existing list
				// This preserves items that might have been added by other operations
				const existingItems = existingData as T[];
				const newItemIds = new Set(
					items.map((item) => (item as { id: string }).id).filter(Boolean),
				);

				// Keep existing items that are not being replaced
				const preservedItems = existingItems.filter((item) => {
					const id = (item as { id: string }).id;
					// Keep if it doesn't have an ID (edge case) or if it's not in the new items
					return !id || !newItemIds.has(id);
				});

				mergedItems = [...preservedItems, ...items];
			} else {
				// No existing data, use new items
				mergedItems = items;
			}

			// Write to individual section key (isolated from other sections)
			await kv.put(this.kvKey, JSON.stringify(mergedItems));

			return { success: true, data: items[0] };
		} catch (error) {
			console.error(`KV put error for ${this.sectionKey}:`, error);
			return {
				success: false,
				error: `Failed to save ${this.sectionKey}`,
			};
		}
	}

	/**
	 * Atomically replace all items for this section.
	 * Use this when you want to completely replace the section data.
	 *
	 * This is safer than merge when you have the complete current state,
	 * as it avoids race conditions where you might be working with stale data.
	 */
	async replace<T>(items: T[]): Promise<KVOperationResult<T>> {
		const env = await this.getEnv();

		if (!env) {
			return {
				success: true,
				warning: "KV not available, data not persisted",
			};
		}

		try {
			const kv = env.BIOLOGISTICS;
			// Directly replace with no read-first (caller must ensure they have latest)
			await kv.put(this.kvKey, JSON.stringify(items));
			return { success: true, data: items[0] };
		} catch (error) {
			console.error(`KV replace error for ${this.sectionKey}:`, error);
			return {
				success: false,
				error: `Failed to replace ${this.sectionKey}`,
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

// Individual KV clients per section - each uses its own isolated key
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
