import type { ProductItem } from "@/config/site-content";
import { createRepository } from "@/lib/api/crud-repository";
import {
	extractId,
	handleDelete,
	handleGetById,
	handleUpdate,
} from "@/lib/api/route-handlers";

const productsRepository = createRepository<ProductItem>({
	sectionKey: "featuredProducts",
	defaultItems: [],
	idGenerator: (data) => {
		const title = String(data.title || "");
		return title
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	},
});

const handlerConfig = {
	repository: productsRepository,
	resourceName: "product",
};

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleGetById<ProductItem>(id, handlerConfig);
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleUpdate<ProductItem>(id, request, handlerConfig);
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleDelete<ProductItem>(id, handlerConfig);
}
