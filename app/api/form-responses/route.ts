import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

interface CloudflareEnv {
	NEXT_INC_CACHE_R2_BUCKET?: {
		get: (
			key: string,
		) => Promise<{ arrayBuffer(): Promise<Uint8Array> } | null>;
		put: (key: string, value: Uint8Array) => Promise<void>;
		list: (options?: { prefix?: string }) => Promise<{
			objects: Array<{ key: string; size: number; uploaded: number }>;
		}>;
	};
}

interface FormResponse {
	id: string;
	nombre: string;
	email: string;
	empresa?: string;
	telefono?: string;
	producto?: string;
	mensaje: string;
	fecha: string;
	ip?: string;
	userAgent?: string;
}

// Get list of form responses with pagination
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const offset = (page - 1) * limit;

		const { env } = (await getCloudflareContext({ async: true }).catch(() => ({
			env: undefined,
		}))) as { env: CloudflareEnv | undefined };

		if (!env?.NEXT_INC_CACHE_R2_BUCKET) {
			return new NextResponse("R2 not available", { status: 503 });
		}

		const r2 = env.NEXT_INC_CACHE_R2_BUCKET;

		// List all form response files
		const result = await r2.list({ prefix: "form-responses/" });

		// Sort by uploaded date (newest first)
		const allFiles = result.objects.sort((a, b) => b.uploaded - a.uploaded);

		// Paginate
		const paginatedFiles = allFiles.slice(offset, offset + limit);

		// Fetch content of each file
		const rawResponses = await Promise.all(
			paginatedFiles.map(async (file) => {
				const object = await r2.get(file.key);
				if (object) {
					const buffer = await object.arrayBuffer();
					const text = new TextDecoder().decode(buffer);
					return JSON.parse(text) as FormResponse;
				}
				return null;
			}),
		);

		// Filter out nulls and calculate pagination info
		const validResponses = rawResponses.filter(
			(r): r is FormResponse => r !== null,
		);
		const total = allFiles.length;
		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			data: validResponses,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			},
		});
	} catch (error) {
		console.error("Form responses GET error:", error);
		return new NextResponse("Error fetching responses", { status: 500 });
	}
}

// Save a new form response
export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			nombre?: string;
			email?: string;
			empresa?: string;
			telefono?: string;
			producto?: string;
			mensaje?: string;
		};

		// Basic validation
		if (!body.nombre || !body.email || !body.mensaje) {
			return NextResponse.json(
				{ error: "Faltan campos requeridos" },
				{ status: 400 },
			);
		}

		// Get Cloudflare context
		const { env } = (await getCloudflareContext({ async: true }).catch(() => ({
			env: undefined,
		}))) as { env: CloudflareEnv | undefined };

		if (!env?.NEXT_INC_CACHE_R2_BUCKET) {
			return new NextResponse("R2 not available", { status: 503 });
		}

		const r2 = env.NEXT_INC_CACHE_R2_BUCKET;

		// Create unique ID
		const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

		// Prepare response data
		const responseData: FormResponse = {
			id,
			nombre: body.nombre,
			email: body.email,
			empresa: body.empresa || undefined,
			telefono: body.telefono || undefined,
			producto: body.producto || undefined,
			mensaje: body.mensaje,
			fecha: new Date().toISOString(),
			ip: request.headers.get("x-forwarded-for") || undefined,
			userAgent: request.headers.get("user-agent") || undefined,
		};

		// Convert to JSON bytes
		const jsonString = JSON.stringify(responseData, null, 2);
		const encoder = new TextEncoder();
		const data = encoder.encode(jsonString);

		// Save to R2
		await r2.put(`form-responses/${id}.json`, data);

		return NextResponse.json({ success: true, id });
	} catch (error) {
		console.error("Form responses POST error:", error);
		return new NextResponse("Error saving response", { status: 500 });
	}
}
