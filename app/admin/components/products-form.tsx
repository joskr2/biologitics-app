"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/config/site-content";

interface ProductsFormProps {
	data: SiteContent["featuredProducts"];
	onChange: (d: unknown) => void;
}

export function ProductsForm({ data, onChange }: ProductsFormProps) {
	const updateItem = (
		index: number,
		field: string,
		value: string | string[],
	) => {
		const newItems = [...data.items];
		newItems[index] = { ...newItems[index], [field]: value };
		onChange({ ...data, items: newItems });
	};

	const updateFeatures = (
		itemIndex: number,
		featureIndex: number,
		value: string,
	) => {
		const item = data.items[itemIndex];
		const newFeatures = [...item.features];
		newFeatures[featureIndex] = value;
		updateItem(itemIndex, "features", newFeatures);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Productos Destacados</CardTitle>
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
								placeholder="Nombre del producto"
								value={item.title}
								onChange={(e) => updateItem(i, "title", e.target.value)}
							/>
							<Input
								placeholder="URL de imagen"
								value={item.image}
								onChange={(e) => updateItem(i, "image", e.target.value)}
							/>
						</div>
						<Input
							placeholder="Descripción"
							value={item.description}
							onChange={(e) => updateItem(i, "description", e.target.value)}
						/>
						<div>
							<Label className="text-xs">Características</Label>
							<div className="grid grid-cols-2 gap-2 mt-1">
								{item.features.map((feat, f) => (
									<Input
										key={feat}
										placeholder="Característica"
										value={feat}
										onChange={(e) => updateFeatures(i, f, e.target.value)}
									/>
								))}
							</div>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
