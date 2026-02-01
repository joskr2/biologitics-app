import { useCallback, useState } from "react";
import {
	createItem,
	deleteItem,
	getResourceName,
	updateItem,
} from "@/lib/api/crud-api";

export interface CrudItem {
	id: string;
	isSaving?: boolean;
	isDeleting?: boolean;
	[key: string]: unknown;
}

export interface UseCrudConfig {
	apiEndpoint: string;
	defaultItem: () => Partial<CrudItem>;
	onSuccess?: (message: string) => void;
	onError?: (message: string) => void;
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

	const resourceName = getResourceName(config.apiEndpoint);

	const saveItem = useCallback(
		async (item: T) => {
			try {
				const result = await updateItem<T>(config.apiEndpoint, item);

				if (!result.success) {
					const errorMsg = result.error || "Error al guardar";
					setError(errorMsg);
					config.onError?.(errorMsg);
					return;
				}

				setItems((prev) =>
					prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i)),
				);

				if (result.warning) {
					const successMsg = `${resourceName} actualizado`;
					setSuccess(successMsg);
					config.onSuccess?.(successMsg);
				}
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : "Error al guardar";
				setError(errorMsg);
				config.onError?.(errorMsg);
				setItems((prev) =>
					prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i)),
				);
			}
		},
		[config.apiEndpoint, config.onError, config.onSuccess, resourceName],
	);

	const deleteItemFn = useCallback(
		async (index: number, id: string) => {
			const newItems = [...items];
			newItems[index] = { ...newItems[index], isDeleting: true } as T;
			setItems(newItems);

			try {
				const result = await deleteItem(config.apiEndpoint, id);

				if (!result.success) {
					const errorMsg = result.error || "Error al eliminar";
					setError(errorMsg);
					config.onError?.(errorMsg);
					return;
				}

				const removed = items.filter((item) => item.id !== id);
				setItems(removed);

				if (result.warning) {
					const successMsg = `${resourceName} eliminado`;
					setSuccess(successMsg);
					config.onSuccess?.(successMsg);
				}
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : "Error al eliminar";
				setError(errorMsg);
				config.onError?.(errorMsg);
				setItems((prev) =>
					prev.map((i) => (i.id === id ? { ...i, isDeleting: false } : i)),
				);
			}
		},
		[items, config.apiEndpoint, config.onError, config.onSuccess, resourceName],
	);

	const addItem = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await createItem<T>(
				config.apiEndpoint,
				config.defaultItem() as Partial<T>,
			);

			if (!result.success) {
				const errorMsg = result.error || `Error al crear ${resourceName}`;
				setError(errorMsg);
				config.onError?.(errorMsg);
				setLoading(false);
				return;
			}

			if (result.data) {
				const newItem = result.data;
				setItems((prev) => [...prev, { ...newItem, isSaving: false } as T]);
			}

			if (result.warning) {
				const successMsg = `${resourceName} creado`;
				setSuccess(successMsg);
				config.onSuccess?.(successMsg);
			}
		} catch (err) {
			const errorMsg =
				err instanceof Error ? err.message : `Error al crear ${resourceName}`;
			setError(errorMsg);
			config.onError?.(errorMsg);
		} finally {
			setLoading(false);
		}
	}, [
		config.apiEndpoint,
		config.defaultItem,
		config.onError,
		config.onSuccess,
		resourceName,
	]);

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
		deleteItem: deleteItemFn,
		addItem,
		clearMessages,
	};
}

/**
 * Hook for creating a single item
 */
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

			const result = await createItem<T>(apiEndpoint, data);

			if (!result.success) {
				setError(result.error || "Error al crear");
				setLoading(false);
				return null;
			}

			setLoading(false);
			return result.data || null;
		},
		[apiEndpoint],
	);

	return { create, loading, error };
}
