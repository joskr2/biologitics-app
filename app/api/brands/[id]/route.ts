import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { BrandItem } from "@/config/site-content";
import defaultData from "../../../../config/site-content.json";

interface BrandResponse {
	success: boolean;
	data?: BrandItem;
	error?: string;
}

// GET /api/brands/[id] - Get brand by ID
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

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

		const brand = brands.find((b) => b.id === id);

		if (!brand) {
			return NextResponse.json<BrandResponse>(
				{ success: false, error: "Brand not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json<BrandResponse>(
			{ success: true, data: brand },
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
		);
	} catch {
		return NextResponse.json<BrandResponse>(
			{ success: false, error: "Failed to fetch brand" },
			{ status: 500 },
		);
	}
}

// PUT /api/brands/[id] - Update brand by ID
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = (await request.json()) as Partial<BrandItem>;

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredBrands" in data) {
				const siteContent = data as {
					featuredBrands: { items: BrandItem[] };
				};
				const brands = siteContent.featuredBrands.items;
				const brandIndex = brands.findIndex((b) => b.id === id);

				if (brandIndex === -1) {
					return NextResponse.json<BrandResponse>(
						{ success: false, error: "Brand not found" },
						{ status: 404 },
					);
				}

				const updatedBrand: BrandItem = {
					id,
					name: body.name ?? brands[brandIndex].name,
					logo: body.logo ?? brands[brandIndex].logo,
					description: body.description ?? brands[brandIndex].description,
					bestSellers: body.bestSellers ?? brands[brandIndex].bestSellers,
					href: body.href ?? brands[brandIndex].href,
				};

				const updatedBrands = [...brands];
				updatedBrands[brandIndex] = updatedBrand;

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

				return NextResponse.json({ success: true, data: updatedBrand });
			}
		}

		// In development without KV
		return NextResponse.json({
			success: true,
			data: { id, ...body },
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error updating brand:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update brand" },
			{ status: 500 },
		);
	}
}

// DELETE /api/brands/[id] - Delete brand by ID
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

			if (data && typeof data === "object" && "featuredBrands" in data) {
				const siteContent = data as {
					featuredBrands: { items: BrandItem[] };
				};
				const brands = siteContent.featuredBrands.items;
				const brandIndex = brands.findIndex((b) => b.id === id);

				if (brandIndex === -1) {
					return NextResponse.json<BrandResponse>(
						{ success: false, error: "Brand not found" },
						{ status: 404 },
					);
				}

				const updatedBrands = brands.filter((b) => b.id !== id);

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

				return NextResponse.json({ success: true });
			}
		}

		// In development without KV
		return NextResponse.json({
			success: true,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error deleting brand:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to delete brand" },
			{ status: 500 },
		);
	}
}
