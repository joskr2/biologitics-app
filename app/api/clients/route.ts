import type { ClientItem } from "@/config/site-content";
import { withAdminAuth } from "@/lib/api/auth";
import { createRepository } from "@/lib/api/crud-repository";
import { handleCreate, handleGetAll } from "@/lib/api/route-handlers";
import { validations } from "@/lib/validations";

const clientsRepository = createRepository<ClientItem>({
	sectionKey: "featuredClients",
	defaultItems: [],
	idGenerator: (data) => {
		const name = String(data.name || "nuevo-cliente");
		const baseId = name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
		return `${baseId}-${Date.now().toString(36)}`;
	},
	validateOnCreate: (data) => validations.client(data),
});

const handlerConfig = {
	repository: clientsRepository,
	resourceName: "client",
	requiredFields: ["name", "logo"],
};

export async function GET() {
	return handleGetAll<ClientItem>(handlerConfig);
}

export const POST = withAdminAuth(async (request: Request) => {
	return handleCreate<ClientItem>(request, handlerConfig);
});
