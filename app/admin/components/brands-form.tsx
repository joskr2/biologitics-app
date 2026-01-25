"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
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

function BrandCard({
	item,
	index,
	onUpdate,
	onDelete,
}: {
	item: BrandItem;
	index: number;
	onUpdate: (
		index: number,
		field: string,
		value: string | FeatureItem[],
	) => void;
	onDelete: (index: number) => void;
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
						/>
					</div>

					<div>
						<Label>Enlace</Label>
						<Input
							placeholder="https://"
							value={item.href}
							onChange={(e) => onUpdate(index, "href", e.target.value)}
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
									/>
									<Input
										placeholder="Categoría"
										value={bs.category ?? ""}
										onChange={(e) =>
											updateBestSeller(bs.id ?? "", "category", e.target.value)
										}
									/>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => removeBestSeller(bs.id ?? "")}
										className="shrink-0"
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

	const updateItem = (
		index: number,
		field: string,
		value: string | FeatureItem[],
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
		const newBrand: BrandItem = {
			id: `marca-${timestamp}`,
			name: "",
			logo: "",
			description: "",
			bestSellers: [{ name: "", category: "" }],
			href: "",
		};
		onChange({ ...data, items: [...data.items, newBrand] });
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
							<BrandCard
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
						Agregar Nueva Marca
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
