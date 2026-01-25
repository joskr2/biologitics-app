import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { ClientItem } from "@/config/site-content";
import defaultData from "../../../config/site-content.json";

interface ClientsResponse {
	success: boolean;
	data?: ClientItem[];
	error?: string;
}

// GET /api/clients - Get all clients
export async function GET() {
	try {
		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		let clients: ClientItem[];

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });
			if (data && typeof data === "object" && "featuredClients" in data) {
				clients = (data as { featuredClients: { items: ClientItem[] } })
					.featuredClients.items;
			} else {
				clients = defaultData.featuredClients.items;
			}
		} else {
			clients = defaultData.featuredClients.items;
		}

		return NextResponse.json<ClientsResponse>(
			{ success: true, data: clients },
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
		);
	} catch {
		return NextResponse.json<ClientsResponse>(
			{ success: false, error: "Failed to fetch clients" },
			{ status: 500 },
		);
	}
}

// POST /api/clients - Add a new client
export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			id?: string;
			name?: string;
			logo?: string;
			type?: string;
		};

		// Validate required fields
		if (!body.name || !body.logo) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing required fields: name, logo",
				},
				{ status: 400 },
			);
		}

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		// Generate ID if not provided
		const id =
			body.id ||
			body.name
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");

		const newClient: ClientItem = {
			id,
			name: body.name,
			logo: body.logo,
			type: body.type || "",
		};

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredClients" in data) {
				const siteContent = data as {
					featuredClients: { items: ClientItem[] };
				};
				const updatedClients = [...siteContent.featuredClients.items, newClient];

				await kv.put(
					"site-content",
					JSON.stringify({
						...siteContent,
						featuredClients: {
							...siteContent.featuredClients,
							items: updatedClients,
						},
					}),
				);

				return NextResponse.json({ success: true, data: newClient });
			}
		}

		// In development without KV, just return the new client
		return NextResponse.json({
			success: true,
			data: newClient,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error creating client:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to create client" },
			{ status: 500 },
		);
	}
}
