import { createKVClient, type KVClient } from "./kv-client";

export interface CRUDItem {
	id: string;
}

export interface CRUDRepository<T extends CRUDItem> {
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T | null>;
	create(item: Omit<T, "id">): Promise<T>;
	update(id: string, item: Partial<T>): Promise<T | null>;
	delete(id: string): Promise<boolean>;
}

export interface RepositoryConfig<T extends CRUDItem> {
	sectionKey: string;
	defaultItems: T[];
	idGenerator?: (data: Omit<T, "id">) => string;
	validateOnCreate?: (data: Omit<T, "id">) => {
		valid: boolean;
		error?: string;
	};
}

export class GenericCRUDRepository<T extends CRUDItem>
	implements CRUDRepository<T>
{
	private kvClient: KVClient;
	private config: RepositoryConfig<T>;

	constructor(config: RepositoryConfig<T>) {
		this.config = config;
		this.kvClient = createKVClient({
			sectionKey: config.sectionKey,
			defaultItems: config.defaultItems,
			cacheHeaders: {
				"Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
			},
		});
	}

	private generateId(data: Omit<T, "id">): string {
		if (this.config.idGenerator) {
			return this.config.idGenerator(data);
		}

		const dataRecord = data as Record<string, unknown>;
		const nameField = "name" in data ? "name" : "title";
		const name = String(dataRecord[nameField] || "");
		return name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	}

	private validate(data: Omit<T, "id">): { valid: boolean; error?: string } {
		if (this.config.validateOnCreate) {
			return this.config.validateOnCreate(data);
		}
		return { valid: true };
	}

	async getAll(): Promise<T[]> {
		return this.kvClient.get<T>();
	}

	async getById(id: string): Promise<T | null> {
		const items = await this.getAll();
		return items.find((item) => item.id === id) || null;
	}

	async create(data: Omit<T, "id">): Promise<T> {
		const validation = this.validate(data);
		if (!validation.valid) {
			throw new Error(validation.error || "Validation failed");
		}

		const id = this.generateId(data);

		const newItem = { ...data, id } as T;

		const items = await this.getAll();
		const updatedItems = [...items, newItem];

		await this.kvClient.put(updatedItems);

		return newItem;
	}

	async update(id: string, data: Partial<T>): Promise<T | null> {
		const items = await this.getAll();
		const index = items.findIndex((item) => item.id === id);

		if (index === -1) {
			return null;
		}

		const updatedItem = { ...items[index], ...data } as T;
		const updatedItems = [...items];
		updatedItems[index] = updatedItem;

		await this.kvClient.put(updatedItems);

		return updatedItem;
	}

	async delete(id: string): Promise<boolean> {
		const items = await this.getAll();
		const filteredItems = items.filter((item) => item.id !== id);

		if (filteredItems.length === items.length) {
			return false;
		}

		await this.kvClient.put(filteredItems);
		return true;
	}

	getCacheHeaders() {
		return this.kvClient.buildResponseHeaders();
	}
}

export function createRepository<T extends CRUDItem>(
	config: RepositoryConfig<T>,
): GenericCRUDRepository<T> {
	return new GenericCRUDRepository(config);
}
