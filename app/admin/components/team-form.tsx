"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FeaturedTeamContent } from "@/config/site-content";

interface TeamFormProps {
	data: FeaturedTeamContent;
	onChange: (d: unknown) => void;
}

export function TeamForm({ data, onChange }: TeamFormProps) {
	const updateItem = (index: number, field: string, value: string) => {
		const newItems = [...data.items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange({ ...data, items: newItems });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Equipo de Ventas</CardTitle>
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
						<div className="grid grid-cols-2 gap-3">
							<Input
								placeholder="Nombre"
								value={item.name}
								onChange={(e) => updateItem(i, "name", e.target.value)}
							/>
							<Input
								placeholder="Cargo"
								value={item.role}
								onChange={(e) => updateItem(i, "role", e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<Input
								placeholder="Foto (URL)"
								value={item.photo}
								onChange={(e) => updateItem(i, "photo", e.target.value)}
							/>
							<Input
								placeholder="Email"
								value={item.email}
								onChange={(e) => updateItem(i, "email", e.target.value)}
							/>
						</div>
						<Input
							placeholder="Teléfono"
							value={item.phone}
							onChange={(e) => updateItem(i, "phone", e.target.value)}
						/>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
