"use client";

import { Loader2, Save } from "lucide-react";
import { useActionState, useState } from "react";
import { saveDashboardData } from "@/app/actions/admin";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import type { FeaturedTeamContent, SiteContent } from "@/config/site-content";
import { AppSidebar } from "./components/app-sidebar";

interface DashboardProps {
	initialData: SiteContent;
}

export default function Dashboard({ initialData }: DashboardProps) {
	const [data, setData] = useState<SiteContent>(initialData);
	const [activeSection, _setActiveSection] = useState("header");
	const [saveState, saveAction, isSaving] = useActionState(saveDashboardData, {
		success: false,
		error: undefined,
	});

	const updateSection = (
		sectionKey: keyof SiteContent,
		sectionData: unknown,
	) => {
		setData((prev) => ({
			...prev,
			[sectionKey]: sectionData,
		}));
	};

	const sectionTitle =
		activeSection === "featuredProducts"
			? "Productos"
			: activeSection === "featuredBrands"
				? "Marcas"
				: activeSection === "featuredClients"
					? "Clientes"
					: activeSection === "featuredTeam"
						? "Equipo"
						: activeSection;

	return (
		<SidebarProvider>
			<AppSidebar
				activeSection={activeSection}
				onSectionChange={_setActiveSection}
			/>
			<SidebarInset className="z-0">
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white relative z-10">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage className="capitalize">
										{sectionTitle}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="ml-auto px-4">
						<form action={saveAction}>
							<input
								type="hidden"
								name="jsonContent"
								value={JSON.stringify(data)}
							/>
							<Button
								type="submit"
								disabled={isSaving}
								size="sm"
								className="gap-2"
							>
								{isSaving ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								{isSaving ? "Guardando..." : "Guardar"}
							</Button>
						</form>
					</div>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50/50 relative z-0">
					{saveState.message && (
						<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
							{saveState.message}
						</div>
					)}
					{saveState.error && (
						<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
							{saveState.error}
						</div>
					)}

					<div className="flex-1 rounded-xl md:min-h-min">
						<div className="max-w-4xl mx-auto space-y-6">
							{activeSection === "header" && (
								<HeaderForm
									data={data.header}
									onChange={(val) => updateSection("header", val)}
								/>
							)}
							{activeSection === "hero" && (
								<HeroForm
									data={data.hero}
									onChange={(val) => updateSection("hero", val)}
								/>
							)}
							{activeSection === "featuredProducts" && (
								<ProductsForm
									data={data.featuredProducts}
									onChange={(val) => updateSection("featuredProducts", val)}
								/>
							)}
							{activeSection === "featuredBrands" && (
								<BrandsForm
									data={data.featuredBrands}
									onChange={(val) => updateSection("featuredBrands", val)}
								/>
							)}
							{activeSection === "featuredClients" && (
								<ClientsForm
									data={data.featuredClients}
									onChange={(val) => updateSection("featuredClients", val)}
								/>
							)}
							{activeSection === "featuredTeam" && (
								<TeamForm
									data={data.featuredTeam}
									onChange={(val) => updateSection("featuredTeam", val)}
								/>
							)}
							{activeSection === "footer" && (
								<FooterForm
									data={data.footer}
									onChange={(val) => updateSection("footer", val)}
								/>
							)}
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

// --- HEADER FORM ---
function HeaderForm({
	data,
	onChange,
}: {
	data: SiteContent["header"];
	onChange: (d: unknown) => void;
}) {
	const updateLogo = (field: string, value: string) => {
		onChange({ ...data, logo: { ...data.logo, [field]: value } });
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>Configuración del Header</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Logo SRC</Label>
						<Input
							value={data.logo.src}
							onChange={(e) => updateLogo("src", e.target.value)}
							className="h-10"
						/>
					</div>
					<div className="space-y-2">
						<Label>Logo ALT</Label>
						<Input
							value={data.logo.alt}
							onChange={(e) => updateLogo("alt", e.target.value)}
							className="h-10"
						/>
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
			</CardContent>
		</Card>
	);
}

// --- HERO FORM ---
function HeroForm({
	data,
	onChange,
}: {
	data: SiteContent["hero"];
	onChange: (d: unknown) => void;
}) {
	const updateSlide = (index: number, field: string, value: string) => {
		const newSlides = [...data.slides];
		newSlides[index] = { ...newSlides[index], [field]: value };
		onChange({ ...data, slides: newSlides });
	};

	const updateSocialProof = (index: number, field: string, value: string) => {
		const newSocialProof = [...data.socialProof];
		newSocialProof[index] = { ...newSocialProof[index], [field]: value };
		onChange({ ...data, socialProof: newSocialProof });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Configuración del Hero</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<Label>Slides</Label>
					{data.slides.map((slide, i) => (
						<div key={slide.id} className="border p-4 rounded-lg space-y-3">
							<div className="grid grid-cols-2 gap-3">
								<Input
									placeholder="Título"
									value={slide.title}
									onChange={(e) => updateSlide(i, "title", e.target.value)}
								/>
								<Input
									placeholder="Tipo (video/image)"
									value={slide.type}
									onChange={(e) => updateSlide(i, "type", e.target.value)}
								/>
							</div>
							<Input
								placeholder="SRC (URL del video/imagen)"
								value={slide.src}
								onChange={(e) => updateSlide(i, "src", e.target.value)}
							/>
							<Input
								placeholder="Subtítulo"
								value={slide.subtitle}
								onChange={(e) => updateSlide(i, "subtitle", e.target.value)}
							/>
						</div>
					))}
				</div>

				<div className="space-y-4">
					<Label>Social Proof</Label>
					{data.socialProof.map((item, i) => (
						<div key={item.label} className="flex gap-2">
							<Input
								placeholder="Valor (ej: 500+)"
								value={item.value}
								onChange={(e) => updateSocialProof(i, "value", e.target.value)}
							/>
							<Input
								placeholder="Label"
								value={item.label}
								onChange={(e) => updateSocialProof(i, "label", e.target.value)}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

// --- PRODUCTS FORM ---
function ProductsForm({
	data,
	onChange,
}: {
	data: SiteContent["featuredProducts"];
	onChange: (d: unknown) => void;
}) {
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

// --- BRANDS FORM ---
function BrandsForm({
	data,
	onChange,
}: {
	data: SiteContent["featuredBrands"];
	onChange: (d: unknown) => void;
}) {
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
						<div className="grid grid-cols-2 gap-3">
							<Input
								placeholder="Nombre de la marca"
								value={item.name}
								onChange={(e) => updateItem(i, "name", e.target.value)}
							/>
							<Input
								placeholder="Logo (ruta)"
								value={item.logo}
								onChange={(e) => updateItem(i, "logo", e.target.value)}
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

// --- CLIENTS FORM ---
function ClientsForm({
	data,
	onChange,
}: {
	data: SiteContent["featuredClients"];
	onChange: (d: unknown) => void;
}) {
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

// --- TEAM FORM ---
function TeamForm({
	data,
	onChange,
}: {
	data: FeaturedTeamContent;
	onChange: (d: unknown) => void;
}) {
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

// --- FOOTER FORM ---
function FooterForm({
	data,
	onChange,
}: {
	data: SiteContent["footer"];
	onChange: (d: unknown) => void;
}) {
	const updateCompany = (field: string, value: string) => {
		onChange({ ...data, company: { ...data.company, [field]: value } });
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

				<div>
					<Label>Redes Sociales</Label>
					{data.socialLinks.map((link, i) => (
						<div key={link.name} className="flex gap-2 mt-2">
							<Input
								placeholder="Nombre"
								value={link.name}
								onChange={(e) => updateSocialLink(i, "name", e.target.value)}
							/>
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
