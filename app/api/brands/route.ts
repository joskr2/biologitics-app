import type { BrandItem } from "@/config/site-content";
import { withAdminAuth } from "@/lib/api/auth";
import { createRepository } from "@/lib/api/crud-repository";
import { handleCreate, handleGetAll } from "@/lib/api/route-handlers";
import { validations } from "@/lib/validations";

const brandsRepository = createRepository<BrandItem & { href?: string }>({
	sectionKey: "featuredBrands",
	defaultItems: [],
	idGenerator: (data) => {
		const name = String(data.name || "nueva-marca");
		const baseId = name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
		return `${baseId}-${Date.now().toString(36)}`;
	},
	validateOnCreate: (data) => validations.brand(data),
});

const handlerConfig = {
	repository: brandsRepository,
	resourceName: "brand",
	requiredFields: ["name", "description"],
};

export async function GET() {
	return handleGetAll<BrandItem>(handlerConfig);
}

export const POST = withAdminAuth(async (request: Request) => {
	return handleCreate<BrandItem>(request, handlerConfig);
});
