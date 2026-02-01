import type { ProductItem } from "@/config/site-content";
import { withAdminAuth } from "@/lib/api/auth";
import { createRepository } from "@/lib/api/crud-repository";
import { handleCreate, handleGetAll } from "@/lib/api/route-handlers";
import { validations } from "@/lib/validations";

const productsRepository = createRepository<ProductItem>({
	sectionKey: "featuredProducts",
	defaultItems: [],
	idGenerator: (data) => {
		const title = String(data.title || "nuevo-producto");
		const baseId = title
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
		return `${baseId}-${Date.now().toString(36)}`;
	},
	validateOnCreate: (data) => validations.product(data),
});

const handlerConfig = {
	repository: productsRepository,
	resourceName: "product",
	requiredFields: ["title", "description", "image"],
};

export async function GET() {
	return handleGetAll<ProductItem>(handlerConfig);
}

export const POST = withAdminAuth(async (request: Request) => {
	return handleCreate<ProductItem>(request, handlerConfig);
});
