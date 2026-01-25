import type { TeamMember } from "@/config/site-content";
import { createRepository } from "@/lib/api/crud-repository";
import {
	extractId,
	handleDelete,
	handleGetById,
	handleUpdate,
} from "@/lib/api/route-handlers";

const teamRepository = createRepository<TeamMember>({
	sectionKey: "featuredTeam",
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
	repository: teamRepository,
	resourceName: "team member",
};

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleGetById<TeamMember>(id, handlerConfig);
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleUpdate<TeamMember>(id, request, handlerConfig);
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const id = await extractId(params);
	return handleDelete<TeamMember>(id, handlerConfig);
}
