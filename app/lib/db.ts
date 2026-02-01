import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache as reactCache } from "react";
import type {
	BrandItem,
	ClientItem,
	FeaturedBrandsContent,
	FeaturedClientsContent,
	FeaturedProductsContent,
	FeaturedTeamContent,
	ProductItem,
	SiteContent,
	TeamMember,
} from "@/config/site-content";
import defaultData from "../../config/site-content.json";

export const runtime = "edge";

// Type for sections that have 'items' property
type SectionWithItems =
	| FeaturedBrandsContent
	| FeaturedProductsContent
	| FeaturedClientsContent
	| FeaturedTeamContent;

// Section key to individual KV key mapping (only for sections with items)
const SECTION_KEYS: Record<string, string> = {
	featuredBrands: "featuredBrands:site-content",
	featuredProducts: "featuredProducts:site-content",
	featuredClients: "featuredClients:site-content",
	featuredTeam: "featuredTeam:site-content",
} as const;

type SectionKeyType = keyof typeof SECTION_KEYS;

// Helper to deduplicate items by ID and ensure unique keys
function deduplicateItems<T extends { id: string }>(items: T[]): T[] {
	const seen = new Set<string>();
	const result: T[] = [];

	for (const item of items) {
		if (!seen.has(item.id)) {
			seen.add(item.id);
			result.push(item);
		} else {
			// Create a unique ID for duplicates
			const uniqueItem = {
				...item,
				id: `${item.id}-${result.length}`,
			};
			seen.add(uniqueItem.id);
			result.push(uniqueItem);
		}
	}

	return result;
}

// In-memory cache with TTL (works in edge environment)
interface CacheEntry {
	data: SiteContent;
	timestamp: number;
}

export const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 300000; // 5 minutes TTL for cache entries

function isCacheValid(entry: CacheEntry): boolean {
	return Date.now() - entry.timestamp < CACHE_TTL;
}

/**
 * Get landing page data from KV store.
 *
 * Race Condition Mitigation:
 * - Reads from individual section keys instead of single "site-content" key
 * - Each section (brands, products, clients, team) has its own isolated key
 * - Concurrent writes to different sections no longer conflict
 */
export const getLandingData = reactCache(async (): Promise<SiteContent> => {
	// Check in-memory cache first
	const cached = cache.get("site-content");
	if (cached && isCacheValid(cached)) {
		return cached.data;
	}

	try {
		const { env } = await getCloudflareContext({ async: true });
		const kv = (env as CloudflareEnv).BIOLOGISTICS;

		if (!kv) {
			console.warn("KV not available, using default data");
			return defaultData as SiteContent;
		}

		// Start with default data
		const result: SiteContent = { ...defaultData } as SiteContent;

		// Read each section from its individual key (prevents cross-section race conditions)
		const sectionNames = Object.keys(SECTION_KEYS) as SectionKeyType[];

		for (const sectionName of sectionNames) {
			const kvKey = SECTION_KEYS[sectionName];
			const data = await kv.get(kvKey, { type: "json" });

			if (data && Array.isArray(data)) {
				// Type-safe assignment based on section name
				switch (sectionName) {
					case "featuredBrands":
						result.featuredBrands = {
							...result.featuredBrands,
							items: deduplicateItems(data as BrandItem[]),
						};
						break;
					case "featuredProducts":
						result.featuredProducts = {
							...result.featuredProducts,
							items: deduplicateItems(data as ProductItem[]),
						};
						break;
					case "featuredClients":
						result.featuredClients = {
							...result.featuredClients,
							items: deduplicateItems(data as ClientItem[]),
						};
						break;
					case "featuredTeam":
						result.featuredTeam = {
							...result.featuredTeam,
							items: deduplicateItems(data as TeamMember[]),
						};
						break;
				}
			}
		}

		// Store in cache
		cache.set("site-content", {
			data: result,
			timestamp: Date.now(),
		});

		return result;
	} catch (error) {
		console.error("Error fetching from KV:", error);
		return defaultData as SiteContent;
	}
});

/**
 * Save landing page data to KV store.
 *
 * Race Condition Mitigation:
 * - Writes to individual section keys instead of single "site-content" key
 * - Each section (brands, products, clients, team) has its own isolated key
 * - Concurrent writes to different sections are completely isolated
 * - Each section write is a single atomic operation
 */
export async function saveLandingData(
	data: SiteContent,
): Promise<{ success: boolean; error?: string }> {
	try {
		const { env } = await getCloudflareContext({ async: true });
		const kv = (env as CloudflareEnv).BIOLOGISTICS;

		if (!kv) {
			console.warn("KV not available, cannot save");
			return { success: false, error: "KV not configured" };
		}

		// Write each section to its individual key (prevents race conditions)
		const sectionNames = Object.keys(SECTION_KEYS) as SectionKeyType[];

		for (const sectionName of sectionNames) {
			const kvKey = SECTION_KEYS[sectionName];
			const sectionData = data[sectionName as keyof SiteContent] as
				| SectionWithItems
				| undefined;

			if (sectionData && "items" in sectionData) {
				await kv.put(kvKey, JSON.stringify(sectionData.items));
			}
		}

		// Also save the full site-content key for the API route to read
		await kv.put("site-content", JSON.stringify(data));

		// Invalidate cache so next read fetches fresh data
		cache.delete("site-content");

		return { success: true };
	} catch (error) {
		console.error("Error saving to KV:", error);
		return { success: false, error: "Failed to save data" };
	}
}

/**
 * Save a specific section to its individual KV key.
 * This is the preferred method for saving individual sections as it
 * avoids race conditions with other section updates.
 */
export async function saveSectionData<K extends SectionKeyType>(
	section: K,
	items: SectionWithItems["items"],
): Promise<{ success: boolean; error?: string }> {
	try {
		const { env } = await getCloudflareContext({ async: true });
		const kv = (env as CloudflareEnv).BIOLOGISTICS;

		if (!kv) {
			console.warn("KV not available, cannot save");
			return { success: false, error: "KV not configured" };
		}

		const kvKey = SECTION_KEYS[section];
		await kv.put(kvKey, JSON.stringify(items));

		// Invalidate cache
		cache.delete("site-content");

		return { success: true };
	} catch (error) {
		console.error(`Error saving ${section} to KV:`, error);
		return { success: false, error: `Failed to save ${section}` };
	}
}
