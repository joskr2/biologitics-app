import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { ProductItem } from "@/config/site-content";
import defaultData from "../../../config/site-content.json";

interface ProductsResponse {
	success: boolean;
	data?: ProductItem[];
	error?: string;
}

// GET /api/products - Get all products
export async function GET() {
	try {
		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		let products: ProductItem[];

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });
			if (data && typeof data === "object" && "featuredProducts" in data) {
				products = (data as { featuredProducts: { items: ProductItem[] } })
					.featuredProducts.items;
			} else {
				products = defaultData.featuredProducts.items;
			}
		} else {
			products = defaultData.featuredProducts.items;
		}

		return NextResponse.json<ProductsResponse>(
			{ success: true, data: products },
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
		);
	} catch {
		return NextResponse.json<ProductsResponse>(
			{ success: false, error: "Failed to fetch products" },
			{ status: 500 },
		);
	}
}

// POST /api/products - Add a new product
export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			id?: string;
			title?: string;
			description?: string;
			image?: string;
			features?: string[];
		};

		// Validate required fields
		if (!body.title || !body.description || !body.image) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing required fields: title, description, image",
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
			body.title
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");

		const newProduct: ProductItem = {
			id,
			title: body.title,
			description: body.description,
			image: body.image,
			features: body.features || [],
		};

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredProducts" in data) {
				const siteContent = data as {
					featuredProducts: { items: ProductItem[] };
				};
				const updatedProducts = [
					...siteContent.featuredProducts.items,
					newProduct,
				];

				await kv.put(
					"site-content",
					JSON.stringify({
						...siteContent,
						featuredProducts: {
							...siteContent.featuredProducts,
							items: updatedProducts,
						},
					}),
				);

				return NextResponse.json({ success: true, data: newProduct });
			}
		}

		// In development without KV, just return the new product
		return NextResponse.json({
			success: true,
			data: newProduct,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error creating product:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to create product" },
			{ status: 500 },
		);
	}
}
