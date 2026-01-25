import type { ClientItem } from "@/config/site-content";
import { createRepository } from "@/lib/api/crud-repository";
import { handleCreate, handleGetAll } from "@/lib/api/route-handlers";

const clientsRepository = createRepository<ClientItem>({
	sectionKey: "featuredClients",
	defaultItems: [],
	idGenerator: (data) => {
		const name = String(data.name || "");
		return name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	},
	validateOnCreate: (data) => {
		if (!data.name || !data.logo) {
			return { valid: false, error: "Missing required fields: name, logo" };
		}
		return { valid: true };
	},
});

const handlerConfig = {
	repository: clientsRepository,
	resourceName: "client",
	requiredFields: ["name", "logo"],
};

export async function GET() {
	return handleGetAll<ClientItem>(handlerConfig);
}

export async function POST(request: Request) {
	return handleCreate<ClientItem>(request, handlerConfig);
}
