import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { TeamMember } from "@/config/site-content";
import defaultData from "../../../../config/site-content.json";

interface TeamMemberResponse {
	success: boolean;
	data?: TeamMember;
	error?: string;
}

// GET /api/team/[id] - Get team member by ID
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		let team: TeamMember[];

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });
			if (data && typeof data === "object" && "featuredTeam" in data) {
				team = (data as { featuredTeam: { items: TeamMember[] } })
					.featuredTeam.items;
			} else {
				team = defaultData.featuredTeam.items;
			}
		} else {
			team = defaultData.featuredTeam.items;
		}

		const member = team.find((m) => m.id === id);

		if (!member) {
			return NextResponse.json<TeamMemberResponse>(
				{ success: false, error: "Team member not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json<TeamMemberResponse>(
			{ success: true, data: member },
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
		);
	} catch {
		return NextResponse.json<TeamMemberResponse>(
			{ success: false, error: "Failed to fetch team member" },
			{ status: 500 },
		);
	}
}

// PUT /api/team/[id] - Update team member by ID
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = (await request.json()) as Partial<TeamMember>;

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredTeam" in data) {
				const siteContent = data as {
					featuredTeam: { items: TeamMember[] };
				};
				const team = siteContent.featuredTeam.items;
				const memberIndex = team.findIndex((m) => m.id === id);

				if (memberIndex === -1) {
					return NextResponse.json<TeamMemberResponse>(
						{ success: false, error: "Team member not found" },
						{ status: 404 },
					);
				}

				const updatedMember: TeamMember = {
					id,
					name: body.name ?? team[memberIndex].name,
					role: body.role ?? team[memberIndex].role,
					photo: body.photo ?? team[memberIndex].photo,
					email: body.email ?? team[memberIndex].email,
					phone: body.phone ?? team[memberIndex].phone,
				};

				const updatedTeam = [...team];
				updatedTeam[memberIndex] = updatedMember;

				await kv.put(
					"site-content",
					JSON.stringify({
						...siteContent,
						featuredTeam: {
							...siteContent.featuredTeam,
							items: updatedTeam,
						},
					}),
				);

				return NextResponse.json({ success: true, data: updatedMember });
			}
		}

		// In development without KV
		return NextResponse.json({
			success: true,
			data: { id, ...body },
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error updating team member:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update team member" },
			{ status: 500 },
		);
	}
}

// DELETE /api/team/[id] - Delete team member by ID
export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredTeam" in data) {
				const siteContent = data as {
					featuredTeam: { items: TeamMember[] };
				};
				const team = siteContent.featuredTeam.items;
				const memberIndex = team.findIndex((m) => m.id === id);

				if (memberIndex === -1) {
					return NextResponse.json<TeamMemberResponse>(
						{ success: false, error: "Team member not found" },
						{ status: 404 },
					);
				}

				const updatedTeam = team.filter((m) => m.id !== id);

				await kv.put(
					"site-content",
					JSON.stringify({
						...siteContent,
						featuredTeam: {
							...siteContent.featuredTeam,
							items: updatedTeam,
						},
					}),
				);

				return NextResponse.json({ success: true });
			}
		}

		// In development without KV
		return NextResponse.json({
			success: true,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error deleting team member:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to delete team member" },
			{ status: 500 },
		);
	}
}
