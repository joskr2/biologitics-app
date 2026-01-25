import type { TeamMember } from "@/config/site-content";
import { createRepository } from "@/lib/api/crud-repository";
import { handleCreate, handleGetAll } from "@/lib/api/route-handlers";

const teamRepository = createRepository<TeamMember>({
	sectionKey: "featuredTeam",
	defaultItems: [],
	idGenerator: (data) => {
		const name = String(data.name || "nuevo-miembro");
		const baseId = name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
		return `${baseId}-${Date.now().toString(36)}`;
	},
	validateOnCreate: (data) => {
		if (!data.name || !data.role || !data.email) {
			return {
				valid: false,
				error: "Missing required fields: name, role, email",
			};
		}
		return { valid: true };
	},
});

const handlerConfig = {
	repository: teamRepository,
	resourceName: "team member",
	requiredFields: ["name", "role", "email"],
};

export async function GET() {
	return handleGetAll<TeamMember>(handlerConfig);
}

export async function POST(request: Request) {
	return handleCreate<TeamMember>(request, handlerConfig);
}
