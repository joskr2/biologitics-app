/**
 * Shared CRUD API utilities
 * Used by useCrud hook and CrudForm component
 */

import type { CrudItem } from "@/lib/hooks/use-crud";

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	warning?: string;
}

export interface ApiError {
	success: false;
	error: string;
}

/**
 * Generic fetch wrapper for API calls
 */
async function apiFetch<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> {
	try {
		const response = await fetch(endpoint, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		if (!response.ok) {
			return {
				success: false,
				error: `Error ${response.status}: ${response.statusText}`,
			};
		}

		const data = (await response.json()) as ApiResponse<T>;
		return { success: true, data: data.data, warning: data.warning };
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : "Network error",
		};
	}
}

/**
 * Create a new item
 */
export async function createItem<T extends CrudItem>(
	apiEndpoint: string,
	data: Partial<T>,
): Promise<ApiResponse<T>> {
	return apiFetch<T>(apiEndpoint, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

/**
 * Update an existing item
 */
export async function updateItem<T extends CrudItem>(
	apiEndpoint: string,
	item: T,
): Promise<ApiResponse<T>> {
	return apiFetch<T>(`${apiEndpoint}/${item.id}`, {
		method: "PUT",
		body: JSON.stringify(item),
	});
}

/**
 * Delete an item
 */
export async function deleteItem(
	apiEndpoint: string,
	id: string,
): Promise<ApiResponse<null>> {
	return apiFetch<null>(`${apiEndpoint}/${id}`, {
		method: "DELETE",
	});
}

/**
 * Get all items from an endpoint
 */
export async function getItems<T extends CrudItem>(
	apiEndpoint: string,
): Promise<ApiResponse<T[]>> {
	return apiFetch<T[]>(apiEndpoint);
}

/**
 * Get resource name for display
 */
export function getResourceName(endpoint: string): string {
	const names: Record<string, string> = {
		"/api/brands": "Marca",
		"/api/clients": "Cliente",
		"/api/team": "Miembro del equipo",
		"/api/products": "Producto",
	};
	return names[endpoint] || "Elemento";
}
