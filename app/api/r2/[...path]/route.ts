import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

interface CloudflareEnv {
	NEXT_INC_CACHE_R2_BUCKET?: {
		get: (key: string) => Promise<{ arrayBuffer(): Promise<Uint8Array> } | null>;
	};
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	try {
		const { path } = await params;
		const filename = path.join("/");

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: undefined,
		})) as { env: CloudflareEnv | undefined };

		if (!env?.NEXT_INC_CACHE_R2_BUCKET) {
			return new NextResponse("R2 not available", { status: 503 });
		}

		const r2 = env.NEXT_INC_CACHE_R2_BUCKET;
		const object = await r2.get(filename);

		if (!object) {
			return new NextResponse("File not found", { status: 404 });
		}

		const arrayBuffer = await object.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Determine content type from filename
		const ext = filename.split(".").pop()?.toLowerCase();
		const contentTypeMap: Record<string, string> = {
			jpg: "image/jpeg",
			jpeg: "image/jpeg",
			png: "image/png",
			gif: "image/gif",
			webp: "image/webp",
			svg: "image/svg+xml",
			mp4: "video/mp4",
			webm: "video/webm",
			mov: "video/quicktime",
		};

		const contentType = contentTypeMap[ext || ""] || "application/octet-stream";

		return new NextResponse(uint8Array, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("R2 GET error:", error);
		return new NextResponse("Error fetching file", { status: 500 });
	}
}
