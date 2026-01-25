import type { BrandItem } from "@/config/site-content";
import { createRepository } from "@/lib/api/crud-repository";
import { handleCreate, handleGetAll } from "@/lib/api/route-handlers";

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
	validateOnCreate: (data) => {
		if (!data.name || !data.description) {
			return {
				valid: false,
				error: "Missing required fields: name, description",
			};
		}
		return { valid: true };
	},
});

const handlerConfig = {
	repository: brandsRepository,
	resourceName: "brand",
	requiredFields: ["name", "description"],
};

export async function GET() {
	return handleGetAll<BrandItem>(handlerConfig);
}

export async function POST(request: Request) {
	return handleCreate<BrandItem>(request, handlerConfig);
}
