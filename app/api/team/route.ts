import type { TeamMember } from "@/config/site-content";
import { withAdminAuth } from "@/lib/api/auth";
import { createRepository } from "@/lib/api/crud-repository";
import { handleCreate, handleGetAll } from "@/lib/api/route-handlers";
import { validations } from "@/lib/validations";

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
	validateOnCreate: (data) => validations.teamMember(data),
});

const handlerConfig = {
	repository: teamRepository,
	resourceName: "team member",
	requiredFields: ["name", "role", "email"],
};

export async function GET() {
	return handleGetAll<TeamMember>(handlerConfig);
}

export const POST = withAdminAuth(async (request: Request) => {
	return handleCreate<TeamMember>(request, handlerConfig);
});
