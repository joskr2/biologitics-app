"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/config/site-content";

interface ClientsFormProps {
	data: SiteContent["featuredClients"];
	onChange: (d: unknown) => void;
}

export function ClientsForm({ data, onChange }: ClientsFormProps) {
	const updateItem = (index: number, field: string, value: string) => {
		const newItems = [...data.items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange({ ...data, items: newItems });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Clientes y Colaboradores</CardTitle>
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
						<div className="grid grid-cols-3 gap-3">
							<Input
								placeholder="Nombre del cliente"
								value={item.name}
								onChange={(e) => updateItem(i, "name", e.target.value)}
							/>
							<Input
								placeholder="Logo (ruta)"
								value={item.logo}
								onChange={(e) => updateItem(i, "logo", e.target.value)}
							/>
							<Input
								placeholder="Tipo"
								value={item.type}
								onChange={(e) => updateItem(i, "type", e.target.value)}
							/>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
