"use client";

import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function useLatest<T>(value: T) {
	const ref = useRef(value);
	useLayoutEffect(() => {
		ref.current = value;
	});
	return ref;
}

export interface BaseItem {
	id: string;
	isSaving?: boolean;
	isDeleting?: boolean;
}

export interface SectionConfig {
	title: string;
	subtitle: string;
	items: BaseItem[];
}

export interface FieldConfig {
	key: string;
	label: string;
	type: "text" | "textarea" | "file" | "array";
	placeholder?: string;
	folder?: string;
	nestedConfig?: {
		itemLabel: string;
		fields: NestedFieldConfig[];
	};
}

export interface NestedFieldConfig {
	key: string;
	label: string;
	placeholder?: string;
}

export interface CrudFormConfig<T extends BaseItem> {
	apiEndpoint: string;
	sectionKey:
		| "featuredBrands"
		| "featuredProducts"
		| "featuredClients"
		| "featuredTeam";
	resourceName: string;
	defaultNewItem: () => Partial<T>;
	fields: FieldConfig[];
}

const ItemCard = memo(function ItemCard<T extends BaseItem>({
	item,
	index,
	config,
	onUpdate,
	onDelete,
}: {
	item: T;
	index: number;
	config: CrudFormConfig<T>;
	onUpdate: (index: number, field: string, value: unknown) => void;
	onDelete: (index: number, id: string) => Promise<void>;
}) {
	const [isExpanded, setIsExpanded] = useState(true);

	const itemRecord = item as Record<string, unknown>;

	const renderField = (field: FieldConfig) => {
		const value = itemRecord[field.key];

		switch (field.type) {
			case "file":
				return (
					<div key={field.key} className="space-y-2">
						<Label className="text-xs">{field.label}</Label>
						<FileUpload
							value={String(value || "")}
							onChange={(val) => onUpdate(index, field.key, val)}
							accept="image/*"
							placeholder={field.placeholder || "Subir archivo"}
							folder={field.folder}
						/>
					</div>
				);

			case "array": {
				const nestedConfig = field.nestedConfig;
				if (!nestedConfig) {
					return null;
				}
				return (
					<div key={field.key}>
						<div className="flex items-center justify-between mb-2">
							<Label className="text-xs">{field.label}</Label>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									const arr = (Array.isArray(value) ? value : []) as Record<
										string,
										unknown
									>[];
									onUpdate(index, field.key, [
										...arr,
										{
											id: `temp-${Date.now()}`,
											...createEmptyNested(nestedConfig),
										},
									]);
								}}
								className="h-7 text-xs"
								disabled={item.isSaving}
							>
								<Plus className="size-3 mr-1" />
								Agregar
							</Button>
						</div>
						<div className="space-y-2">
							{(Array.isArray(value) ? value : []).map((nestedItem, idx) => (
								<div
									key={nestedItem.id || idx}
									className="flex items-center gap-2"
								>
									{nestedConfig.fields.map((nf) => (
										<Input
											key={nf.key}
											placeholder={nf.placeholder || nf.label}
											value={String(
												(nestedItem as Record<string, unknown>)[nf.key] || "",
											)}
											onChange={(e) => {
												const arr = [...(Array.isArray(value) ? value : [])];
												arr[idx] = {
													...(arr[idx] as object),
													[nf.key]: e.target.value,
												};
												onUpdate(index, field.key, arr);
											}}
											disabled={item.isSaving}
										/>
									))}
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => {
											const arr = (Array.isArray(value) ? value : []).filter(
												(_, i) => i !== idx,
											);
											onUpdate(index, field.key, arr);
										}}
										className="shrink-0"
										disabled={item.isSaving}
									>
										<Trash2 className="size-3" />
									</Button>
								</div>
							))}
						</div>
					</div>
				);
			}

			default:
				return (
					<div key={field.key}>
						<Label>{field.label}</Label>
						<Input
							placeholder={field.placeholder}
							value={String(value || "")}
							onChange={(e) => onUpdate(index, field.key, e.target.value)}
							disabled={item.isSaving}
						/>
					</div>
				);
		}
	};

	return (
		<div className="border rounded-lg overflow-hidden">
			<div className="flex items-center justify-between p-4 bg-muted/50">
				<div className="flex items-center gap-3">
					{config.fields.some((f) => f.type === "file") && (
						<div className="w-16 h-12 rounded overflow-hidden bg-background relative">
							{(() => {
								const imgField = config.fields.find((f) => f.type === "file");
								const imgUrl = imgField ? itemRecord[imgField.key] : null;
								if (imgUrl) {
									return (
										<Image
											src={String(imgUrl)}
											alt={String(
												itemRecord.name || itemRecord.title || "Item",
											)}
											fill
											className="object-contain"
										/>
									);
								}
								return null;
							})()}
						</div>
					)}
					<div>
						{(() => {
							const nameField = config.fields.find(
								(f) => f.key === "name" || f.key === "title",
							);
							return (
								<>
									<Input
										placeholder={nameField?.placeholder || config.resourceName}
										value={String(itemRecord[nameField?.key || "name"] || "")}
										onChange={(e) =>
											onUpdate(index, nameField?.key || "name", e.target.value)
										}
										className="font-medium h-8"
										disabled={item.isSaving}
									/>
									<p className="text-xs text-muted-foreground mt-0.5">
										ID: {item.id}
									</p>
								</>
							);
						})()}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => setIsExpanded(!isExpanded)}
						disabled={item.isSaving || item.isDeleting}
					>
						{isExpanded ? (
							<ChevronUp className="size-4" />
						) : (
							<ChevronDown className="size-4" />
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => onDelete(index, item.id)}
						disabled={item.isSaving || item.isDeleting}
						className="text-destructive hover:text-destructive hover:bg-destructive/10"
					>
						{item.isDeleting ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Trash2 className="size-4" />
						)}
					</Button>
				</div>
			</div>

			{isExpanded && (
				<div className="p-4 space-y-4">
					{config.fields
						.filter((f) => f.key !== "name" && f.key !== "title")
						.map(renderField)}
				</div>
			)}
		</div>
	);
});

