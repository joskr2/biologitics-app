"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientItem, SiteContent } from "@/config/site-content";

interface ClientsFormProps {
	data: SiteContent["featuredClients"];
	onChange: (d: unknown) => void;
}

function ClientCard({
	item,
	index,
	onUpdate,
	onDelete,
}: {
	item: ClientItem;
	index: number;
	onUpdate: (index: number, field: string, value: string) => void;
	onDelete: (index: number) => void;
}) {
	const [isExpanded, setIsExpanded] = useState(true);

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
							placeholder="Nombre del cliente"
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
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-xs">Logo del cliente</Label>
							<FileUpload
								value={item.logo}
								onChange={(logo) => onUpdate(index, "logo", logo)}
								accept="image/*"
								placeholder="Subir logo"
								folder="clients"
							/>
						</div>
						<div>
							<Label>Tipo / Categoría</Label>
							<Input
								placeholder="Ej: Hospital, Laboratorio, Universidad..."
								value={item.type}
								onChange={(e) => onUpdate(index, "type", e.target.value)}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function ClientsForm({ data, onChange }: ClientsFormProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	const updateItem = (index: number, field: string, value: string) => {
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
		const newClient: ClientItem = {
			id: `cliente-${timestamp}`,
			name: "",
			logo: "",
			type: "",
		};
		onChange({ ...data, items: [...data.items, newClient] });
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Clientes y Colaboradores</CardTitle>
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
							<ClientCard
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
						Agregar Nuevo Cliente
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
