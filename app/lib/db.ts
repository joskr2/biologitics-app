import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { SiteContent } from "@/config/site-content";
import defaultData from "../../config/site-content.json";

export const runtime = "edge";

export async function getLandingData(): Promise<SiteContent> {
	try {
		const { env } = await getCloudflareContext({ async: true });
		const kv = (env as CloudflareEnv).BIOLOGISTICS;

		if (!kv) {
			console.warn("KV not available, using default data");
			return defaultData as SiteContent;
		}

		const data = await kv.get("site-content", { type: "json" });
		return (data as SiteContent) || (defaultData as SiteContent);
	} catch (error) {
		console.error("Error fetching from KV:", error);
		return defaultData as SiteContent;
	}
}

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
		return { success: true };
	} catch (error) {
		console.error("Error saving to KV:", error);
		return { success: false, error: "Failed to save data" };
	}
}
