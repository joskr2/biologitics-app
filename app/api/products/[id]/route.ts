import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { ProductItem } from "@/config/site-content";
import defaultData from "../../../../config/site-content.json";

interface ProductResponse {
	success: boolean;
	data?: ProductItem;
	error?: string;
}

// GET /api/products/[id] - Get product by ID
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

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

		const product = products.find((p) => p.id === id);

		if (!product) {
			return NextResponse.json<ProductResponse>(
				{ success: false, error: "Product not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json<ProductResponse>(
			{ success: true, data: product },
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
		);
	} catch {
		return NextResponse.json<ProductResponse>(
			{ success: false, error: "Failed to fetch product" },
			{ status: 500 },
		);
	}
}

// PUT /api/products/[id] - Update product by ID
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = (await request.json()) as Partial<ProductItem>;

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredProducts" in data) {
				const siteContent = data as {
					featuredProducts: { items: ProductItem[] };
				};
				const products = siteContent.featuredProducts.items;
				const productIndex = products.findIndex((p) => p.id === id);

				if (productIndex === -1) {
					return NextResponse.json<ProductResponse>(
						{ success: false, error: "Product not found" },
						{ status: 404 },
					);
				}

				const updatedProduct: ProductItem = {
					id,
					title: body.title ?? products[productIndex].title,
					description: body.description ?? products[productIndex].description,
					image: body.image ?? products[productIndex].image,
					features: body.features ?? products[productIndex].features,
				};

				const updatedProducts = [...products];
				updatedProducts[productIndex] = updatedProduct;

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

				return NextResponse.json({ success: true, data: updatedProduct });
			}
		}

		// In development without KV
		return NextResponse.json({
			success: true,
			data: { id, ...body },
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error updating product:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update product" },
			{ status: 500 },
		);
	}
}

// DELETE /api/products/[id] - Delete product by ID
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

			if (data && typeof data === "object" && "featuredProducts" in data) {
				const siteContent = data as {
					featuredProducts: { items: ProductItem[] };
				};
				const products = siteContent.featuredProducts.items;
				const productIndex = products.findIndex((p) => p.id === id);

				if (productIndex === -1) {
					return NextResponse.json<ProductResponse>(
						{ success: false, error: "Product not found" },
						{ status: 404 },
					);
				}

				const updatedProducts = products.filter((p) => p.id !== id);

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

				return NextResponse.json({ success: true });
			}
		}

		// In development without KV
		return NextResponse.json({
			success: true,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error deleting product:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to delete product" },
			{ status: 500 },
		);
	}
}
