import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { ClientItem } from "@/config/site-content";
import defaultData from "../../../../config/site-content.json";

interface ClientResponse {
	success: boolean;
	data?: ClientItem;
	error?: string;
}

// GET /api/clients/[id] - Get client by ID
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

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

		const client = clients.find((c) => c.id === id);

		if (!client) {
			return NextResponse.json<ClientResponse>(
				{ success: false, error: "Client not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json<ClientResponse>(
			{ success: true, data: client },
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
		);
	} catch {
		return NextResponse.json<ClientResponse>(
			{ success: false, error: "Failed to fetch client" },
			{ status: 500 },
		);
	}
}

// PUT /api/clients/[id] - Update client by ID
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = (await request.json()) as Partial<ClientItem>;

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredClients" in data) {
				const siteContent = data as {
					featuredClients: { items: ClientItem[] };
				};
				const clients = siteContent.featuredClients.items;
				const clientIndex = clients.findIndex((c) => c.id === id);

				if (clientIndex === -1) {
					return NextResponse.json<ClientResponse>(
						{ success: false, error: "Client not found" },
						{ status: 404 },
					);
				}

				const updatedClient: ClientItem = {
					id,
					name: body.name ?? clients[clientIndex].name,
					logo: body.logo ?? clients[clientIndex].logo,
					type: body.type ?? clients[clientIndex].type,
				};

				const updatedClients = [...clients];
				updatedClients[clientIndex] = updatedClient;

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

				return NextResponse.json({ success: true, data: updatedClient });
			}
		}

		// In development without KV
		return NextResponse.json({
			success: true,
			data: { id, ...body },
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error updating client:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update client" },
			{ status: 500 },
		);
	}
}

// DELETE /api/clients/[id] - Delete client by ID
export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredClients" in data) {
				const siteContent = data as {
					featuredClients: { items: ClientItem[] };
				};
				const clients = siteContent.featuredClients.items;
				const clientIndex = clients.findIndex((c) => c.id === id);

				if (clientIndex === -1) {
					return NextResponse.json<ClientResponse>(
						{ success: false, error: "Client not found" },
						{ status: 404 },
					);
				}

				const updatedClients = clients.filter((c) => c.id !== id);

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

				return NextResponse.json({ success: true });
			}
		}

		// In development without KV
		return NextResponse.json({
			success: true,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error deleting client:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to delete client" },
			{ status: 500 },
		);
	}
}
