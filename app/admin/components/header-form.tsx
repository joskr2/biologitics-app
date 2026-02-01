"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/config/site-content";

interface HeaderFormProps {
	data: SiteContent["header"];
	onChange: (d: unknown) => void;
}

export function HeaderForm({ data, onChange }: HeaderFormProps) {
	const updateLogo = (mode: "light" | "dark", field: string, value: string) => {
		onChange({
			...data,
			logo: {
				...data.logo,
				[mode]: { ...data.logo[mode], [field]: value },
			},
		});
	};

	const updateCta = (field: string, value: string) => {
		onChange({ ...data, cta: { ...data.cta, [field]: value } });
	};

	const updateNav = (index: number, field: string, value: string) => {
		const newNav = [...data.navigation];
		newNav[index] = { ...newNav[index], [field]: value };
		onChange({ ...data, navigation: newNav });
	};

	const addNavItem = () => {
		onChange({
			...data,
			navigation: [...data.navigation, { label: "", href: "/" }],
		});
	};

	const removeNavItem = (index: number) => {
		const newNav = data.navigation.filter((_, i) => i !== index);
		onChange({ ...data, navigation: newNav });
	};

	const toggleHeaderNav = (href: string) => {
		const current = data.headerNavigation || [];
		const newHeaderNav = current.includes(href)
			? current.filter((h) => h !== href)
			: [...current, href];
		onChange({ ...data, headerNavigation: newHeaderNav });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Configuración del Header</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<Label className="text-base font-medium">
						Logos (Modo Claro y Oscuro)
					</Label>
					<p className="text-sm text-muted-foreground">
						Sube dos versiones del logo: una para fondos claros y otra para
						fondos oscuros.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Logo Light Mode */}
						<div className="space-y-2 p-4 border rounded-lg bg-muted/20">
							<Label className="text-sm font-medium text-blue-600">
								Logo Modo Claro
							</Label>
							<p className="text-xs text-muted-foreground mb-2">
								Para fondos oscuros (logo claro)
							</p>
							<FileUpload
								value={data?.logo?.light?.src ?? ""}
								onChange={(src) => updateLogo("light", "src", src)}
								accept="image/svg+xml,image/png,image/jpeg"
								placeholder="Subir logo claro"
								folder="logos"
							/>
							<Input
								placeholder="Texto alternativo (alt)"
								value={data?.logo?.light?.alt ?? ""}
								onChange={(e) => updateLogo("light", "alt", e.target.value)}
								className="h-8 text-sm"
							/>
						</div>

						{/* Logo Dark Mode */}
						<div className="space-y-2 p-4 border rounded-lg bg-muted/20">
							<Label className="text-sm font-medium text-slate-700">
								Logo Modo Oscuro
							</Label>
							<p className="text-xs text-muted-foreground mb-2">
								Para fondos claros (logo oscuro)
							</p>
							<FileUpload
								value={data?.logo?.dark?.src ?? ""}
								onChange={(src) => updateLogo("dark", "src", src)}
								accept="image/svg+xml,image/png,image/jpeg"
								placeholder="Subir logo oscuro"
								folder="logos"
							/>
							<Input
								placeholder="Texto alternativo (alt)"
								value={data?.logo?.dark?.alt ?? ""}
								onChange={(e) => updateLogo("dark", "alt", e.target.value)}
								className="h-8 text-sm"
							/>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Botón CTA Texto</Label>
						<Input
							value={data.cta.label}
							onChange={(e) => updateCta("label", e.target.value)}
							className="h-10"
						/>
					</div>
					<div className="space-y-2">
						<Label>Botón CTA Enlace</Label>
						<Input
							value={data.cta.href}
							onChange={(e) => updateCta("href", e.target.value)}
							className="h-10"
						/>
					</div>
				</div>

				<div className="space-y-3">
					<Label>Navegación</Label>
					<div className="space-y-2">
						{data.navigation.map((item, i) => (
							<div key={item.href} className="flex gap-2 items-center">
								<Input
									placeholder="Label"
									value={item.label}
									onChange={(e) => updateNav(i, "label", e.target.value)}
									className="h-10 flex-1"
								/>
								<Input
									placeholder="Enlace"
									value={item.href}
									onChange={(e) => updateNav(i, "href", e.target.value)}
									className="h-10 flex-1"
								/>
								<Button
									variant="outline"
									size="icon"
									onClick={() => removeNavItem(i)}
									className="h-10 w-10"
								>
									×
								</Button>
							</div>
						))}
						<Button
							variant="outline"
							size="sm"
							onClick={addNavItem}
							className="mt-2"
						>
							+ Añadir Enlace
						</Button>
					</div>
				</div>

				<div className="space-y-3 pt-4 border-t">
					<Label className="text-base font-medium">Enlaces en el Header</Label>
					<p className="text-sm text-muted-foreground">
						Selecciona qué enlaces aparecen en el menú del header.
					</p>
					<div className="grid grid-cols-2 gap-2">
						{data.navigation.map((item) => {
							const isSelected = (data.headerNavigation || []).includes(
								item.href,
							);
							return (
								<label
									key={item.href}
									className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
										isSelected
											? "bg-primary/10 border-primary"
											: "hover:bg-muted"
									}`}
								>
									<input
										type="checkbox"
										checked={isSelected}
										onChange={() => toggleHeaderNav(item.href)}
										className="w-4 h-4 rounded border-gray-300"
									/>
									<span className="text-sm font-medium">
										{item.label || item.href}
									</span>
								</label>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
