"use client";

import type { ProductItem, SiteContent } from "@/config/site-content";
import { CrudForm, type CrudFormConfig } from "./crud-form";

interface ProductsFormProps {
	data: SiteContent["featuredProducts"];
	onChange: (d: unknown) => void;
}

const productsConfig: CrudFormConfig<ProductItem> = {
	apiEndpoint: "/api/products",
	sectionKey: "featuredProducts",
	resourceName: "Producto",
	defaultNewItem: () => ({
		title: "",
		description: "",
		image: "",
		features: [],
	}),
	fields: [
		{
			key: "title",
			label: "Nombre del producto",
			type: "text",
			placeholder: "Nombre del producto",
		},
		{
			key: "image",
			label: "Imagen del producto",
			type: "file",
			folder: "products",
		},
		{
			key: "description",
			label: "Descripción",
			type: "text",
			placeholder: "Descripción breve del producto",
		},
		{
			key: "features",
			label: "Características",
			type: "array",
			nestedConfig: {
				itemLabel: "Característica",
				fields: [
					{ key: "name", label: "Nombre", placeholder: "Característica" },
				],
			},
		},
	],
};

export function ProductsForm({ data, onChange }: ProductsFormProps) {
	return (
		<CrudForm<ProductItem>
			data={data}
			onChange={onChange}
			config={productsConfig}
		/>
	);
}
