"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/config/site-content";

interface FooterFormProps {
	data: SiteContent["footer"];
	onChange: (d: unknown) => void;
}

export function FooterForm({ data, onChange }: FooterFormProps) {
	const updateCompany = (field: string, value: string) => {
		onChange({ ...data, company: { ...data.company, [field]: value } });
	};

	const updateLogo = (mode: "light" | "dark", value: string) => {
		onChange({
			...data,
			company: {
				...data?.company,
				logo: { ...data.company.logo, [mode]: value },
			},
		});
	};

	const updateSocialLink = (index: number, field: string, value: string) => {
		const newLinks = [...data.socialLinks];
		newLinks[index] = { ...newLinks[index], [field]: value };
		onChange({ ...data, socialLinks: newLinks });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Configuración del Footer</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<Label>Empresa</Label>
					<div className="grid grid-cols-2 gap-3 mt-2">
						<Input
							placeholder="Nombre"
							value={data.company.name}
							onChange={(e) => updateCompany("name", e.target.value)}
						/>
						<Input
							placeholder="Email"
							value={data.company.email}
							onChange={(e) => updateCompany("email", e.target.value)}
						/>
						<Input
							placeholder="Teléfono"
							value={data.company.phone}
							onChange={(e) => updateCompany("phone", e.target.value)}
						/>
						<Input
							placeholder="Dirección"
							value={data.company.address}
							onChange={(e) => updateCompany("address", e.target.value)}
						/>
						<Input
							placeholder="WhatsApp"
							value={data.company.whatsapp}
							onChange={(e) => updateCompany("whatsapp", e.target.value)}
						/>
					</div>
				</div>

				<div className="space-y-4">
					<Label className="text-base font-medium">Logos del Footer</Label>
					<p className="text-sm text-muted-foreground">
						Sube dos versiones del logo para el footer: clara para fondos
						oscuros, oscura para fondos claros.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Footer Logo Light - for dark backgrounds */}
						<div className="space-y-2 p-4 border rounded-lg bg-muted/20">
							<Label className="text-sm font-medium text-blue-600">
								Logo Fondo Claro
							</Label>
							<p className="text-xs text-muted-foreground mb-2">
								Para fondos oscuros (logo claro)
							</p>
							<FileUpload
								value={data?.company?.logo?.light ?? ""}
								onChange={(src) => updateLogo("light", src)}
								accept="image/svg+xml,image/png,image/jpeg"
								placeholder="Subir logo claro"
								folder="footer-logos"
							/>
						</div>

						{/* Footer Logo Dark - for light backgrounds */}
						<div className="space-y-2 p-4 border rounded-lg bg-muted/20">
							<Label className="text-sm font-medium text-slate-700">
								Logo Fondo Oscuro
							</Label>
							<p className="text-xs text-muted-foreground mb-2">
								Para fondos claros (logo oscuro)
							</p>
							<FileUpload
								value={data?.company?.logo?.dark ?? ""}
								onChange={(src) => updateLogo("dark", src)}
								accept="image/svg+xml,image/png,image/jpeg"
								placeholder="Subir logo oscuro"
								folder="footer-logos"
							/>
						</div>
					</div>
				</div>

				<div>
					<Label>Redes Sociales</Label>
					{data.socialLinks.map((link, i) => (
						<div
							key={link.name}
							className="border p-3 rounded-lg mt-2 space-y-2"
						>
							<Input
								placeholder="Nombre"
								value={link.name}
								onChange={(e) => updateSocialLink(i, "name", e.target.value)}
							/>
							<div className="space-y-2">
								<Label className="text-xs">Icono</Label>
								<FileUpload
									value={link.icon}
									onChange={(icon) => updateSocialLink(i, "icon", icon)}
									accept="image/svg+xml,image/png,image/jpeg"
									placeholder="Subir icono"
									folder="icons"
								/>
							</div>
							<Input
								placeholder="Enlace"
								value={link.href}
								onChange={(e) => updateSocialLink(i, "href", e.target.value)}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
