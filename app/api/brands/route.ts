import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { BrandItem } from "@/config/site-content";
import defaultData from "../../../config/site-content.json";

interface BrandsResponse {
	success: boolean;
	data?: BrandItem[];
	error?: string;
}

// GET /api/brands - Get all brands
export async function GET() {
	try {
		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		let brands: BrandItem[];

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });
			if (data && typeof data === "object" && "featuredBrands" in data) {
				brands = (data as { featuredBrands: { items: BrandItem[] } })
					.featuredBrands.items;
			} else {
				brands = defaultData.featuredBrands.items;
			}
		} else {
			brands = defaultData.featuredBrands.items;
		}

		return NextResponse.json<BrandsResponse>(
			{ success: true, data: brands },
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
		);
	} catch {
		return NextResponse.json<BrandsResponse>(
			{ success: false, error: "Failed to fetch brands" },
			{ status: 500 },
		);
	}
}

// POST /api/brands - Add a new brand
export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			id?: string;
			name?: string;
			logo?: string;
			description?: string;
			bestSellers?: Array<{ id?: string; name: string; category?: string }>;
			href?: string;
		};

		// Validate required fields
		if (!body.name || !body.description) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing required fields: name, description",
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

		// Transform bestSellers to include generated IDs
		const timestamp = Date.now().toString(36);
		const newBestSellers = (body.bestSellers || []).map((bs) => ({
			id: bs.id || `bs-${timestamp}-${Math.random().toString(36).slice(2)}`,
			name: bs.name,
			category: bs.category || "",
		}));

		const newBrand: BrandItem = {
			id,
			name: body.name,
			logo: body.logo || "",
			description: body.description,
			bestSellers: newBestSellers,
			href: body.href || "",
		};

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredBrands" in data) {
				const siteContent = data as {
					featuredBrands: { items: BrandItem[] };
				};
				const updatedBrands = [...siteContent.featuredBrands.items, newBrand];

				await kv.put(
					"site-content",
					JSON.stringify({
						...siteContent,
						featuredBrands: {
							...siteContent.featuredBrands,
							items: updatedBrands,
						},
					}),
				);

				return NextResponse.json({ success: true, data: newBrand });
			}
		}

		// In development without KV, just return the new brand
		return NextResponse.json({
			success: true,
			data: newBrand,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error creating brand:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to create brand" },
			{ status: 500 },
		);
	}
}
