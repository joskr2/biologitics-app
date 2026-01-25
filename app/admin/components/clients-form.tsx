"use client";

import { ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
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

interface ClientWithStatus extends ClientItem {
	isSaving?: boolean;
	isDeleting?: boolean;
}

function ClientCard({
	item,
	index,
	onUpdate,
	onDelete,
}: {
	item: ClientWithStatus;
	index: number;
	onUpdate: (index: number, field: string, value: string) => void;
	onDelete: (index: number, id: string) => Promise<void>;
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
								disabled={item.isSaving}
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
	const [items, setItems] = useState<ClientWithStatus[]>(data.items);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const updateItem = (index: number, field: string, value: string) => {
		const newItems = [...items];
		newItems[index] = { ...newItems[index], [field]: value, isSaving: true };
		setItems(newItems);
		onChange({ ...data, items: newItems });

		// Save to API
		saveItem(newItems[index]);
	};

	const saveItem = async (item: ClientWithStatus) => {
		try {
			const response = await fetch(`/api/clients/${item.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			});

			if (!response.ok) {
				throw new Error("Error al guardar cliente");
			}

			const result = await response.json() as { warning?: string };

			setItems((prev) =>
				prev.map((i) => (i.id === item.id ? { ...i, isSaving: false } : i))
			);

			if (result.warning) {
				setSuccess("Cliente actualizado (modo desarrollo)");
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
			const response = await fetch(`/api/clients/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Error al eliminar cliente");
			}

			const result = await response.json() as { warning?: string };

			const removed = items.filter((item) => item.id !== id);
			setItems(removed);
			onChange({ ...data, items: removed });

			if (result.warning) {
				setSuccess("Cliente eliminado (modo desarrollo)");
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
			const response = await fetch("/api/clients", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: "",
					logo: "",
					type: "",
				}),
			});

			if (!response.ok) {
				throw new Error("Error al crear cliente");
			}

			const result = await response.json() as { warning?: string; data?: ClientWithStatus };

			if (result.data) {
				const newItems = [...items, { ...result.data, isSaving: false }];
				setItems(newItems);
				onChange({ ...data, items: newItems });
			}

			if (result.warning) {
				setSuccess("Cliente creado (modo desarrollo)");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al crear cliente");
		} finally {
			setLoading(false);
		}
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
							<ClientCard
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
						Agregar Nuevo Cliente
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
