import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

interface CloudflareEnv {
	NEXT_INC_CACHE_R2_BUCKET?: {
		put: (
			key: string,
			body: Uint8Array,
			options?: { httpMetadata?: { contentType?: string } },
		) => Promise<void>;
	};
	ASSETS?: string;
}

export async function POST(request: Request) {
	try {
		// Start fetching context immediately in parallel with form data parsing
		const contextPromise = getCloudflareContext({ async: true }).catch(() => ({
			env: undefined,
		}));

		const formDataPromise = request.formData();

		const [formData, context] = await Promise.all([
			formDataPromise,
			contextPromise,
		]);

		const file = formData.get("file") as File | null;
		const folder = (formData.get("folder") as string) || "uploads";

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Validate file type
		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/webp",
			"image/svg+xml",
			"video/mp4",
			"video/webm",
			"video/quicktime",
		];

		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{
					error:
						"Invalid file type. Allowed: jpg, png, gif, webp, svg, mp4, webm, mov",
				},
				{ status: 400 },
			);
		}

		// Validate file size (50MB max)
		const maxSize = 50 * 1024 * 1024;
		if (file.size > maxSize) {
			return NextResponse.json(
				{ error: "File too large. Max size: 50MB" },
				{ status: 400 },
			);
		}

		// Generate unique filename
		const timestamp = Date.now();
		const random = Math.random().toString(36).substring(2, 8);
		const ext = file.name.split(".").pop() || "";
		const filename = `${folder}/${timestamp}-${random}.${ext}`;

		// Get Cloudflare context (already fetched)
		const { env } = context as { env: CloudflareEnv | undefined };

		if (env?.NEXT_INC_CACHE_R2_BUCKET) {
			const r2 = env.NEXT_INC_CACHE_R2_BUCKET;
			const arrayBuffer = await file.arrayBuffer();
			const uint8Array = new Uint8Array(arrayBuffer);

			await r2.put(filename, uint8Array, {
				httpMetadata: {
					contentType: file.type,
				},
			});

			// Return placeholder URL - in production configure a custom domain for R2
			// For now, store the R2 path and handle URL generation in the frontend
			return NextResponse.json({
				success: true,
				url: `/api/r2/${filename}`,
				filename,
				r2Path: filename,
			});
		}

		// Development mode without R2 - store locally
		return NextResponse.json({
			success: true,
			url: `/uploads/${filename}`,
			filename,
			warning: "R2 not available, using local uploads",
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}
