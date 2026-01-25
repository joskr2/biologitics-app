import type { BrandItem } from "@/config/site-content";
import { createRepository } from "@/lib/api/crud-repository";
import {
	extractId,
	handleDelete,
	handleGetById,
	handleUpdate,
} from "@/lib/api/route-handlers";

const brandsRepository = createRepository<BrandItem & { href?: string }>({
	sectionKey: "featuredBrands",
	defaultItems: [],
	idGenerator: (data) => {
		const name = String(data.name || "");
		return name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	},
});

const handlerConfig = {
	repository: brandsRepository,
	resourceName: "brand",
};

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleGetById<BrandItem>(id, handlerConfig);
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleUpdate<BrandItem>(id, request, handlerConfig);
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleDelete<BrandItem>(id, handlerConfig);
}
