"use client";

import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductItem, SiteContent } from "@/config/site-content";

interface ProductsFormProps {
	data: SiteContent["featuredProducts"];
	onChange: (d: unknown) => void;
}

interface ProductWithStatus extends ProductItem {
	isSaving?: boolean;
	isDeleting?: boolean;
}

function ProductCard({
	item,
	index,
	onUpdate,
	onDelete,
}: {
	item: ProductWithStatus;
	index: number;
	onUpdate: (index: number, field: string, value: string | string[]) => void;
	onDelete: (index: number, id: string) => Promise<void>;
}) {
	const [isExpanded, setIsExpanded] = useState(true);

	const updateFeatures = (featureIndex: number, value: string) => {
		const newFeatures = [...item.features];
		newFeatures[featureIndex] = value;
		onUpdate(index, "features", newFeatures);
	};

	const addFeature = () => {
		const newFeatures = [...item.features, ""];
		onUpdate(index, "features", newFeatures);
	};

	const removeFeature = (featureIndex: number) => {
		const newFeatures = item.features.filter((_, i) => i !== featureIndex);
		onUpdate(index, "features", newFeatures);
	};

	return (
		<div className="border rounded-lg overflow-hidden">
			<div className="flex items-center justify-between p-4 bg-muted/50">
				<div className="flex items-center gap-3">
					<div className="w-16 h-12 rounded overflow-hidden bg-background relative">
						{item.image && (
							<Image
								src={item.image}
								alt={item.title}
								fill
								className="object-cover"
							/>
						)}
					</div>
					<div>
						<Input
							placeholder="Nombre del producto"
							value={item.title}
							onChange={(e) => onUpdate(index, "title", e.target.value)}
							className="font-medium h-8"
							disabled={item.isSaving}
						/>
						<p className="text-xs text-muted-foreground mt-0.5">
							ID: {item.id}
						</p>
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
					<div className="space-y-2">
						<Label className="text-xs">Imagen del producto</Label>
						<FileUpload
							value={item.image}
							onChange={(image) => onUpdate(index, "image", image)}
							accept="image/*"
							placeholder="Subir imagen"
							folder="products"
						/>
					</div>

					<div>
						<Label>Descripción</Label>
						<Input
							placeholder="Descripción breve del producto"
							value={item.description}
							onChange={(e) => onUpdate(index, "description", e.target.value)}
							disabled={item.isSaving}
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-2">
							<Label className="text-xs">Características</Label>
							<Button
								variant="ghost"
								size="sm"
								onClick={addFeature}
								className="h-7 text-xs"
								disabled={item.isSaving}
							>
								<Plus className="size-3 mr-1" />
								Agregar
							</Button>
						</div>
						<div className="space-y-2">
							{item.features.map((feat, idx) => (
								<div key={`${idx}-${feat}`} className="flex items-center gap-2">
									<Input
										placeholder="Característica"
										value={feat}
										onChange={(e) => updateFeatures(idx, e.target.value)}
										disabled={item.isSaving}
									/>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => removeFeature(idx)}
										className="shrink-0"
										disabled={item.isSaving}
									>
										<Trash2 className="size-3" />
									</Button>
								</div>
							))}
							{item.features.length === 0 && (
								<p className="text-sm text-muted-foreground italic">
									No hay características. Agrega una acima.
								</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function ProductsForm({ data, onChange }: ProductsFormProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [items, setItems] = useState<ProductWithStatus[]>(data.items);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Sync items when data changes from parent
	useState(() => {
		if (data.items.length !== items.length ||
			JSON.stringify(data.items) !== JSON.stringify(items)) {
			setItems(data.items);
		}
	});

	const updateItem = (
		index: number,
		field: string,
		value: string | string[],
	) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value, isSaving: true };
		setItems(newItems);
		onChange({ ...data, items: newItems });

		// Save to API
		saveItem(newItems[index]);
	};

	const saveItem = async (item: ProductWithStatus) => {
		try {
			const response = await fetch(`/api/products/${item.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			});

			if (!response.ok) {
				throw new Error("Error al guardar producto");
			}

			const result = await response.json() as { warning?: string; data?: ProductWithStatus };

			// Update without saving state
			setItems((prev) =>
				prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i))
			);

			if (result.warning) {
				setSuccess("Producto actualizado (modo desarrollo)");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al guardar");
			setItems((prev) =>
				prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i))
			);
		}
	};

	const deleteItem = async (index: number, id: string) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], isDeleting: true };
		setItems(newItems);

		try {
			const response = await fetch(`/api/products/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Error al eliminar producto");
			}

			const result = await response.json() as { warning?: string };

			// Remove from list
			const removed = items.filter((item) => item.id !== id);
			setItems(removed);
			onChange({ ...data, items: removed });

			if (result.warning) {
				setSuccess("Producto eliminado (modo desarrollo)");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al eliminar");
			setItems((prev) =>
				prev.map((i) => (i.id === id ? { ...i, isDeleting: false } : i))
			);
		}
	};

	const addItem = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: "",
					description: "",
					image: "",
					features: ["", "", ""],
				}),
			});

			if (!response.ok) {
				throw new Error("Error al crear producto");
			}

			const result = await response.json() as { warning?: string; data?: ProductWithStatus };

			if (result.data) {
				const newItems = [...items, { ...result.data, isSaving: false }];
				setItems(newItems);
				onChange({ ...data, items: newItems });
			}

			if (result.warning) {
				setSuccess("Producto creado (modo desarrollo)");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al crear producto");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Productos Destacados</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? (
							<ChevronUp className="size-4 mr-1" />
						) : (
							<ChevronDown className="size-4 mr-1" />
						)}
						{isExpanded ? "Ocultar" : "Mostrar"}
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
							<ProductCard
								key={item.id}
								item={item}
								index={i}
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
						Agregar Nuevo Producto
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
