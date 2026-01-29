import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache as reactCache } from "react";
import type { SiteContent } from "@/config/site-content";
import defaultData from "../../config/site-content.json";

export const runtime = "edge";

// In-memory cache with TTL (works in edge environment)
interface CacheEntry {
	data: SiteContent;
	timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60000; // 1 minute TTL for cache entries

function isCacheValid(entry: CacheEntry): boolean {
	return Date.now() - entry.timestamp < CACHE_TTL;
}

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

		const data = await kv.get("site-content", { type: "json" });
		const result = (data as SiteContent) || (defaultData as SiteContent);

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

		await kv.put("site-content", JSON.stringify(data));

		// Invalidate cache so next read fetches fresh data
		cache.delete("site-content");

		return { success: true };
	} catch (error) {
		console.error("Error saving to KV:", error);
		return { success: false, error: "Failed to save data" };
	}
}
