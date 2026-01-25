"use client";

import type { BrandItem, SiteContent } from "@/config/site-content";
import { CrudForm, type CrudFormConfig } from "./crud-form";

interface BrandsFormProps {
	data: SiteContent["featuredBrands"];
	onChange: (d: unknown) => void;
}

const brandsConfig: CrudFormConfig<BrandItem> = {
	apiEndpoint: "/api/brands",
	sectionKey: "featuredBrands",
	resourceName: "Marca",
	defaultNewItem: () => ({
		name: "",
		description: "",
		logo: "",
		bestSellers: [{ name: "", category: "" }],
		href: "",
	}),
	fields: [
		{
			key: "name",
			label: "Nombre de la marca",
			type: "text",
			placeholder: "Nombre de la marca",
		},
		{ key: "logo", label: "Logo de la marca", type: "file", folder: "brands" },
		{
			key: "description",
			label: "Descripción",
			type: "text",
			placeholder: "Descripción",
		},
		{ key: "href", label: "Enlace", type: "text", placeholder: "https://" },
		{
			key: "bestSellers",
			label: "Productos Destacados",
			type: "array",
			nestedConfig: {
				itemLabel: "Producto",
				fields: [
					{ key: "name", label: "Producto", placeholder: "Producto" },
					{ key: "category", label: "Categoría", placeholder: "Categoría" },
				],
			},
		},
	],
};

export function BrandsForm({ data, onChange }: BrandsFormProps) {
	return (
		<CrudForm<BrandItem>
			data={data}
			onChange={onChange}
			config={brandsConfig}
		/>
	);
}