function createEmptyNested(config: {
	fields: NestedFieldConfig[];
}): Record<string, string> {
	const result: Record<string, string> = {};
	config.fields.forEach((f) => {
		result[f.key] = "";
	});
	return result;
}

export function CrudForm<T extends BaseItem>({
	data,
	onChange,
	config,
}: {
	data: SectionConfig;
	onChange: (d: unknown) => void;
	config: CrudFormConfig<T>;
}) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [items, setItems] = useState<T[]>(data.items as T[]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const itemsRef = useLatest(items);

	const saveItem = async (item: T) => {
		try {
			const response = await fetch(`${config.apiEndpoint}/${item.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			});

			if (!response.ok) {
				throw new Error(`Error al guardar ${config.resourceName}`);
			}

			const result = (await response.json()) as { warning?: string };

			setItems((prev) =>
				prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i)),
			);

			if (result.warning) {
				setSuccess(`${config.resourceName} actualizado (modo desarrollo)`);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : `Error al guardar`);
			setItems((prev) =>
				prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i)),
			);
		}
	};

	const saveItemRef = useLatest(saveItem);

	const updateItem = useCallback(
		(index: number, field: string, value: unknown) => {
			const currentItems = itemsRef.current;
			const newItems = [...currentItems];
			newItems[index] = {
				...newItems[index],
				[field]: value,
				isSaving: true,
			} as T;
			setItems(newItems);
			onChange({ ...data, items: newItems });

			saveItemRef.current(newItems[index]);
		},
		[data, onChange, itemsRef, saveItemRef],
	);

	const deleteItem = useCallback(
		async (index: number, id: string) => {
			const currentItems = itemsRef.current;
			const newItems = [...currentItems];
			newItems[index] = { ...newItems[index], isDeleting: true } as T;
			setItems(newItems);

			try {
				const response = await fetch(`${config.apiEndpoint}/${id}`, {
					method: "DELETE",
				});

				if (!response.ok) {
					throw new Error(`Error al eliminar ${config.resourceName}`);
				}

				const result = (await response.json()) as { warning?: string };

				const removed = currentItems.filter((item) => item.id !== id);
				setItems(removed);
				onChange({ ...data, items: removed });

				if (result.warning) {
					setSuccess(`${config.resourceName} eliminado (modo desarrollo)`);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error al eliminar");
				setItems((prev) =>
					prev.map((i) => (i.id === id ? { ...i, isDeleting: false } : i)),
				);
			}
		},
		[data, onChange, itemsRef, config.apiEndpoint, config.resourceName],
	);

	const addItem = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(config.apiEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(config.defaultNewItem()),
			});

			if (!response.ok) {
				throw new Error(`Error al crear ${config.resourceName}`);
			}

			const result = (await response.json()) as { warning?: string; data?: T };

			if (result.data) {
				const newItems = [...items, { ...result.data, isSaving: false } as T];
				setItems(newItems);
				onChange({ ...data, items: newItems });
			}

			if (result.warning) {
				setSuccess(`${config.resourceName} creado (modo desarrollo)`);
			}
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: `Error al crear ${config.resourceName}`,
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>{config.resourceName}s</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? (
							<>
								<ChevronUp className="size-4 mr-1" />
								Ocultar
							</>
						) : (
							<>
								<ChevronDown className="size-4 mr-1" />
								Mostrar
							</>
						)}
					</Button>
				</div>
			</CardHeader>
			{isExpanded && (
				<CardContent className="space-y-6">
					{error && (
						<div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
							{error}
						</div>
					)}
					{success && (
						<div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
							{success}
						</div>
					)}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Título de la sección</Label>
							<Input
								value={data.title}
								onChange={(e) => onChange({ ...data, title: e.target.value })}
								placeholder="Título principal"
							/>
						</div>
						<div>
							<Label>Subtítulo</Label>
							<Input
								value={data.subtitle}
								onChange={(e) =>
									onChange({ ...data, subtitle: e.target.value })
								}
								placeholder="Descripción breve"
							/>
						</div>
					</div>

					<div className="space-y-4">
						{items.map((item, i) => (
							<ItemCard
								key={item.id}
								item={item}
								index={i}
								config={config}
								onUpdate={updateItem}
								onDelete={deleteItem}
							/>
						))}
					</div>

					<Button
						variant="outline"
						onClick={addItem}
						disabled={loading}
						className="w-full"
					>
						{loading ? (
							<Loader2 className="size-4 mr-2 animate-spin" />
						) : (
							<Plus className="size-4 mr-2" />
						)}
						Agregar Nuevo {config.resourceName}
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
