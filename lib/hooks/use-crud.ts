import { useCallback, useState } from "react";

export interface CrudItem {
	id: string;
	isSaving?: boolean;
	isDeleting?: boolean;
	[key: string]: unknown;
}

export interface UseCrudConfig {
	apiEndpoint: string;
	defaultItem: () => Partial<CrudItem>;
}

export interface UseCrudReturn<T extends CrudItem> {
	items: T[];
	loading: boolean;
	error: string | null;
	success: string | null;
	setItems: React.Dispatch<React.SetStateAction<T[]>>;
	saveItem: (item: T) => Promise<void>;
	deleteItem: (index: number, id: string) => Promise<void>;
	addItem: () => Promise<void>;
	clearMessages: () => void;
}

export function useCrud<T extends CrudItem>(
	config: UseCrudConfig,
): UseCrudReturn<T> {
	const [items, setItems] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const saveItem = useCallback(
		async (item: T) => {
			try {
				const response = await fetch(`${config.apiEndpoint}/${item.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(item),
				});

				if (!response.ok) {
					throw new Error(`Error al guardar`);
				}

				const result = (await response.json()) as { warning?: string };

				setItems((prev) =>
					prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i)),
				);

				if (result.warning) {
					setSuccess(
						`${getResourceName(config.apiEndpoint)} actualizado (modo desarrollo)`,
					);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error al guardar");
				setItems((prev) =>
					prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i)),
				);
			}
		},
		[config.apiEndpoint],
	);

	const deleteItem = useCallback(
		async (index: number, id: string) => {
			const newItems = [...items];
			newItems[index] = { ...newItems[index], isDeleting: true } as T;
			setItems(newItems);

			try {
				const response = await fetch(`${config.apiEndpoint}/${id}`, {
					method: "DELETE",
				});

				if (!response.ok) {
					throw new Error(`Error al eliminar`);
				}

				const result = (await response.json()) as { warning?: string };

				const removed = items.filter((item) => item.id !== id);
				setItems(removed);

				if (result.warning) {
					setSuccess(
						`${getResourceName(config.apiEndpoint)} eliminado (modo desarrollo)`,
					);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error al eliminar");
				setItems((prev) =>
					prev.map((i) => (i.id === id ? { ...i, isDeleting: false } : i)),
				);
			}
		},
		[items, config.apiEndpoint],
	);

	const addItem = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(config.apiEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(config.defaultItem()),
			});

			if (!response.ok) {
				throw new Error(`Error al crear`);
			}

			const result = (await response.json()) as {
				warning?: string;
				data?: T;
			};

			if (result.data) {
				const newItem = result.data;
				setItems((prev) => [...prev, { ...newItem, isSaving: false } as T]);
			}

			if (result.warning) {
				setSuccess(
					`${getResourceName(config.apiEndpoint)} creado (modo desarrollo)`,
				);
			}
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: `Error al crear ${getResourceName(config.apiEndpoint)}`,
			);
		} finally {
			setLoading(false);
		}
	}, [config.apiEndpoint, config.defaultItem]);

	const clearMessages = useCallback(() => {
		setError(null);
		setSuccess(null);
	}, []);

	return {
		items,
		loading,
		error,
		success,
		setItems,
		saveItem,
		deleteItem,
		addItem,
		clearMessages,
	};
}

/**
 * Helper para obtener nombre legible del recurso
 */
function getResourceName(endpoint: string): string {
	const names: Record<string, string> = {
		"/api/brands": "Marca",
		"/api/clients": "Cliente",
		"/api/team": "Miembro del equipo",
		"/api/products": "Producto",
	};
	return names[endpoint] || "Elemento";
}

export function useCreateItem<T extends CrudItem>(
	apiEndpoint: string,
): {
	create: (data: Partial<T>) => Promise<T | null>;
	loading: boolean;
	error: string | null;
} {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const create = useCallback(
		async (data: Partial<T>): Promise<T | null> => {
			setLoading(true);
			setError(null);

			try {
				const response = await fetch(apiEndpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					throw new Error("Error al crear");
				}

				const result = (await response.json()) as { data?: T };
				return result.data || null;
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error al crear");
				return null;
			} finally {
				setLoading(false);
			}
		},
		[apiEndpoint],
	);

	return { create, loading, error };
}
