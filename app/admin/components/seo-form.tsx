"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteContent } from "@/config/site-content";

interface SEOFormProps {
	data: SiteContent["seo"];
	onChange: (d: unknown) => void;
}

export function SEOForm({ data, onChange }: SEOFormProps) {
	const seoData = data || {
		metadataBase: "",
		title: { default: "", template: "%s | Biologistics" },
		description: "",
		keywords: [],
		authors: [{ name: "" }],
		creator: "",
		robots: { index: true, follow: true, googleBot: {} },
		canonicalUrl: "",
		openGraph: {
			type: "website",
			locale: "es_PE",
			url: "",
			title: "",
			description: "",
			siteName: "Biologistics",
			images: [{ url: "", width: 1200, height: 630, alt: "" }],
		},
		twitter: {
			card: "summary_large_image",
			title: "",
			description: "",
			images: [],
		},
		themeColors: [
			{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
			{ media: "(prefers-color-scheme: dark)", color: "#000000" },
		],
	};

	const [keywordsText, setKeywordsText] = useState(
		seoData?.keywords?.join(", ") ?? "",
	);

	const updateField = (field: string, value: unknown) => {
		onChange({ ...seoData, [field]: value });
	};

	const updateTitle = (field: string, value: string) => {
		onChange({ ...seoData, title: { ...seoData.title, [field]: value } });
	};

	const updateRobots = (field: string, value: unknown) => {
		onChange({ ...seoData, robots: { ...seoData.robots, [field]: value } });
	};

	const updateOpenGraph = (field: string, value: unknown) => {
		onChange({
			...seoData,
			openGraph: { ...seoData.openGraph, [field]: value },
		});
	};

	const updateTwitter = (field: string, value: unknown) => {
		onChange({ ...seoData, twitter: { ...seoData.twitter, [field]: value } });
	};

	const updateThemeColor = (index: number, field: string, value: string) => {
		const newColors = [...seoData.themeColors];
		newColors[index] = { ...newColors[index], [field]: value };
		onChange({ ...seoData, themeColors: newColors });
	};

	const handleKeywordsChange = (value: string) => {
		setKeywordsText(value);
		const keywords = value
			.split(",")
			.map((k) => k.trim())
			.filter((k) => k.length > 0);
		updateField("keywords", keywords);
	};

	const handleAuthorChange = (index: number, field: string, value: string) => {
		const newAuthors = [...seoData.authors];
		newAuthors[index] = { ...newAuthors[index], [field]: value };
		updateField("authors", newAuthors);
	};

	const addAuthor = () => {
		updateField("authors", [...seoData.authors, { name: "" }]);
	};

	const removeAuthor = (index: number) => {
		const newAuthors = seoData.authors.filter((_, i) => i !== index);
		updateField("authors", newAuthors);
	};

	const handleImageChange = (
		index: number,
		field: string,
		value: string | number,
	) => {
		const newImages = [...seoData.openGraph.images];
		newImages[index] = { ...newImages[index], [field]: value };
		updateOpenGraph("images", newImages);
	};

	const addImage = () => {
		updateOpenGraph("images", [
			...seoData.openGraph.images,
			{ url: "", width: 1200, height: 630, alt: "" },
		]);
	};

	const removeImage = (index: number) => {
		const newImages = seoData.openGraph.images.filter((_, i) => i !== index);
		updateOpenGraph("images", newImages);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Configuración SEO</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Metadata Base */}
				<div className="space-y-2">
					<Label>URL Base del Sitio</Label>
					<Input
						value={seoData?.metadataBase ?? ""}
						onChange={(e) => updateField("metadataBase", e.target.value)}
						placeholder="https://www.biologistics.pe"
					/>
					<p className="text-xs text-muted-foreground">
						URL base de tu sitio. Importante para URLs absolutas en Open Graph.
					</p>
				</div>

				{/* Title */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Título por Defecto</Label>
						<Input
							value={seoData?.title?.default ?? ""}
							onChange={(e) => updateTitle("default", e.target.value)}
							placeholder="Biologistics - Venta de Equipos Científicos"
						/>
					</div>
					<div className="space-y-2">
						<Label>Plantilla de Título</Label>
						<Input
							value={seoData?.title?.template ?? "%s | Biologistics"}
							onChange={(e) => updateTitle("template", e.target.value)}
							placeholder="%s | Biologistics"
						/>
						<p className="text-xs text-muted-foreground">
							Usa %s para insertar el título de la página
						</p>
					</div>
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Label>Descripción Meta</Label>
					<Textarea
						value={seoData?.description ?? ""}
						onChange={(e) => updateField("description", e.target.value)}
						placeholder="Importación y venta de equipos científicos..."
						rows={3}
					/>
					<p className="text-xs text-muted-foreground">
						Descripción general del sitio (150-160 caracteres recomendado)
					</p>
				</div>

				{/* Keywords */}
				<div className="space-y-2">
					<Label>Palabras Clave (Keywords)</Label>
					<Textarea
						value={keywordsText}
						onChange={(e) => handleKeywordsChange(e.target.value)}
						placeholder="equipos científicos, laboratorio, Perú, microscopios..."
						rows={2}
					/>
					<p className="text-xs text-muted-foreground">
						Separa las palabras clave con comas
					</p>
				</div>

				{/* Authors & Creator */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Creador (Creator)</Label>
						<Input
							value={seoData?.creator ?? ""}
							onChange={(e) => updateField("creator", e.target.value)}
							placeholder="Biologistics S.A.C."
						/>
					</div>
					<div className="space-y-2">
						<Label>Autores</Label>
						<div className="space-y-2">
							{(seoData?.authors ?? []).map((author, i) => (
								<div key={`${author.name + i}`} className="flex gap-2">
									<Input
										value={author.name ?? ""}
										onChange={(e) =>
											handleAuthorChange(i, "name", e.target.value)
										}
										placeholder="Nombre del autor"
										className="flex-1"
									/>
									{(seoData?.authors?.length ?? 0) > 1 && (
										<Button
											variant="outline"
											size="icon"
											onClick={() => removeAuthor(i)}
										>
											×
										</Button>
									)}
								</div>
							))}
							<Button variant="outline" size="sm" onClick={addAuthor}>
								+ Añadir Autor
							</Button>
						</div>
					</div>
				</div>

				{/* Robots */}
				<div className="space-y-3 border p-4 rounded-lg">
					<Label className="text-base">Configuración de Robots</Label>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="index"
								checked={seoData?.robots?.index ?? true}
								onChange={(e) => updateRobots("index", e.target.checked)}
								className="rounded"
							/>
							<Label htmlFor="index" className="text-sm">
								Indexar páginas
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="follow"
								checked={seoData?.robots?.follow ?? true}
								onChange={(e) => updateRobots("follow", e.target.checked)}
								className="rounded"
							/>
							<Label htmlFor="follow" className="text-sm">
								Seguir enlaces
							</Label>
						</div>
					</div>
				</div>

				{/* Canonical URL */}
				<div className="space-y-2">
					<Label>URL Canónica</Label>
					<Input
						value={seoData?.canonicalUrl ?? ""}
						onChange={(e) => updateField("canonicalUrl", e.target.value)}
						placeholder="https://www.biologistics.pe"
					/>
				</div>

				{/* Open Graph */}
				<div className="space-y-3 border p-4 rounded-lg">
					<Label className="text-base">Open Graph (Facebook/LinkedIn)</Label>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm">Tipo</Label>
							<select
								value={seoData?.openGraph?.type ?? "website"}
								onChange={(e) => updateOpenGraph("type", e.target.value)}
								className="w-full h-10 px-3 rounded-md border bg-background"
							>
								<option value="website">Website</option>
								<option value="article">Article</option>
								<option value="product">Product</option>
							</select>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">Localidad</Label>
							<Input
								value={seoData?.openGraph?.locale ?? "es_PE"}
								onChange={(e) => updateOpenGraph("locale", e.target.value)}
								placeholder="es_PE"
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label className="text-sm">URL</Label>
							<Input
								value={seoData?.openGraph?.url ?? ""}
								onChange={(e) => updateOpenGraph("url", e.target.value)}
								placeholder="https://www.biologistics.pe"
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label className="text-sm">Título</Label>
							<Input
								value={seoData?.openGraph?.title ?? ""}
								onChange={(e) => updateOpenGraph("title", e.target.value)}
								placeholder="Biologistics - Tecnología para tu Laboratorio"
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label className="text-sm">Descripción</Label>
							<Textarea
								value={seoData?.openGraph?.description ?? ""}
								onChange={(e) => updateOpenGraph("description", e.target.value)}
								placeholder="Venta e importación de equipos científicos..."
								rows={2}
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">Nombre del Sitio</Label>
							<Input
								value={seoData?.openGraph?.siteName ?? "Biologistics"}
								onChange={(e) => updateOpenGraph("siteName", e.target.value)}
								placeholder="Biologistics"
							/>
						</div>
					</div>

					{/* OG Images */}
					<div className="space-y-2 mt-4">
						<Label className="text-sm">Imágenes para Open Graph</Label>
						{(seoData?.openGraph?.images ?? []).map((image, i) => (
							<div
								key={`${(image?.alt ?? "") + i}`}
								className="border p-3 rounded-lg space-y-2"
							>
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium">Imagen {i + 1}</span>
									{(seoData?.openGraph?.images?.length ?? 0) > 1 && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => removeImage(i)}
										>
											Eliminar
										</Button>
									)}
								</div>
								<Input
									value={image.url}
									onChange={(e) => handleImageChange(i, "url", e.target.value)}
									placeholder="URL de la imagen"
								/>
								<div className="grid grid-cols-3 gap-2">
									<Input
										type="number"
										value={image.width ?? 1200}
										onChange={(e) =>
											handleImageChange(i, "width", +e.target.value)
										}
										placeholder="Ancho"
									/>
									<Input
										type="number"
										value={image.height ?? 630}
										onChange={(e) =>
											handleImageChange(i, "height", +e.target.value)
										}
										placeholder="Alto"
									/>
									<Input
										value={image.alt}
										onChange={(e) =>
											handleImageChange(i, "alt", e.target.value)
										}
										placeholder="Texto alternativo"
									/>
								</div>
							</div>
						))}
						<Button variant="outline" size="sm" onClick={addImage}>
							+ Añadir Imagen
						</Button>
					</div>
				</div>

				{/* Twitter */}
				<div className="space-y-3 border p-4 rounded-lg">
					<Label className="text-base">Twitter Card</Label>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm">Tipo de Card</Label>
							<select
								value={seoData?.twitter?.card ?? "summary_large_image"}
								onChange={(e) => updateTwitter("card", e.target.value)}
								className="w-full h-10 px-3 rounded-md border bg-background"
							>
								<option value="summary">Summary</option>
								<option value="summary_large_image">Summary Large Image</option>
								<option value="app">App</option>
								<option value="player">Player</option>
							</select>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">Título</Label>
							<Input
								value={seoData?.twitter?.title ?? ""}
								onChange={(e) => updateTwitter("title", e.target.value)}
								placeholder="Biologistics Perú"
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label className="text-sm">Descripción</Label>
							<Textarea
								value={seoData?.twitter?.description ?? ""}
								onChange={(e) => updateTwitter("description", e.target.value)}
								placeholder="Equipos científicos y de laboratorio..."
								rows={2}
							/>
						</div>
						<div className="space-y-2 md:col-span-2">
							<Label className="text-sm">Imágenes (separadas por coma)</Label>
							<Input
								value={(seoData?.twitter?.images ?? []).join(", ")}
								onChange={(e) =>
									updateTwitter(
										"images",
										e.target.value
											.split(",")
											.map((s) => s.trim())
											.filter(Boolean),
									)
								}
								placeholder="/og-image.svg, /twitter-image.jpg"
							/>
						</div>
					</div>
				</div>

				{/* Theme Colors */}
				<div className="space-y-3 border p-4 rounded-lg">
					<Label className="text-base">Colores del Tema</Label>
					{(seoData?.themeColors ?? []).map((color, i) => (
						<div
							key={`${(color?.color ?? "") + i}`}
							className="grid grid-cols-2 gap-4"
						>
							<div className="space-y-2">
								<Label className="text-sm">Media Query</Label>
								<Input
									value={color?.media ?? "(prefers-color-scheme: light)"}
									onChange={(e) => updateThemeColor(i, "media", e.target.value)}
									placeholder="(prefers-color-scheme: light)"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-sm">Color</Label>
								<Input
									value={color?.color ?? "#ffffff"}
									onChange={(e) => updateThemeColor(i, "color", e.target.value)}
									placeholder="#ffffff"
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
