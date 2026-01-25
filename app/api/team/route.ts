import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";
import type { TeamMember } from "@/config/site-content";
import defaultData from "../../../config/site-content.json";

interface TeamResponse {
	success: boolean;
	data?: TeamMember[];
	error?: string;
}

// GET /api/team - Get all team members
export async function GET() {
	try {
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

		return NextResponse.json<TeamResponse>(
			{ success: true, data: team },
			{
				headers: {
					"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
		);
	} catch {
		return NextResponse.json<TeamResponse>(
			{ success: false, error: "Failed to fetch team members" },
			{ status: 500 },
		);
	}
}

// POST /api/team - Add a new team member
export async function POST(request: Request) {
	try {
		const body = (await request.json()) as {
			id?: string;
			name?: string;
			role?: string;
			photo?: string;
			email?: string;
			phone?: string;
		};

		// Validate required fields
		if (!body.name || !body.role || !body.email) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing required fields: name, role, email",
				},
				{ status: 400 },
			);
		}

		const { env } = await getCloudflareContext({ async: true }).catch(() => ({
			env: null,
		}));

		// Generate ID if not provided
		const id =
			body.id ||
			body.name
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");

		const newMember: TeamMember = {
			id,
			name: body.name,
			role: body.role,
			photo: body.photo || "",
			email: body.email,
			phone: body.phone || "",
		};

		if (env && (env as CloudflareEnv).BIOLOGISTICS) {
			const kv = (env as CloudflareEnv).BIOLOGISTICS;
			const data = await kv.get("site-content", { type: "json" });

			if (data && typeof data === "object" && "featuredTeam" in data) {
				const siteContent = data as {
					featuredTeam: { items: TeamMember[] };
				};
				const updatedTeam = [...siteContent.featuredTeam.items, newMember];

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

				return NextResponse.json({ success: true, data: newMember });
			}
		}

		// In development without KV, just return the new member
		return NextResponse.json({
			success: true,
			data: newMember,
			warning: "KV not available, data not persisted",
		});
	} catch (error) {
		console.error("Error creating team member:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to create team member" },
			{ status: 500 },
		);
	}
}
