"use client";

import type { ClientItem, SiteContent } from "@/config/site-content";
import { CrudForm, type CrudFormConfig } from "./crud-form";

interface ClientsFormProps {
	data: SiteContent["featuredClients"];
	onChange: (d: unknown) => void;
}

const clientsConfig: CrudFormConfig<ClientItem> = {
	apiEndpoint: "/api/clients",
	sectionKey: "featuredClients",
	resourceName: "Cliente",
	defaultNewItem: () => ({
		name: "",
		logo: "",
		type: "",
	}),
	fields: [
		{
			key: "name",
			label: "Nombre del cliente",
			type: "text",
			placeholder: "Nombre del cliente",
		},
		{ key: "logo", label: "Logo del cliente", type: "file", folder: "clients" },
		{
			key: "type",
			label: "Tipo / Categoría",
			type: "text",
			placeholder: "Ej: Hospital, Laboratorio, Universidad...",
		},
	],
};

export function ClientsForm({ data, onChange }: ClientsFormProps) {
	return (
		<CrudForm<ClientItem>
			data={data}
			onChange={onChange}
			config={clientsConfig}
		/>
	);
}
