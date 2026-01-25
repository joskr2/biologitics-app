"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FeaturedTeamContent, TeamMember } from "@/config/site-content";

interface TeamFormProps {
	data: FeaturedTeamContent;
	onChange: (d: unknown) => void;
}

function TeamCard({
	item,
	index,
	onUpdate,
	onDelete,
}: {
	item: TeamMember;
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
						{item.photo && (
							<Image
								src={item.photo}
								alt={item.name}
								fill
								className="object-cover"
							/>
						)}
					</div>
					<div>
						<Input
							placeholder="Nombre del miembro"
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
							<Label className="text-xs">Foto del miembro</Label>
							<FileUpload
								value={item.photo}
								onChange={(photo) => onUpdate(index, "photo", photo)}
								accept="image/*"
								placeholder="Subir foto"
								folder="team"
							/>
						</div>
						<div>
							<Label>Cargo / Rol</Label>
							<Input
								placeholder="Ej: Gerente de Ventas, Representante..."
								value={item.role}
								onChange={(e) => onUpdate(index, "role", e.target.value)}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Email</Label>
							<Input
								placeholder="email@ejemplo.com"
								type="email"
								value={item.email}
								onChange={(e) => onUpdate(index, "email", e.target.value)}
							/>
						</div>
						<div>
							<Label>Teléfono</Label>
							<Input
								placeholder="+52 (555) 123-4567"
								value={item.phone}
								onChange={(e) => onUpdate(index, "phone", e.target.value)}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export function TeamForm({ data, onChange }: TeamFormProps) {
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
		const newMember: TeamMember = {
			id: `miembro-${timestamp}`,
			name: "",
			role: "",
			photo: "",
			email: "",
			phone: "",
		};
		onChange({ ...data, items: [...data.items, newMember] });
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Equipo de Ventas</CardTitle>
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
							<TeamCard
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
						Agregar Nuevo Miembro
					</Button>
				</CardContent>
			)}
		</Card>
	);
}
