import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import { cache } from "@/app/lib/db";
import type { SiteContent } from "@/config/site-content";
import { withAdminAuth } from "@/lib/api/auth";
import defaultData from "../../../config/site-content.json";

export async function GET() {
	try {
		// Try to get data from KV
		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });
			if (data) {
				console.log("[site-content] Data loaded from KV");
				return NextResponse.json(data, {
					headers: {
						"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
					},
				});
			}
			console.log("[site-content] No data in KV, using default");
		}

		// Fallback to default data
		console.log("[site-content] Using default data from JSON");
		return NextResponse.json(defaultData as SiteContent, {
			headers: {
				"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
			},
		});
	} catch (error) {
		console.log("[site-content] KV error, using default:", error);
		return NextResponse.json(defaultData as SiteContent);
	}
}

// DELETE: Clear cached data and reset to defaults (admin only)
export const DELETE = withAdminAuth(async () => {
	try {
		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			// Delete the corrupted site-content key
			await kv.delete("site-content");
			// Clear the in-memory cache
			cache.delete("site-content");
			console.log("[site-content] Cache cleared, will use default data");
		}

		return NextResponse.json({ success: true, message: "Cache cleared" });
	} catch (error) {
		console.error("[site-content] Error clearing cache:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to clear cache" },
			{ status: 500 },
		);
	}
});

export const POST = withAdminAuth(async (request: Request) => {
	try {
		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = (await request.json()) as SiteContent;
			await kv.put("site-content", JSON.stringify(data));
			return NextResponse.json(
				{ success: true, data },
				{
					headers: {
						"Cache-Control": "no-store, must-revalidate",
					},
				},
			);
		}

		// In development without KV, save to a simple file-based approach
		// For now, just return the submitted data so client can update
		const data = (await request.json()) as SiteContent;
		return NextResponse.json({
			success: true,
			data,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error saving:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to save" },
			{ status: 500 },
		);
	}
});
