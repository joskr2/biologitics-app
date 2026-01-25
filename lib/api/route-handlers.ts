import { NextResponse } from "next/server";
import type { CRUDItem, GenericCRUDRepository } from "./crud-repository";

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	warning?: string;
}

export interface HandlerConfig<T extends CRUDItem> {
	repository: GenericCRUDRepository<T>;
	resourceName: string;
	requiredFields?: string[];
}

export async function handleGetAll<T extends CRUDItem>(
	config: HandlerConfig<T>,
): Promise<NextResponse<ApiResponse<T[]>>> {
	try {
		const items = await config.repository.getAll();
		return NextResponse.json(
			{ success: true, data: items },
			{ headers: config.repository.getCacheHeaders() },
		);
	} catch {
		return NextResponse.json(
			{ success: false, error: `Failed to fetch ${config.resourceName}s` },
			{ status: 500 },
		);
	}
}

export async function handleGetById<T extends CRUDItem>(
	id: string,
	config: HandlerConfig<T>,
): Promise<NextResponse<ApiResponse<T>>> {
	try {
		const item = await config.repository.getById(id);

		if (!item) {
			return NextResponse.json(
				{ success: false, error: `${config.resourceName} not found` },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ success: true, data: item },
			{ headers: config.repository.getCacheHeaders() },
		);
	} catch {
		return NextResponse.json(
			{ success: false, error: `Failed to fetch ${config.resourceName}` },
			{ status: 500 },
		);
	}
}

export async function handleCreate<T extends CRUDItem>(
	request: Request,
	config: HandlerConfig<T>,
): Promise<NextResponse<ApiResponse<T>>> {
	try {
		const body = (await request.json()) as Record<string, unknown>;

		// Validar campos requeridos
		if (config.requiredFields && config.requiredFields.length > 0) {
			const missing = config.requiredFields.filter((field) => !body[field]);
			if (missing.length > 0) {
				return NextResponse.json(
					{
						success: false,
						error: `Missing required fields: ${missing.join(", ")}`,
					},
					{ status: 400 },
				);
			}
		}

		const newItem = await config.repository.create(body as Omit<T, "id">);

		return NextResponse.json({ success: true, data: newItem });
	} catch (error) {
		console.error(`Error creating ${config.resourceName}:`, error);
		return NextResponse.json(
			{ success: false, error: `Failed to create ${config.resourceName}` },
			{ status: 500 },
		);
	}
}

export async function handleUpdate<T extends CRUDItem>(
	id: string,
	request: Request,
	config: HandlerConfig<T>,
): Promise<NextResponse<ApiResponse<T>>> {
	try {
		const body = (await request.json()) as Partial<T>;
		const updatedItem = await config.repository.update(id, body);

		if (!updatedItem) {
			return NextResponse.json(
				{ success: false, error: `${config.resourceName} not found` },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: updatedItem });
	} catch (error) {
		console.error(`Error updating ${config.resourceName}:`, error);
		return NextResponse.json(
			{ success: false, error: `Failed to update ${config.resourceName}` },
			{ status: 500 },
		);
	}
}

export async function handleDelete<T extends CRUDItem>(
	id: string,
	config: HandlerConfig<T>,
): Promise<NextResponse<ApiResponse<null>>> {
	try {
		const deleted = await config.repository.delete(id);

		if (!deleted) {
			return NextResponse.json(
				{ success: false, error: `${config.resourceName} not found` },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(`Error deleting ${config.resourceName}:`, error);
		return NextResponse.json(
			{ success: false, error: `Failed to delete ${config.resourceName}` },
			{ status: 500 },
		);
	}
}

export async function extractId(
	params: Promise<{ id: string }>,
): Promise<string> {
	const { id } = await params;
	if (!id) {
		throw new Error("ID is required");
	}
	return id;
}
