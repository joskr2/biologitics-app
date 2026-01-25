"use client";

import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
	BrandItem,
	FeatureItem,
	SiteContent,
} from "@/config/site-content";

interface BrandsFormProps {
	data: SiteContent["featuredBrands"];
	onChange: (d: unknown) => void;
}

interface BrandWithStatus extends BrandItem {
	isSaving?: boolean;
	isDeleting?: boolean;
}

function BrandCard({
	item,
	index,
	onUpdate,
	onDelete,
}: {
	item: BrandWithStatus;
	index: number;
	onUpdate: (
		index: number,
		field: string,
		value: string | FeatureItem[],
	) => void;
	onDelete: (index: number, id: string) => Promise<void>;
}) {
	const [isExpanded, setIsExpanded] = useState(true);

	const updateBestSeller = (bsId: string, field: string, value: string) => {
		const newBestSellers = item.bestSellers.map((bs) =>
			bs.id === bsId ? { ...bs, [field]: value } : bs,
		);
		onUpdate(index, "bestSellers", newBestSellers);
	};

	const addBestSeller = () => {
		const timestamp =
			Date.now().toString(36) + Math.random().toString(36).slice(2);
		const newBestSellers = [
			...item.bestSellers,
			{ id: `bs-${timestamp}`, name: "", category: "" },
		];
		onUpdate(index, "bestSellers", newBestSellers);
	};

	const removeBestSeller = (bsId: string) => {
		const newBestSellers = item.bestSellers.filter((bs) => bs.id !== bsId);
		onUpdate(index, "bestSellers", newBestSellers);
	};

	return (
		<div className="border rounded-lg overflow-hidden">
			<div className="flex items-center justify-between p-4 bg-muted/50">
				<div className="flex items-center gap-3">
					<div className="w-16 h-12 rounded overflow-hidden bg-background relative">
						{item.logo && (
							<Image
								src={item.logo}
								alt={item.name}
								fill
								className="object-contain"
							/>
						)}
					</div>
					<div>
						<Input
							placeholder="Nombre de la marca"
							value={item.name}
							onChange={(e) => onUpdate(index, "name", e.target.value)}
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
						<Label className="text-xs">Logo de la marca</Label>
						<FileUpload
							value={item.logo}
							onChange={(logo) => onUpdate(index, "logo", logo)}
							accept="image/*"
							placeholder="Subir logo"
							folder="brands"
						/>
					</div>

					<div>
						<Label>Descripción</Label>
						<Input
							placeholder="Descripción"
							value={item.description}
							onChange={(e) => onUpdate(index, "description", e.target.value)}
							disabled={item.isSaving}
						/>
					</div>

					<div>
						<Label>Enlace</Label>
						<Input
							placeholder="https://"
							value={item.href}
							onChange={(e) => onUpdate(index, "href", e.target.value)}
							disabled={item.isSaving}
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-2">
							<Label className="text-xs">Productos Destacados</Label>
							<Button
								variant="ghost"
								size="sm"
								onClick={addBestSeller}
								className="h-7 text-xs"
								disabled={item.isSaving}
							>
								<Plus className="size-3 mr-1" />
								Agregar
							</Button>
						</div>
						<div className="space-y-2">
							{item.bestSellers.map((bs) => (
								<div key={bs.id} className="flex items-center gap-2">
									<Input
										placeholder="Producto"
										value={bs.name}
										onChange={(e) =>
											updateBestSeller(bs.id ?? "", "name", e.target.value)
										}
										disabled={item.isSaving}
									/>
									<Input
										placeholder="Categoría"
										value={bs.category ?? ""}
										onChange={(e) =>
											updateBestSeller(bs.id ?? "", "category", e.target.value)
										}
										disabled={item.isSaving}
									/>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => removeBestSeller(bs.id ?? "")}
										className="shrink-0"
										disabled={item.isSaving}
									>
										<Trash2 className="size-3" />
									</Button>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function BrandsForm({ data, onChange }: BrandsFormProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [items, setItems] = useState<BrandWithStatus[]>(data.items);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const updateItem = (
		index: number,
		field: string,
		value: string | FeatureItem[],
	) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value, isSaving: true };
		setItems(newItems);
		onChange({ ...data, items: newItems });

		// Save to API
		saveItem(newItems[index]);
	};

	const saveItem = async (item: BrandWithStatus) => {
		try {
			const response = await fetch(`/api/brands/${item.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			});

			if (!response.ok) {
				throw new Error("Error al guardar marca");
			}

			const result = await response.json() as { warning?: string };

			setItems((prev) =>
				prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i))
			);

			if (result.warning) {
				setSuccess("Marca actualizada (modo desarrollo)");
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
			const response = await fetch(`/api/brands/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Error al eliminar marca");
			}

			const result = await response.json() as { warning?: string };

			const removed = items.filter((item) => item.id !== id);
			setItems(removed);
			onChange({ ...data, items: removed });

			if (result.warning) {
				setSuccess("Marca eliminada (modo desarrollo)");
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
			const response = await fetch("/api/brands", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: "",
					description: "",
					logo: "",
					bestSellers: [{ name: "", category: "" }],
					href: "",
				}),
			});

			if (!response.ok) {
				throw new Error("Error al crear marca");
			}

			const result = await response.json() as { warning?: string; data?: BrandWithStatus };

			if (result.data) {
				const newItems = [...items, { ...result.data, isSaving: false }];
				setItems(newItems);
				onChange({ ...data, items: newItems });
			}

			if (result.warning) {
				setSuccess("Marca creada (modo desarrollo)");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al crear marca");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Marcas Representadas</CardTitle>
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
							<BrandCard
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
						Agregar Nueva Marca
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
