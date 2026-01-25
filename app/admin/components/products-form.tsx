"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
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

function ProductCard({
	item,
	index,
	onUpdate,
	onDelete,
}: {
	item: ProductItem;
	index: number;
	onUpdate: (index: number, field: string, value: string | string[]) => void;
	onDelete: (index: number) => void;
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
						onClick={() => onDelete(index)}
						className="text-destructive hover:text-destructive hover:bg-destructive/10"
					>
						<Trash2 className="size-4" />
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
									/>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => removeFeature(idx)}
										className="shrink-0"
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

	const updateItem = (
		index: number,
		field: string,
		value: string | string[],
	) => {
		const newItems = [...data.items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange({ ...data, items: newItems });
	};

	const deleteItem = (index: number) => {
		const newItems = data.items.filter((_, i) => i !== index);
		onChange({ ...data, items: newItems });
	};

	const addItem = () => {
		const timestamp = Date.now().toString(36);
		const newProduct: ProductItem = {
			id: `producto-${timestamp}`,
			title: "",
			description: "",
			image: "",
			features: ["", "", ""],
		};
		onChange({ ...data, items: [...data.items, newProduct] });
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
						{data.items.map((item, i) => (
							<ProductCard
								key={item.id}
								item={item}
								index={i}
								onUpdate={updateItem}
								onDelete={deleteItem}
							/>
						))}
					</div>

					<Button variant="outline" onClick={addItem} className="w-full">
						<Plus className="size-4 mr-2" />
						Agregar Nuevo Producto
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
