import type { ProductItem } from "@/config/site-content";
import { createRepository } from "@/lib/api/crud-repository";
import { handleCreate, handleGetAll } from "@/lib/api/route-handlers";

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
	validateOnCreate: (data) => {
		if (!data.title || !data.description || !data.image) {
			return {
				valid: false,
				error: "Missing required fields: title, description, image",
			};
		}
		return { valid: true };
	},
});

const handlerConfig = {
	repository: productsRepository,
	resourceName: "product",
	requiredFields: ["title", "description", "image"],
};

export async function GET() {
	return handleGetAll<ProductItem>(handlerConfig);
}

export async function POST(request: Request) {
	return handleCreate<ProductItem>(request, handlerConfig);
}
