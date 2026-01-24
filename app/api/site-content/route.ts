import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { SiteContent } from "@/config/site-content";
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
				return NextResponse.json(data);
			}
		}

		// Fallback to default data
		return NextResponse.json(defaultData as SiteContent);
	} catch {
		console.log("KV not available, using default data");
		return NextResponse.json(defaultData as SiteContent);
	}
}
