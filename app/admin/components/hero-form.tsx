"use client";

import { useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteContent } from "@/config/site-content";

interface HeroFormProps {
	data: SiteContent["hero"];
	onChange: (d: unknown) => void;
	onValidate?: (isValid: boolean) => void;
}

// Helper to check if a slide is valid
function isSlideValid(slide: SiteContent["hero"]["slides"][0]): boolean {
	// For images, just need src
	if (slide.type === "image") {
		return Boolean(slide.src && slide.src.trim() !== "");
	}
	// For videos, need both src AND poster
	if (slide.type === "video") {
		return Boolean(slide.src?.trim() !== "" && slide.poster?.trim() !== "");
	}
	return false;
}

export function HeroForm({ data, onChange, onValidate }: HeroFormProps) {
	const updateSlide = useCallback(
		(index: number, field: string, value: string) => {
			const newSlides = [...data.slides];
			newSlides[index] = { ...newSlides[index], [field]: value };
			onChange({ ...data, slides: newSlides });
		},
		[data, onChange],
	);

	const updatePoster = useCallback(
		(index: number, value: string) => {
			const newSlides = [...data.slides];
			newSlides[index] = { ...newSlides[index], poster: value };
			onChange({ ...data, slides: newSlides });
		},
		[data, onChange],
	);

	const updateSocialProof = useCallback(
		(index: number, field: string, value: string) => {
			const newSocialProof = [...data.socialProof];
			newSocialProof[index] = { ...newSocialProof[index], [field]: value };
			onChange({ ...data, socialProof: newSocialProof });
		},
		[data, onChange],
	);

	// Validate all slides and notify parent
	const validateAndNotify = useCallback(() => {
		const allValid = data.slides.every(isSlideValid);
		onValidate?.(allValid);
	}, [data.slides, onValidate]);

	// Run validation on mount and when data changes (useEffect to avoid render-time updates)
	useEffect(() => {
		validateAndNotify();
	}, [validateAndNotify]);

	const handleTitleChange = useCallback(
		(index: number, e: React.ChangeEvent<HTMLInputElement>) => {
			updateSlide(index, "title", e.target.value);
		},
		[updateSlide],
	);

	const handleSubtitleChange = useCallback(
		(index: number, e: React.ChangeEvent<HTMLInputElement>) => {
			updateSlide(index, "subtitle", e.target.value);
		},
		[updateSlide],
	);

	const handleTypeChange = useCallback(
		(index: number, e: React.ChangeEvent<HTMLSelectElement>) => {
			updateSlide(index, "type", e.target.value);
		},
		[updateSlide],
	);

	const handleSrcChange = useCallback(
		(index: number, src: string) => {
			updateSlide(index, "src", src);
		},
		[updateSlide],
	);

	const handlePosterChange = useCallback(
		(index: number, src: string) => {
			updatePoster(index, src);
		},
		[updatePoster],
	);

	const handleSocialProofChange = useCallback(
		(index: number, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
			updateSocialProof(index, field, e.target.value);
		},
		[updateSocialProof],
	);

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
							<Input
								placeholder="Título"
								value={slide.title}
								onChange={(e) => handleTitleChange(i, e)}
							/>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label className="text-xs">Tipo</Label>
									<select
										value={slide.type}
										onChange={(e) => handleTypeChange(i, e)}
										className="w-full h-10 px-3 rounded-md border bg-background"
									>
										<option value="video">Video</option>
										<option value="image">Imagen</option>
									</select>
								</div>
								<div className="space-y-2">
									<Label className="text-xs">
										{slide.type === "video" ? "Video" : "Imagen"}
									</Label>
									<FileUpload
										value={slide.src}
										onChange={(src) => handleSrcChange(i, src)}
										accept={
											slide.type === "video"
												? "video/mp4,video/webm,video/quicktime"
												: "image/*"
										}
										placeholder={
											slide.type === "video" ? "Subir video" : "Subir imagen"
										}
										folder="hero"
									/>
								</div>
							</div>
							{/* Poster upload - only for videos */}
							{slide.type === "video" && (
								<div className="space-y-2">
									<Label className="text-xs text-amber-600">
										Poster (imagen de carga)
									</Label>
									<FileUpload
										value={slide.poster ?? ""}
										onChange={(src) => handlePosterChange(i, src)}
										accept="image/*"
										placeholder="Subir imagen poster"
										folder="hero/posters"
									/>
									<p className="text-xs text-muted-foreground">
										Requerido: imagen para mostrar mientras carga el video
									</p>
								</div>
							)}
							<Input
								placeholder="Subtítulo"
								value={slide.subtitle}
								onChange={(e) => handleSubtitleChange(i, e)}
							/>
						</div>
					))}
				</div>

				<div className="space-y-4">
					<Label>Social Proof</Label>
					{data.socialProof.map((item, i) => (
						<div key={`${item.label}-${i}`} className="flex gap-2">
							<Input
								placeholder="Valor (ej: 500+)"
								value={item.value}
								onChange={(e) => handleSocialProofChange(i, "value", e)}
							/>
							<Input
								placeholder="Label"
								value={item.label}
								onChange={(e) => handleSocialProofChange(i, "label", e)}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
