"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/config/site-content";

interface BrandsFormProps {
	data: SiteContent["featuredBrands"];
	onChange: (d: unknown) => void;
}

export function BrandsForm({ data, onChange }: BrandsFormProps) {
	const updateItem = (index: number, field: string, value: string) => {
		const newItems = [...data.items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange({ ...data, items: newItems });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Marcas Representadas</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label>Título</Label>
						<Input
							value={data.title}
							onChange={(e) => onChange({ ...data, title: e.target.value })}
						/>
					</div>
					<div>
						<Label>Subtítulo</Label>
						<Input
							value={data.subtitle}
							onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
						/>
					</div>
				</div>

				{data.items.map((item, i) => (
					<div key={item.id} className="border p-4 rounded-lg space-y-3">
						<Input
							placeholder="Nombre de la marca"
							value={item.name}
							onChange={(e) => updateItem(i, "name", e.target.value)}
						/>
						<div className="space-y-2">
							<Label className="text-xs">Logo de la marca</Label>
							<FileUpload
								value={item.logo}
								onChange={(logo) => updateItem(i, "logo", logo)}
								accept="image/*"
								placeholder="Subir logo"
								folder="brands"
							/>
						</div>
						<Input
							placeholder="Descripción"
							value={item.description}
							onChange={(e) => updateItem(i, "description", e.target.value)}
						/>
						<Input
							placeholder="Enlace"
							value={item.href}
							onChange={(e) => updateItem(i, "href", e.target.value)}
						/>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
