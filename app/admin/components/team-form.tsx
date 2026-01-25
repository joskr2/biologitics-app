"use client";

import type { FeaturedTeamContent, TeamMember } from "@/config/site-content";
import { CrudForm, type CrudFormConfig } from "./crud-form";

interface TeamFormProps {
	data: FeaturedTeamContent;
	onChange: (d: unknown) => void;
}

const teamConfig: CrudFormConfig<TeamMember> = {
	apiEndpoint: "/api/team",
	sectionKey: "featuredTeam",
	resourceName: "Miembro",
	defaultNewItem: () => ({
		name: "",
		role: "",
		photo: "",
		email: "",
		phone: "",
	}),
	fields: [
		{
			key: "name",
			label: "Nombre del miembro",
			type: "text",
			placeholder: "Nombre del miembro",
		},
		{ key: "photo", label: "Foto del miembro", type: "file", folder: "team" },
		{
			key: "role",
			label: "Cargo / Rol",
			type: "text",
			placeholder: "Ej: Gerente de Ventas, Representante...",
		},
		{
			key: "email",
			label: "Email",
			type: "text",
			placeholder: "email@ejemplo.com",
		},
		{
			key: "phone",
			label: "Teléfono",
			type: "text",
			placeholder: "+52 (555) 123-4567",
		},
	],
};

export function TeamForm({ data, onChange }: TeamFormProps) {
	return (
		<CrudForm<TeamMember> data={data} onChange={onChange} config={teamConfig} />
	);
}
